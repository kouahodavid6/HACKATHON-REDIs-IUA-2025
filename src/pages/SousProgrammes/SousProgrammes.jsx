import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    Plus, 
    Edit, 
    Trash2, 
    ArrowLeft, 
    Clock,
    AlertCircle,
    Loader2,
    Grid3X3,
    List,
    Search,
    X,
    FolderTree,
    MoreVertical,
    Eye
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import ResponsiveSidebar from "../components/ResponsiveSidebar";
import useSousProgrammesStore from "../../stores/sousProgrammes.store";
import useProgrammesStore from "../../stores/programmes.store";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import SousProgrammesModal from "./components/SousProgrammesModal";
import ModalDetailSousProgramme from "./components/ModalDetailSousProgramme"; // NOUVEAU
import toast from "react-hot-toast";

const SousProgrammes = () => {
    const { idProgramme } = useParams();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false); // NOUVEAU
    const [sousProgrammeToDelete, setSousProgrammeToDelete] = useState(null);
    const [selectedSousProgramme, setSelectedSousProgramme] = useState(null); // NOUVEAU
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(null); // NOUVEAU

    const { 
        sousProgrammes, 
        loading, 
        error,
        listerSousProgrammes, 
        supprimerSousProgramme,
        setCurrentSousProgramme,
        clearCurrentSousProgramme,
        currentSousProgramme
    } = useSousProgrammesStore();

    const { programmes } = useProgrammesStore();

    // Récupérer les détails du programme
    const programme = programmes.find(p => p.id === idProgramme);

    // Filtrer les sous-programmes pour ce programme
    const sousProgrammesFiltres = sousProgrammes.filter(sp => 
        sp.id_programme === idProgramme || 
        !sp.id_programme
    );

    // Charger les sous-programmes au montage
    const chargerSousProgrammes = useCallback(async () => {
        try {
            await listerSousProgrammes();
        } catch (error) {
            toast.error("Erreur lors du chargement des sous-programmes");
        }
    }, [listerSousProgrammes]);

    useEffect(() => {
        chargerSousProgrammes();
    }, [chargerSousProgrammes]);

    // Navigation retour
    const handleBack = () => {
        navigate(-1);
    };

    // Gestion de l'ajout
    const handleAdd = () => {
        clearCurrentSousProgramme();
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    // Gestion de la modification
    const handleEdit = (sousProgramme) => {
        setCurrentSousProgramme(sousProgramme);
        setIsEditMode(true);
        setIsModalOpen(true);
        setDropdownOpen(null);
    };

    // Gestion de la suppression
    const handleDeleteClick = (sousProgramme) => {
        setSousProgrammeToDelete(sousProgramme);
        setDeleteModalOpen(true);
        setDropdownOpen(null);
    };

    // NOUVEAU: Gestion de la vue détaillée
    const handleViewDetails = (sousProgramme) => {
        setSelectedSousProgramme(sousProgramme);
        setDetailModalOpen(true);
        setDropdownOpen(null);
    };

    // NOUVEAU: Toggle dropdown
    const toggleDropdown = (sousProgrammeId) => {
        setDropdownOpen(dropdownOpen === sousProgrammeId ? null : sousProgrammeId);
    };

    const handleConfirmDelete = async () => {
        if (!sousProgrammeToDelete) return;
        
        setIsDeleting(true);
        try {
            await supprimerSousProgramme(sousProgrammeToDelete.id);
            setDeleteModalOpen(false);
            setSousProgrammeToDelete(null);
            toast.success("Sous-programme supprimé avec succès");
            await chargerSousProgrammes();
        } catch (error) {
            toast.error("Erreur lors de la suppression du sous-programme");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setSousProgrammeToDelete(null);
        setIsDeleting(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        clearCurrentSousProgramme();
        setIsEditMode(false);
    };

    const handleSuccess = () => {
        handleCloseModal();
        chargerSousProgrammes();
    };

    // Filtrer les sous-programmes selon la recherche
    const filteredSousProgrammes = sousProgrammesFiltres.filter(sp =>
        sp.libelle_sous_programme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sp.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Effacer la recherche
    const clearSearch = () => {
        setSearchTerm('');
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/20 flex flex-col md:flex-row">
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
                    title={`Gestion des Sous-Programmes`}
                    subtitle={programme?.titre || 'Chargement...'}
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
                                <span className="font-medium">Retour aux programmes</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Sélecteur de vue */}
                            <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-all ${
                                        viewMode === 'grid' 
                                            ? 'bg-orange-500 text-white shadow-sm' 
                                            : 'text-slate-600 hover:text-slate-800'
                                    }`}
                                >
                                    <Grid3X3 size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-all ${
                                        viewMode === 'list' 
                                            ? 'bg-orange-500 text-white shadow-sm' 
                                            : 'text-slate-600 hover:text-slate-800'
                                    }`}
                                >
                                    <List size={18} />
                                </button>
                            </div>

                            <button
                                onClick={handleAdd}
                                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 font-medium"
                            >
                                <Plus size={20} />
                                <span>Nouveau Sous-Programme</span>
                            </button>
                        </div>
                    </div>

                    {/* Carte d'information du programme */}
                    {programme && (
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                <FolderTree className="text-purple-600" size={24} />
                                            </div>
                                            <h1 className="text-2xl font-bold text-slate-900">
                                                {programme.titre}
                                            </h1>
                                        </div>
                                        <p className="text-slate-600 text-sm">
                                            Gestion des sous-programmes et activités de ce programme
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-sm text-slate-600">Sous-programmes</div>
                                            <div className="text-2xl font-bold text-slate-900">{sousProgrammesFiltres.length}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Statistiques et métriques AVEC BARRE DE RECHERCHE */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Première métrique */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-bold text-slate-900">{sousProgrammesFiltres.length}</div>
                                    <div className="text-sm text-slate-600">Sous-programmes total</div>
                                </div>
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <Clock className="text-orange-600" size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Deuxième métrique */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-bold text-slate-900">
                                        {programme?.titre || 'N/A'}
                                    </div>
                                    <div className="text-sm text-slate-600">Programme parent</div>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <FolderTree className="text-purple-600" size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Barre de recherche */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                            <div className="flex flex-col h-full justify-center">
                                <label htmlFor="search" className="text-sm font-medium text-slate-700 mb-2">
                                    Rechercher un sous-programme
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="search"
                                        placeholder="Rechercher par nom ou description..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-slate-900 placeholder-slate-400"
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
                                        {filteredSousProgrammes.length} sous-programme(s) trouvé(s)
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* États de chargement et erreurs */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-16 bg-white/50 rounded-2xl border border-slate-200">
                            <Loader2 className="animate-spin text-orange-600 mb-4" size={32} />
                            <div className="text-lg font-medium text-slate-700">Chargement des sous-programmes...</div>
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
                                        onClick={chargerSousProgrammes}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                    >
                                        Réessayer
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Liste des sous-programmes */}
                    {!loading && !error && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <h2 className="text-xl font-semibold text-slate-900">
                                    Sous-programmes du programme
                                    {searchTerm && (
                                        <span className="text-sm font-normal text-slate-500 ml-2">
                                            ({filteredSousProgrammes.length} résultat(s))
                                        </span>
                                    )}
                                </h2>

                                {/* Indicateur de recherche sur mobile */}
                                {searchTerm && (
                                    <div className="sm:hidden flex items-center gap-2 text-sm text-slate-600 bg-orange-50 px-3 py-1 rounded-full">
                                        <Search size={14} />
                                        <span>{filteredSousProgrammes.length} résultat(s)</span>
                                        <button
                                            onClick={clearSearch}
                                            className="text-slate-400 hover:text-slate-600"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {filteredSousProgrammes.length > 0 ? (
                                <div className={
                                    viewMode === 'grid' 
                                        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                                        : "space-y-4"
                                }>
                                    {filteredSousProgrammes.map((sousProgramme) => (
                                        <div
                                            key={sousProgramme.id}
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
                                                    <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg shadow-orange-500/25 flex-shrink-0">
                                                        <Clock className="text-white" size={viewMode === 'list' ? 20 : 24} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h3 className={`font-semibold text-slate-900 group-hover:text-orange-600 transition-colors ${
                                                                viewMode === 'list' ? 'text-lg' : 'text-xl'
                                                            }`}>
                                                                {sousProgramme.libelle_sous_programme}
                                                            </h3>
                                                            {/* NOUVEAU: Dropdown pour voir les détails */}
                                                            <div className="relative">
                                                                <button
                                                                    onClick={() => toggleDropdown(sousProgramme.id)}
                                                                    className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                                                                >
                                                                    <MoreVertical size={18} />
                                                                </button>
                                                                
                                                                {dropdownOpen === sousProgramme.id && (
                                                                    <div className="absolute right-0 top-8 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                                                                        <button
                                                                            onClick={() => handleViewDetails(sousProgramme)}
                                                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                                                        >
                                                                            <Eye size={16} />
                                                                            Voir détail
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className={`flex items-center gap-2 ${
                                                viewMode === 'list' 
                                                    ? 'ml-4' 
                                                    : 'mt-4 pt-4 border-t border-slate-100 justify-end'
                                            }`}>
                                                <button
                                                    onClick={() => handleEdit(sousProgramme)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                    title="Modifier le sous-programme"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(sousProgramme)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                    title="Supprimer le sous-programme"
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
                                                Aucun sous-programme ne correspond à votre recherche "{searchTerm}".
                                            </p>
                                            <button
                                                onClick={clearSearch}
                                                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all duration-200 shadow-lg shadow-orange-500/25 font-medium inline-flex items-center gap-2"
                                            >
                                                <X size={20} />
                                                Effacer la recherche
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                                <Clock className="text-slate-400" size={32} />
                                            </div>
                                            <h3 className="text-xl font-semibold text-slate-600 mb-2">
                                                Aucun sous-programme créé
                                            </h3>
                                            <p className="text-slate-500 mb-6 max-w-md mx-auto">
                                                Commencez par créer votre premier sous-programme pour organiser les activités de ce programme.
                                            </p>
                                            <button
                                                onClick={handleAdd}
                                                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all duration-200 shadow-lg shadow-orange-500/25 font-medium inline-flex items-center gap-2"
                                            >
                                                <Plus size={20} />
                                                Créer le premier sous-programme
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
            <SousProgrammesModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={handleSuccess}
                sousProgramme={currentSousProgramme}
                isEdit={isEditMode}
                idProgramme={idProgramme}
            />

            {/* NOUVEAU: Modal pour voir les détails d'un sous-programme */}
            <ModalDetailSousProgramme
                isOpen={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                sousProgramme={selectedSousProgramme}
            />

            {/* Modal de confirmation de suppression */}
            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                entityName={`le sous-programme "${sousProgrammeToDelete?.libelle_sous_programme}"`}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default SousProgrammes;