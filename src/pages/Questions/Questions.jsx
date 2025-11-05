import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Loader, AlertCircle, RefreshCw, List, ArrowLeft, FileText, Calendar } from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import ResponsiveSidebar from "../components/ResponsiveSidebar";
import useQuestionsStore from "../../stores/questions.store";
import useEpreuveStore from "../../stores/epreuves.store";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import QuestionsModal from "./components/QuestionsModal";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const Questions = () => {
    const { idEpreuve } = useParams();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const {
        questions,
        loading,
        error,
        listerQuestions,
        supprimerQuestion,
        clearError
    } = useQuestionsStore();

    // Récupérer les informations de l'épreuve
    const { epreuves } = useEpreuveStore();
    
    // Trouver l'épreuve correspondante
    const epreuve = epreuves.find(e => e.id === idEpreuve);

    // Charger les questions
    const chargerQuestions = useCallback(async () => {
        if (!idEpreuve) return;
        
        try {
            clearError();
            await listerQuestions(idEpreuve);
        } catch (error) {
            // Erreur gérée par le store
        }
    }, [idEpreuve, clearError, listerQuestions]);

    useEffect(() => {
        chargerQuestions();
    }, [chargerQuestions, retryCount]);

    // Gestion des toasts
    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    // Gestion de l'ajout
    const handleAdd = () => {
        setCurrentQuestion(null);
        setIsEditMode(false);
        setIsModalOpen(true);
        clearError();
    };

    // Gestion de la modification
    const handleEdit = (question) => {
        setCurrentQuestion(question);
        setIsEditMode(true);
        setIsModalOpen(true);
        clearError();
    };

    // Gestion de la suppression
    const handleDeleteClick = (question) => {
        setQuestionToDelete(question);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!questionToDelete) return;
        
        setIsDeleting(true);
        try {
            await supprimerQuestion(questionToDelete.id);
            setDeleteModalOpen(false);
            setQuestionToDelete(null);
            toast.success("Question supprimée avec succès");
            
            // Recharger les questions pour s'assurer de la synchronisation
            await chargerQuestions();
            
        } catch (error) {
            toast.error(error.message || "Erreur lors de la suppression de la question");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setQuestionToDelete(null);
        setIsDeleting(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentQuestion(null);
        setIsEditMode(false);
        clearError();
    };

    const handleSuccess = () => {
        handleCloseModal();
        chargerQuestions();
    };

    // Fonction pour réessayer le chargement
    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
        toast.loading("Nouvelle tentative de chargement...");
    };

    // Fonction pour obtenir le libellé du type de question
    const getTypeLabel = (type) => {
        const types = {
            'unique': 'Choix unique',
            'multiple': 'Choix multiple',
            'texte': 'Réponse texte'
        };
        return types[type] || type;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/20 flex flex-col md:flex-row">
            <ResponsiveSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            >
                <DashboardSidebar />
            </ResponsiveSidebar>

            <div className="flex-1 min-w-0 flex flex-col">
                <DashboardHeader
                    title="Questions"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent space-y-6">
                    {/* Bouton retour */}
                    <button
                        onClick={() => navigate('/epreuves')}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Retour aux épreuves
                    </button>

                    {/* En-tête avec informations de l'épreuve */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <FileText className="text-blue-600" size={24} />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">Questions</h1>
                                        {epreuve ? (
                                            <p className="text-gray-600">
                                                Gestion des questions pour l'épreuve: 
                                                <span className="font-semibold text-blue-700 ml-2">
                                                    {epreuve.titre}
                                                </span>
                                            </p>
                                        ) : (
                                            <p className="text-gray-600">
                                                Gestion des questions de l'épreuve
                                            </p>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Informations supplémentaires sur l'épreuve */}
                                {epreuve && (
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-3">
                                        {epreuve.description_epreuve && (
                                            <div className="max-w-md">
                                                <span className="font-medium">Description:</span>
                                                <span className="ml-2">{epreuve.description_epreuve}</span>
                                            </div>
                                        )}
                                        {epreuve.domaine_name && (
                                            <div className="flex items-center gap-1">
                                                <span className="font-medium">Domaine:</span>
                                                <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                                    {epreuve.domaine_name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            <button
                                onClick={handleAdd}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus size={20} />
                                {loading ? 'Chargement...' : 'Ajouter une question'}
                            </button>
                        </div>
                    </div>

                    {/* Statistiques */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                            <div className="text-2xl font-bold text-gray-900">{questions.length}</div>
                            <div className="text-sm text-gray-600">Total questions</div>
                        </div>

                        {epreuve && (
                            <>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                    <Calendar size={26} color="blue" />
                                    <div className="text-sm font-medium text-gray-900">
                                        {new Date(epreuve.date_start).toLocaleString('fr-FR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                    <div className="text-sm text-gray-600">Date de début</div>
                                </div>

                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                    <Calendar size={26} color="blue" />
                                    <div className="text-sm font-medium text-gray-900">
                                        {new Date(epreuve.date_end).toLocaleString('fr-FR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                    <div className="text-sm text-gray-600">Date de fin</div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Message d'erreur */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <div className="flex items-start gap-4">
                                <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={24} />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                                        Erreur
                                    </h3>
                                    <p className="text-red-700 mb-4">
                                        {error}
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleRetry}
                                            disabled={loading}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                        >
                                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                                            {loading ? "Chargement..." : "Réessayer"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Loading state */}
                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <Loader className="animate-spin text-blue-600 mr-2" size={20} />
                            <span className="text-gray-600">Chargement des questions...</span>
                        </div>
                    )}

                    {/* Liste des questions */}
                    {!loading && !error && (
                        <div className="space-y-4">
                            {questions.length > 0 ? (
                                questions.map((question) => (
                                    <div
                                        key={question.id}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                    {question.libelle}
                                                </h3>
                                                
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <List size={16} />
                                                        <span>Type: </span>
                                                        <span className="font-medium text-blue-600">
                                                            {getTypeLabel(question.type)}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2">
                                                        <span>Temps: </span>
                                                        <span className="font-medium text-green-600">
                                                            {question.time_in_seconds} secondes
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 flex-shrink-0">
                                                <button
                                                    onClick={() => navigate(`/propositions/${question.id}`, { 
                                                        state: { questionLibelle: question.libelle } 
                                                    })}
                                                    className="flex items-center gap-2 px-3 py-2 text-purple-600 hover:text-purple-800 transition-colors rounded-lg hover:bg-purple-50"
                                                    title="Gérer les propositions"
                                                >
                                                    <List size={16} />
                                                    <span className="hidden sm:inline">Propositions</span>
                                                </button>

                                                <button
                                                    onClick={() => handleEdit(question)}
                                                    className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-800 transition-colors rounded-lg hover:bg-blue-50"
                                                    title="Modifier la question"
                                                    disabled={isDeleting}
                                                >
                                                    <Edit size={16} />
                                                    <span className="hidden sm:inline">Modifier</span>
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteClick(question)}
                                                    className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-800 transition-colors rounded-lg hover:bg-red-50"
                                                    title="Supprimer la question"
                                                    disabled={isDeleting}
                                                >
                                                    <Trash2 size={16} />
                                                    <span className="hidden sm:inline">Supprimer</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                                    <div className="text-gray-400 text-lg mb-2">
                                        Aucune question créée pour le moment
                                    </div>
                                    <p className="text-gray-500 text-sm mb-4">
                                        {epreuve ? 
                                            `Commencez par créer la première question pour l'épreuve "${epreuve.titre}"` :
                                            'Les questions apparaîtront ici une fois créées'
                                        }
                                    </p>
                                    <button
                                        onClick={handleAdd}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Créer la première question
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Modal d'ajout/modification */}
                    <QuestionsModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        onSuccess={handleSuccess}
                        question={currentQuestion}
                        isEdit={isEditMode}
                        epreuveId={idEpreuve}
                    />

                    {/* Modal de confirmation de suppression */}
                    <DeleteConfirmModal
                        isOpen={deleteModalOpen}
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                        entityName={`la question "${questionToDelete?.libelle}"`}
                        isDeleting={isDeleting}
                    />
                </main>
            </div>
        </div>
    );
};

export default Questions;