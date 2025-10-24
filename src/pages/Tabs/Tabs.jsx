import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    Plus, 
    Edit, 
    Trash2, 
    ArrowLeft, 
    FolderOpen, 
    Clock, 
    Calendar,
    Users,
    AlertCircle,
    Loader2,
    Grid3X3,
    List
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import ResponsiveSidebar from "../components/ResponsiveSidebar";
import HeaderSection from "../components/HeaderSection";
import useTabsStore from "../../stores/tabs.store";
import useEpreuveStore from "../../stores/epreuves.store";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import TabsModal from "./components/TabsModal";
import toast from "react-hot-toast";

const Tabs = () => {
    const { idEpreuve } = useParams();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [tabToDelete, setTabToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'

    const { 
        tabs, 
        loading, 
        error,
        listerTabs, 
        supprimerTab,
        setCurrentTab,
        currentTab
    } = useTabsStore();

    const { epreuves } = useEpreuveStore();

    // Récupérer les détails de l'épreuve
    const epreuve = epreuves.find(e => e.id === idEpreuve);

    // Charger les tabs au montage
    const chargerTabs = useCallback(async () => {
        try {
            await listerTabs(idEpreuve);
        } catch (error) {
            console.error("Erreur lors du chargement des tabs:", error);
            toast.error("Erreur lors du chargement des tabs");
        }
    }, [idEpreuve, listerTabs]);

    useEffect(() => {
        if (idEpreuve) {
            chargerTabs();
        }
    }, [idEpreuve, chargerTabs]);

    // Navigation retour
    const handleBack = () => {
        navigate(-1);
    };

    // Gestion de l'ajout
    const handleAdd = () => {
        setCurrentTab(null);
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    // Gestion de la modification
    const handleEdit = (tab) => {
        setCurrentTab(tab);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    // Gestion de la suppression
    const handleDeleteClick = (tab) => {
        setTabToDelete(tab);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!tabToDelete) return;
        
        setIsDeleting(true);
        try {
            await supprimerTab(tabToDelete.id);
            setDeleteModalOpen(false);
            setTabToDelete(null);
            toast.success("Tab supprimé avec succès");
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            toast.error("Erreur lors de la suppression du tab");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setTabToDelete(null);
        setIsDeleting(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentTab(null);
        setIsEditMode(false);
    };

    const handleSuccess = () => {
        handleCloseModal();
        chargerTabs();
    };

    // Formatage de la durée
    const formatDuree = (duree) => {
        const heures = Math.floor(duree / 60);
        const minutes = duree % 60;
        
        if (heures > 0) {
            return `${heures}h${minutes > 0 ? `${minutes}min` : ''}`;
        }
        return `${minutes}min`;
    };

    // Formatage de la date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 flex flex-col md:flex-row">
            {/* Sidebar */}
            <ResponsiveSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            >
                <DashboardSidebar />
            </ResponsiveSidebar>

            {/* Contenu principal */}
            <div className="flex-1 min-w-0 flex flex-col">
                <DashboardHeader
                    title={`Gestion des Tabs`}
                    subtitle={epreuve?.titre || 'Chargement...'}
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto bg-transparent space-y-6">
                    {/* Header avec navigation et actions */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 px-4 py-3 text-slate-600 hover:text-slate-800 hover:bg-white rounded-xl transition-all duration-200 border border-transparent hover:border-slate-200 hover:shadow-sm"
                            >
                                <ArrowLeft size={20} />
                                <span className="font-medium">Retour aux épreuves</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Sélecteur de vue */}
                            <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-all ${
                                        viewMode === 'grid' 
                                            ? 'bg-blue-500 text-white shadow-sm' 
                                            : 'text-slate-600 hover:text-slate-800'
                                    }`}
                                >
                                    <Grid3X3 size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-all ${
                                        viewMode === 'list' 
                                            ? 'bg-blue-500 text-white shadow-sm' 
                                            : 'text-slate-600 hover:text-slate-800'
                                    }`}
                                >
                                    <List size={18} />
                                </button>
                            </div>

                            <button
                                onClick={handleAdd}
                                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 font-medium"
                            >
                                <Plus size={20} />
                                <span>Nouveau Tab</span>
                            </button>
                        </div>
                    </div>

                    {/* Carte d'information de l'épreuve */}
                    {epreuve && (
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                    <div className="flex-1">
                                        <h1 className="text-2xl font-bold text-slate-900 mb-2">
                                            {epreuve.titre}
                                        </h1>
                                        <p className="text-slate-600 leading-relaxed">
                                            {epreuve.description}
                                        </p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                                        <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                                            <Calendar className="text-blue-600 flex-shrink-0" size={20} />
                                            <div>
                                                <div className="text-sm text-slate-600">Début</div>
                                                <div className="font-semibold text-slate-900">
                                                    {formatDate(epreuve.date_start)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                                            <Calendar className="text-emerald-600 flex-shrink-0" size={20} />
                                            <div>
                                                <div className="text-sm text-slate-600">Fin</div>
                                                <div className="font-semibold text-slate-900">
                                                    {formatDate(epreuve.date_end)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                                            <Clock className="text-purple-600 flex-shrink-0" size={20} />
                                            <div>
                                                <div className="text-sm text-slate-600">Durée</div>
                                                <div className="font-semibold text-slate-900">
                                                    {formatDuree(parseInt(epreuve.duree))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Statistiques et métriques */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-bold text-slate-900">{tabs.length}</div>
                                    <div className="text-sm text-slate-600">Tabs total</div>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <FolderOpen className="text-blue-600" size={24} />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-bold text-slate-900">
                                        {epreuve ? formatDuree(parseInt(epreuve.duree)) : '0min'}
                                    </div>
                                    <div className="text-sm text-slate-600">Durée totale</div>
                                </div>
                                <div className="p-3 bg-emerald-100 rounded-lg">
                                    <Clock className="text-emerald-600" size={24} />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-bold text-slate-900">
                                        {epreuve?.domaine_name || 'N/A'}
                                    </div>
                                    <div className="text-sm text-slate-600">Domaine</div>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <Users className="text-purple-600" size={24} />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-bold text-slate-900">
                                        {loading ? '...' : tabs.length}
                                    </div>
                                    <div className="text-sm text-slate-600">En cours</div>
                                </div>
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <Loader2 className="text-orange-600" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* États de chargement et erreurs */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-16 bg-white/50 rounded-2xl border border-slate-200">
                            <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
                            <div className="text-lg font-medium text-slate-700">Chargement des tabs...</div>
                            <div className="text-sm text-slate-500 mt-2">Veuillez patienter</div>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                            <div className="flex items-start gap-4">
                                <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={24} />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                                        Erreur de chargement
                                    </h3>
                                    <p className="text-red-700 mb-4">
                                        {error}
                                    </p>
                                    <button
                                        onClick={chargerTabs}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                    >
                                        Réessayer
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Liste des tabs */}
                    {!loading && !error && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-slate-900">
                                    Tabs de l'épreuve ({tabs.length})
                                </h2>
                            </div>

                            {tabs.length > 0 ? (
                                <div className={
                                    viewMode === 'grid' 
                                        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                                        : "space-y-4"
                                }>
                                    {tabs.map((tab) => (
                                        <div
                                            key={tab.id}
                                            className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:border-slate-300 group ${
                                                viewMode === 'list' ? 'flex items-center justify-between p-6' : 'p-6'
                                            }`}
                                        >
                                            <div className={`${viewMode === 'list' ? 'flex items-center gap-4 flex-1' : ''}`}>
                                                <div className={`flex items-start gap-4 ${viewMode === 'list' ? 'flex-1' : 'mb-4'}`}>
                                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/25">
                                                        <FolderOpen className="text-white" size={viewMode === 'list' ? 20 : 24} />
                                                    </div>

                                                    <h3 className={`font-semibold text-slate-900 group-hover:text-blue-600 transition-colors ${
                                                        viewMode === 'list' ? 'text-lg' : 'text-xl mb-2'
                                                    }`}>
                                                        {tab.titre}
                                                    </h3>
                                                </div>
                                            </div>

                                            <div className={`flex items-center gap-2 ${viewMode === 'list' ? 'ml-4' : 'mt-4 pt-4 border-t border-slate-100'}`}>
                                                <button
                                                    onClick={() => handleEdit(tab)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                    title="Modifier le tab"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(tab)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                    title="Supprimer le tab"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white/50 rounded-2xl border border-slate-200">
                                    <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                        <FolderOpen className="text-slate-400" size={32} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-600 mb-2">
                                        Aucun tab créé
                                    </h3>
                                    <p className="text-slate-500 mb-6 max-w-md mx-auto">
                                        Commencez par créer votre premier tab pour organiser le contenu de cette épreuve.
                                    </p>
                                    <button
                                        onClick={handleAdd}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/25 font-medium inline-flex items-center gap-2"
                                    >
                                        <Plus size={20} />
                                        Créer le premier tab
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* Modal d'ajout/modification */}
            <TabsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={handleSuccess}
                tab={currentTab}
                isEdit={isEditMode}
                idEpreuve={idEpreuve}
            />

            {/* Modal de confirmation de suppression */}
            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                entityName={`le tab "${tabToDelete?.titre}"`}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default Tabs;