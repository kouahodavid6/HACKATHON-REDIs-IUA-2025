import { useState, useEffect, useCallback } from "react";
import { 
    Plus, 
    Edit, 
    Trash2, 
    Calendar, 
    Clock, 
    Loader, 
    Tag, 
    Image, 
    RefreshCw, 
    AlertCircle, 
    FolderOpen, 
    List,
    Trophy,
    MoreVertical,
    Eye
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import ResponsiveSidebar from "../components/ResponsiveSidebar";
import HeaderSection from "../components/HeaderSection";
import useEpreuveStore from "../../stores/epreuves.store";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import ModalEpreuve from "./components/ModalEpreuve";
import ModalDetailEpreuve from "./components/ModalDetailEpreuve";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../api/config";

const Epreuves = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [epreuveToDelete, setEpreuveToDelete] = useState(null);
    const [selectedEpreuve, setSelectedEpreuve] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(null);

    const navigate = useNavigate();

    const API_BASE_URL = API_URL;

    const { 
        epreuves, 
        loading, 
        error,
        listerEpreuves, 
        supprimerEpreuve,
        setCurrentEpreuve,
        currentEpreuve,
        clearError,
        clearSuccess
    } = useEpreuveStore();

    const getImageUrl = useCallback((imagePath) => {
        if (!imagePath) return null;
        
        if (imagePath.startsWith('http')) {
            return imagePath;
        }

        const cleanPath = imagePath.replace('url_image/', '');
        return `${API_BASE_URL}/storage/${cleanPath}`;
    }, [API_BASE_URL]);

    const chargerEpreuves = useCallback(async () => {
        try {
            clearError();
            await listerEpreuves();
        } catch (error) {
            // Erreur gérée par le store
        }
    }, [clearError, listerEpreuves]);

    useEffect(() => {
        chargerEpreuves();
    }, [chargerEpreuves, retryCount]);

    const EpreuveImage = ({ epreuve }) => {
        const [imageError, setImageError] = useState(false);
        const [imageLoading, setImageLoading] = useState(true);

        const imageUrl = getImageUrl(epreuve.url_image || epreuve.image_url);

        const handleImageError = () => {
            setImageError(true);
            setImageLoading(false);
        };

        const handleImageLoad = () => {
            setImageLoading(false);
            setImageError(false);
        };

        if (!imageUrl) {
            return (
                <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center text-gray-400">
                    <Image size={32} />
                    <span className="text-xs mt-2">Aucune image</span>
                </div>
            );
        }

        if (imageError) {
            return (
                <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center text-gray-400">
                    <Image size={32} />
                    <span className="text-xs mt-2">Image non disponible</span>
                </div>
            );
        }

        return (
            <div className="relative w-full h-40">
                {imageLoading && (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                        <Loader className="animate-spin text-gray-400" size={24} />
                        <span className="text-xs text-gray-500 ml-2">Chargement...</span>
                    </div>
                )}

                <img
                    src={imageUrl}
                    alt={epreuve.titre}
                    className={`w-full h-40 object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                />
            </div>
        );
    };

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
        toast.loading("Nouvelle tentative de chargement...");
    };

    const handleAdd = () => {
        setCurrentEpreuve(null);
        setIsEditMode(false);
        setIsModalOpen(true);
        clearError();
        clearSuccess();
    };

    const handleEdit = (epreuve) => {
        setCurrentEpreuve(epreuve);
        setIsEditMode(true);
        setIsModalOpen(true);
        clearError();
        clearSuccess();
    };

    const handleDeleteClick = (epreuve) => {
        setEpreuveToDelete(epreuve);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!epreuveToDelete) return;
        
        setIsDeleting(true);
        try {
            await supprimerEpreuve(epreuveToDelete.id);
            setDeleteModalOpen(false);
            setEpreuveToDelete(null);
            toast.success("Épreuve supprimée avec succès");
        } catch (error) {
            toast.error("Erreur lors de la suppression de l'épreuve");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setEpreuveToDelete(null);
        setIsDeleting(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentEpreuve(null);
        setIsEditMode(false);
        clearError();
        clearSuccess();
    };

    const handleSuccess = () => {
        handleCloseModal();
        chargerEpreuves();
    };

    const handleViewDetails = (epreuve) => {
        setSelectedEpreuve(epreuve);
        setDetailModalOpen(true);
        setDropdownOpen(null);
    };

    const toggleDropdown = (epreuveId) => {
        setDropdownOpen(dropdownOpen === epreuveId ? null : epreuveId);
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
                    title="Épreuves"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent space-y-6">
                    <HeaderSection
                        title="Épreuves"
                        subtitle="Gestion des épreuves du hackathon"
                        buttonLabel="Ajouter une épreuve"
                        icon={Plus}
                        onButtonClick={handleAdd}
                    />

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 max-w-xs">
                        <div className="text-2xl font-bold text-gray-900">{epreuves.length}</div>
                        <div className="text-sm text-gray-600">Total épreuves</div>
                    </div>

                    {error && error.includes('500') && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <div className="flex items-start gap-4">
                                <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={24} />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                                        Erreur du serveur
                                    </h3>
                                    <p className="text-red-700 mb-4">
                                        Le serveur rencontre actuellement des difficultés. 
                                        Veuillez réessayer dans quelques instants.
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
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                        >
                                            Recharger la page
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && !error.includes('500') && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                <span className="text-red-700 text-sm">{error}</span>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <Loader className="animate-spin text-blue-600 mr-2" size={20} />
                            <span className="text-gray-600">Chargement des épreuves...</span>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {epreuves.length > 0 ? (
                                epreuves.map((epreuve) => (
                                    <div
                                        key={epreuve.id}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <EpreuveImage epreuve={epreuve} />
                                        
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {epreuve.titre}
                                                </h3>
                                                <div className="relative">
                                                    <button
                                                        onClick={() => toggleDropdown(epreuve.id)}
                                                        className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                                                    >
                                                        <MoreVertical size={18} />
                                                    </button>
                                                    
                                                    {dropdownOpen === epreuve.id && (
                                                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                                                            <button
                                                                onClick={() => handleViewDetails(epreuve)}
                                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                            >
                                                                <Eye size={16} />
                                                                Voir détail
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(epreuve)}
                                                        className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
                                                        title="Modifier l'épreuve"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(epreuve)}
                                                        className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                                                        title="Supprimer l'épreuve"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>

                                                <div className="pt-2 flex flex-col-reverse xs:flex-row xs:items-center justify-between gap-2 xs:gap-4">
                                                    <span className="px-2 py-1 xs:px-3 xs:py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium text-center xs:text-left truncate max-w-full order-2 xs:order-1">
                                                        {epreuve.domaine_name || epreuve.id_domaine || 'Aucun domaine'}
                                                    </span>

                                                    <button
                                                        className="px-4 py-2.5 sm:px-5 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 font-medium flex items-center justify-center gap-2 group text-sm sm:text-base whitespace-nowrap flex-shrink-0 order-1 xs:order-2"
                                                        onClick={() => navigate(`/tabs/${epreuve.id}`)}
                                                    >
                                                        <FolderOpen size={16} className="sm:size-5 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                                                        <span className="truncate">Gérer les tabs</span>
                                                    </button>

                                                    <button
                                                        onClick={() => navigate(`/classement-epreuve/${epreuve.id}`)}
                                                        className="flex items-center justify-center gap-2 px-3 py-2 bg-violet-50 text-violet-600 hover:text-violet-800 transition-colors rounded-lg hover:bg-violet-100"
                                                        title="Voir le classement"
                                                    >
                                                        <Trophy size={16} />
                                                        <span className="hidden sm:inline">Classement</span>
                                                    </button>

                                                    <button
                                                        className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 font-medium flex items-center justify-center gap-2 group text-sm sm:text-base whitespace-nowrap flex-shrink-0"
                                                        onClick={() => navigate(`/questions/${epreuve.id}`)}
                                                    >
                                                        <List size={16} className="sm:size-5 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                                                        <span className="truncate">Gérer les questions</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <div className="text-gray-400 text-lg">
                                        Aucune épreuve créée pour le moment
                                    </div>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Les épreuves apparaîtront ici une fois créées
                                    </p>
                                    <button
                                        onClick={handleAdd}
                                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Créer la première épreuve
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* Modal pour ajouter/modifier une épreuve */}
            <ModalEpreuve
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={handleSuccess}
                epreuve={currentEpreuve}
                isEdit={isEditMode}
            />

            {/* Modal pour voir les détails d'une épreuve */}
            <ModalDetailEpreuve
                isOpen={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                epreuve={selectedEpreuve}
            />

            {/* Modal de confirmation de suppression */}
            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                entityName={`l'épreuve "${epreuveToDelete?.titre}"`}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default Epreuves;