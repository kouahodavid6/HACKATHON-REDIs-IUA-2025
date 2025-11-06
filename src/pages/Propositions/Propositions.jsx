import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Loader, AlertCircle, RefreshCw, CheckCircle, XCircle, ArrowLeft, Hash } from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import ResponsiveSidebar from "../components/ResponsiveSidebar";
import HeaderSection from "../components/HeaderSection";
import usePropositionsStore from "../../stores/propositions.store";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import PropositionsModal from "./components/PropositionsModal";
import toast from "react-hot-toast";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const Propositions = () => {
    const { idQuestion } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [propositionToDelete, setPropositionToDelete] = useState(null);
    const [currentProposition, setCurrentProposition] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    // Récupérer le libellé de la question depuis l'état de navigation
    const questionLibelle = location.state?.questionLibelle;

    const {
        propositions,
        loading,
        error,
        listerPropositions,
        supprimerProposition,
        clearError
    } = usePropositionsStore();

    // Charger les propositions
    const chargerPropositions = useCallback(async () => {
        if (!idQuestion) return;
        
        try {
            clearError();
            await listerPropositions(idQuestion);
        } catch (error) {
        }
    }, [idQuestion, clearError, listerPropositions]);

    useEffect(() => {
        chargerPropositions();
    }, [chargerPropositions, retryCount]);

    // Gestion des toasts
    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    // Gestion de l'ajout
    const handleAdd = () => {
        setCurrentProposition(null);
        setIsEditMode(false);
        setIsModalOpen(true);
        clearError();
    };

    // Gestion de la modification
    const handleEdit = (proposition) => {
        setCurrentProposition(proposition);
        setIsEditMode(true);
        setIsModalOpen(true);
        clearError();
    };

    // Gestion de la suppression
    const handleDeleteClick = (proposition) => {
        setPropositionToDelete(proposition);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!propositionToDelete) return;

        setIsDeleting(true);
        try {
            await supprimerProposition(propositionToDelete.id);

            setDeleteModalOpen(false);
            setPropositionToDelete(null);
            toast.success("Proposition supprimée avec succès");
        } catch (error) {
            toast.error(error.message || "Erreur lors de la suppression de la proposition");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setPropositionToDelete(null);
        setIsDeleting(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentProposition(null);
        setIsEditMode(false);
        clearError();
    };

    const handleSuccess = () => {
        handleCloseModal();
        // Recharger pour s'assurer d'avoir les dernières données
        chargerPropositions();
    };

    // Fonction pour réessayer le chargement
    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
        toast.loading("Nouvelle tentative de chargement...");
    };

    // Fonction pour obtenir le statut de la proposition
    const getStatutProposition = (proposition) => {
        // Vérifier les deux champs possibles (is_correct ou id_correct)
        const isCorrect = proposition.is_correct !== undefined 
            ? proposition.is_correct 
            : proposition.id_correct === 1;
        
        return {
            isCorrect,
            label: isCorrect ? 'Correcte' : 'Incorrecte',
            icon: isCorrect ? CheckCircle : XCircle,
            color: isCorrect ? 'text-green-600' : 'text-red-600',
            bgColor: isCorrect ? 'bg-green-50' : 'bg-red-50',
            borderColor: isCorrect ? 'border-green-200' : 'border-red-200'
        };
    };

    // Calcul des statistiques en temps réel
    const stats = {
        total: propositions.length,
        correctes: propositions.filter(p => 
            p.is_correct !== undefined ? p.is_correct : p.id_correct === 1
        ).length,
        incorrectes: propositions.filter(p => 
            p.is_correct !== undefined ? !p.is_correct : p.id_correct !== 1
        ).length
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
                    title="Propositions"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent space-y-6">
                    {/* Bouton retour */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Retour aux questions
                    </button>

                    {/* En-tête avec informations */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Hash className="text-purple-600" size={24} />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">Propositions</h1>
                                        {questionLibelle ? (
                                            <p className="text-gray-600">
                                                Pour la question: 
                                                <span className="font-semibold text-purple-700 ml-2">
                                                    {questionLibelle}
                                                </span>
                                            </p>
                                        ) : (
                                            <p className="text-gray-600">
                                                Gestion des propositions pour cette question
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <button
                                onClick={handleAdd}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus size={20} />
                                {loading ? 'Chargement...' : 'Ajouter une proposition'}
                            </button>
                        </div>
                    </div>

                    {/* Statistiques en temps réel */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                            <div className="text-sm text-gray-600">Total propositions</div>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                            <div className="text-2xl font-bold text-green-600">{stats.correctes}</div>
                            <div className="text-sm text-gray-600">Propositions correctes</div>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                            <div className="text-2xl font-bold text-red-600">{stats.incorrectes}</div>
                            <div className="text-sm text-gray-600">Propositions incorrectes</div>
                        </div>
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
                            <span className="text-gray-600">Chargement des propositions...</span>
                        </div>
                    )}

                    {/* Liste des propositions - MISE À JOUR AUTOMATIQUE */}
                    {!loading && !error && (
                        <div className="space-y-4">
                            {propositions.length > 0 ? (
                                propositions.map((proposition) => {
                                    const statut = getStatutProposition(proposition);
                                    const IconComponent = statut.icon;

                                    return (
                                        <div
                                            key={proposition.id}
                                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                        {proposition.libelle_propositions}
                                                    </h3>
                                                    
                                                    <div className="flex flex-wrap gap-4 text-sm">
                                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statut.bgColor} border ${statut.borderColor}`}>
                                                            <IconComponent size={16} className={statut.color} />
                                                            <span className={`font-medium ${statut.color}`}>
                                                                {statut.label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 flex-shrink-0">
                                                    <button
                                                        onClick={() => handleEdit(proposition)}
                                                        className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-800 transition-colors rounded-lg hover:bg-blue-50"
                                                        title="Modifier la proposition"
                                                        disabled={isDeleting}
                                                    >
                                                        <Edit size={16} />
                                                        <span className="hidden sm:inline">Modifier</span>
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeleteClick(proposition)}
                                                        className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-800 transition-colors rounded-lg hover:bg-red-50"
                                                        title="Supprimer la proposition"
                                                        disabled={isDeleting}
                                                    >
                                                        <Trash2 size={16} />
                                                        <span className="hidden sm:inline">Supprimer</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                                    <div className="text-gray-400 text-lg mb-2">
                                        Aucune proposition créée pour le moment
                                    </div>
                                    <p className="text-gray-500 text-sm mb-4">
                                        Créez la première proposition pour cette question
                                    </p>
                                    <button
                                        onClick={handleAdd}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Créer la première proposition
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Modal d'ajout/modification */}
                    <PropositionsModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        onSuccess={handleSuccess}
                        proposition={currentProposition}
                        isEdit={isEditMode}
                        questionId={idQuestion}
                    />

                    {/* Modal de confirmation de suppression */}
                    <DeleteConfirmModal
                        isOpen={deleteModalOpen}
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                        entityName={`la proposition "${propositionToDelete?.libelle_propositions}"`}
                        isDeleting={isDeleting}
                    />
                </main>
            </div>
        </div>
    );
};

export default Propositions;