// 📁 src/pages/Domaines.jsx
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import ResponsiveSidebar from "../components/ResponsiveSidebar";
import HeaderSection from "../components/HeaderSection";
import useDomaineStore from "../../stores/domaines.store";
import ModalDomaine from "./components/ModalDomaine";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import toast from "react-hot-toast";

const Domaines = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [domaineToDelete, setDomaineToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { 
        domaines = [],
        loading, 
        error,
        listerDomaines, 
        supprimerDomaine,
        setCurrentDomaine,
        currentDomaine,
        clearError,
        clearSuccess
    } = useDomaineStore();

    useEffect(() => {
        const chargerDomaines = async () => {
            try {
                await listerDomaines();
            } catch (error) {
                console.error("Erreur lors du chargement des domaines:", error);
            }
        };

        chargerDomaines();
    }, [listerDomaines]);

    const handleAdd = () => {
        setCurrentDomaine(null);
        setIsEditMode(false);
        setIsModalOpen(true);
        clearError();
        clearSuccess();
    };

    const handleEdit = (domaine) => {
        setCurrentDomaine(domaine);
        setIsEditMode(true);
        setIsModalOpen(true);
        clearError();
        clearSuccess();
    };

    const handleDeleteClick = (domaine) => {
        setDomaineToDelete(domaine);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!domaineToDelete) return;
        
        setIsDeleting(true);
        try {
            await supprimerDomaine(domaineToDelete.id);
            // Recharger la liste
            await listerDomaines();
            setDeleteModalOpen(false);
            setDomaineToDelete(null);
            toast.success("Domaine supprimer avec succès !");
        } catch (error) {
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setDomaineToDelete(null);
        setIsDeleting(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentDomaine(null);
        setIsEditMode(false);
        clearError();
        clearSuccess();
    };

    const handleSuccess = () => {
        handleCloseModal();
        // Recharger la liste
        listerDomaines();
    };

    const domainesList = domaines || [];
    const hasDomaines = domainesList.length > 0;
    const isLoading = loading && domainesList.length === 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/20 flex flex-col md:flex-row">

            {/* ✅ Sidebar réutilisable */}
            <ResponsiveSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            >
                <DashboardSidebar />
            </ResponsiveSidebar>

            {/* Contenu principal */}
            <div className="flex-1 min-w-0 flex flex-col">

                <DashboardHeader
                    title="Domaines"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent space-y-6">
                    <HeaderSection
                        title="Domaines"
                        subtitle="Gestion des domaines de compétition"
                        buttonLabel="Ajouter un domaine"
                        icon={Plus}
                        onButtonClick={handleAdd}
                    />

                    {/* Message d'erreur */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                <span className="text-red-700 text-sm">{error}</span>
                            </div>
                        </div>
                    )}

                    {/* Loading state */}
                    {isLoading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">Chargement des domaines...</span>
                        </div>
                    )}

                    {/* Liste des domaines */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hasDomaines ? (
                            domainesList.map((domaine) => (
                                <div
                                    key={domaine.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {domaine.titre}
                                        </h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(domaine)}
                                                className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
                                                title="Modifier"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(domaine)}
                                                className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            !loading && (
                                <div className="col-span-full text-center py-12">
                                    <div className="text-gray-400 text-lg">
                                        Aucun domaine créé pour le moment
                                    </div>
                                    <button
                                        onClick={handleAdd}
                                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Créer le premier domaine
                                    </button>
                                </div>
                            )
                        )}
                    </div>

                    {/* Statistiques */}
                    {hasDomaines && (
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="text-sm text-gray-600">
                                Total: <span className="font-semibold">{domainesList.length}</span> domaine(s)
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal d'ajout/modification */}
            <ModalDomaine
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={handleSuccess}
                domaine={currentDomaine}
                isEdit={isEditMode}
            />

            {/* Modal de confirmation de suppression */}
            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                entityName={`le domaine "${domaineToDelete?.titre}"`}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default Domaines;