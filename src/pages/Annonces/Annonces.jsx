import { useState, useEffect, useCallback } from "react";
import { 
    Plus, 
    Edit, 
    Trash2, 
    Megaphone,
    Calendar,
    AlertCircle,
    Loader2,
    Grid3X3,
    List,
    Search,
    X,
    FileText
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import ResponsiveSidebar from "../components/ResponsiveSidebar";
import HeaderSection from "../components/HeaderSection";
import useAnnoncesStore from "../../stores/annonces.store";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import AnnoncesModal from "./components/AnnoncesModal";
import toast from "react-hot-toast";

const Annonces = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [annonceToDelete, setAnnonceToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');

    const { 
        annonces, 
        loading, 
        error,
        listerAnnonces, 
        supprimerAnnonce,
        setCurrentAnnonce,
        clearCurrentAnnonce,
        currentAnnonce
    } = useAnnoncesStore();

    // Charger les annonces au montage
    const chargerAnnonces = useCallback(async () => {
        try {
            await listerAnnonces();
        } catch (error) {
            console.error("Erreur lors du chargement des annonces:", error);
            toast.error("Erreur lors du chargement des annonces");
        }
    }, [listerAnnonces]);

    useEffect(() => {
        chargerAnnonces();
    }, [chargerAnnonces]);

    // Gestion de l'ajout
    const handleAdd = () => {
        clearCurrentAnnonce();
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    // Gestion de la modification
    const handleEdit = (annonce) => {
        setCurrentAnnonce(annonce);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    // Gestion de la suppression
    const handleDeleteClick = (annonce) => {
        setAnnonceToDelete(annonce);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!annonceToDelete) return;
        
        setIsDeleting(true);
        try {
            await supprimerAnnonce(annonceToDelete.id);
            setDeleteModalOpen(false);
            setAnnonceToDelete(null);
            toast.success("Annonce supprimée avec succès");
            await chargerAnnonces();
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            toast.error("Erreur lors de la suppression de l'annonce");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setAnnonceToDelete(null);
        setIsDeleting(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        clearCurrentAnnonce();
        setIsEditMode(false);
    };

    const handleSuccess = () => {
        handleCloseModal();
        chargerAnnonces();
    };

    // Filtrer les annonces selon la recherche
    const filteredAnnonces = annonces.filter(annonce =>
        annonce.libelle_annonce?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        annonce.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Effacer la recherche
    const clearSearch = () => {
        setSearchTerm('');
    };

    // Formatage de la date
    const formatDate = (dateString) => {
        if (!dateString) return 'Date non définie';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Tronquer la description pour l'affichage
    const truncateDescription = (description, length = 100) => {
        if (!description) return 'Aucune description';
        return description.length > length ? description.substring(0, length) + '...' : description;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-pink-50/20 flex flex-col md:flex-row">
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
                    title={`Gestion des Annonces`}
                    subtitle="Communiquez avec les participants du hackathon"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto bg-transparent space-y-6">
                    {/* Header avec actions */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <HeaderSection
                            title="Annonces"
                            subtitle="Publiez et gérez les annonces importantes"
                            buttonLabel="Nouvelle Annonce"
                            icon={Plus}
                            onButtonClick={handleAdd}
                        />

                        <div className="flex items-center gap-3">
                            {/* Sélecteur de vue */}
                            <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-all ${
                                        viewMode === 'grid' 
                                            ? 'bg-red-500 text-white shadow-sm' 
                                            : 'text-slate-600 hover:text-slate-800'
                                    }`}
                                >
                                    <Grid3X3 size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-all ${
                                        viewMode === 'list' 
                                            ? 'bg-red-500 text-white shadow-sm' 
                                            : 'text-slate-600 hover:text-slate-800'
                                    }`}
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Statistiques et métriques AVEC BARRE DE RECHERCHE */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Première métrique */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-bold text-slate-900">{annonces.length}</div>
                                    <div className="text-sm text-slate-600">Annonces total</div>
                                </div>
                                <div className="p-3 bg-red-100 rounded-lg">
                                    <Megaphone className="text-red-600" size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Barre de recherche */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                            <div className="flex flex-col h-full justify-center">
                                <label htmlFor="search" className="text-sm font-medium text-slate-700 mb-2">
                                    Rechercher une annonce
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="search"
                                        placeholder="Rechercher par titre ou description..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white text-slate-900 placeholder-slate-400"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={clearSearch}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors duration-200"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                {searchTerm && (
                                    <div className="text-xs text-slate-500 mt-2">
                                        {filteredAnnonces.length} annonce(s) trouvée(s)
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* États de chargement et erreurs */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-16 bg-white/50 rounded-2xl border border-slate-200">
                            <Loader2 className="animate-spin text-red-600 mb-4" size={32} />
                            <div className="text-lg font-medium text-slate-700">Chargement des annonces...</div>
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
                                        onClick={chargerAnnonces}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                    >
                                        Réessayer
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Liste des annonces */}
                    {!loading && !error && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <h2 className="text-xl font-semibold text-slate-900">
                                    Liste des annonces
                                    {searchTerm && (
                                        <span className="text-sm font-normal text-slate-500 ml-2">
                                            ({filteredAnnonces.length} résultat(s))
                                        </span>
                                    )}
                                    {!searchTerm && (
                                        <span className="text-sm font-normal text-slate-500 ml-2">
                                            ({annonces.length} total)
                                        </span>
                                    )}
                                </h2>

                                {/* Indicateur de recherche sur mobile */}
                                {searchTerm && (
                                    <div className="sm:hidden flex items-center gap-2 text-sm text-slate-600 bg-red-50 px-3 py-1 rounded-full">
                                        <Search size={14} />
                                        <span>{filteredAnnonces.length} résultat(s)</span>
                                        <button
                                            onClick={clearSearch}
                                            className="text-slate-400 hover:text-slate-600"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {filteredAnnonces.length > 0 ? (
                                <div className={
                                    viewMode === 'grid' 
                                        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                                        : "space-y-4"
                                }>
                                    {filteredAnnonces.map((annonce) => (
                                        <div
                                            key={annonce.id}
                                            className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:border-slate-300 group ${
                                                viewMode === 'list' 
                                                    ? 'flex items-center justify-between p-6' 
                                                    : 'flex flex-col h-full p-6'
                                            }`}
                                        >
                                            {/* Contenu principal */}
                                            <div className={`${
                                                viewMode === 'list' 
                                                    ? 'flex items-center gap-4 flex-1' 
                                                    : 'flex-1'
                                            }`}>
                                                <div className={`flex items-start gap-4 ${
                                                    viewMode === 'list' 
                                                        ? 'flex-1' 
                                                        : 'w-full'
                                                }`}>
                                                    <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg shadow-red-500/25 flex-shrink-0">
                                                        <Megaphone className="text-white" size={viewMode === 'list' ? 20 : 24} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className={`font-semibold text-slate-900 group-hover:text-red-600 transition-colors ${
                                                            viewMode === 'list' ? 'text-lg' : 'text-xl mb-2'
                                                        }`}>
                                                            {annonce.libelle_annonce}
                                                        </h3>
                                                        
                                                        {viewMode === 'grid' && (
                                                            <div className="text-sm text-slate-600 space-y-2 mt-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar size={14} className="text-slate-400 flex-shrink-0" />
                                                                    <span>{formatDate(annonce.date_annonce)}</span>
                                                                </div>
                                                                <p className="text-slate-500 line-clamp-3">
                                                                    {truncateDescription(annonce.description)}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {viewMode === 'list' && (
                                                    <div className="text-sm text-slate-600 space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar size={14} className="text-slate-400" />
                                                            <span>{formatDate(annonce.date_annonce)}</span>
                                                        </div>
                                                        <div className="max-w-xs truncate">
                                                            {truncateDescription(annonce.description, 50)}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className={`flex items-center gap-2 ${
                                                viewMode === 'list' 
                                                    ? 'ml-4' 
                                                    : 'mt-4 pt-4 border-t border-slate-100 justify-end'
                                            }`}>
                                                <button
                                                    onClick={() => handleEdit(annonce)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                    title="Modifier l'annonce"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(annonce)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                    title="Supprimer l'annonce"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white/50 rounded-2xl border border-slate-200">
                                    {searchTerm ? (
                                        <>
                                            <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                                <Search className="text-slate-400" size={32} />
                                            </div>
                                            <h3 className="text-xl font-semibold text-slate-600 mb-2">
                                                Aucun résultat trouvé
                                            </h3>
                                            <p className="text-slate-500 mb-6 max-w-md mx-auto">
                                                Aucune annonce ne correspond à votre recherche "{searchTerm}".
                                            </p>
                                            <button
                                                onClick={clearSearch}
                                                className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg shadow-red-500/25 font-medium inline-flex items-center gap-2"
                                            >
                                                <X size={20} />
                                                Effacer la recherche
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                                <Megaphone className="text-slate-400" size={32} />
                                            </div>
                                            <h3 className="text-xl font-semibold text-slate-600 mb-2">
                                                Aucune annonce créée
                                            </h3>
                                            <p className="text-slate-500 mb-6 max-w-md mx-auto">
                                                Commencez par créer votre première annonce pour communiquer avec les participants.
                                            </p>
                                            <button
                                                onClick={handleAdd}
                                                className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg shadow-red-500/25 font-medium inline-flex items-center gap-2"
                                            >
                                                <Plus size={20} />
                                                Créer la première annonce
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* Modal d'ajout/modification */}
            <AnnoncesModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={handleSuccess}
                annonce={currentAnnonce}
                isEdit={isEditMode}
            />

            {/* Modal de confirmation de suppression */}
            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                entityName={`l'annonce "${annonceToDelete?.libelle_annonce}"`}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default Annonces;