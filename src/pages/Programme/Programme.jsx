import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Plus, 
    Edit, 
    Trash2, 
    Calendar,
    AlertCircle,
    Loader2,
    Grid3X3,
    List,
    Search,
    X,
    Folder
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import ResponsiveSidebar from "../components/ResponsiveSidebar";
import HeaderSection from "../components/HeaderSection";
import useProgrammesStore from "../../stores/programmes.store";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import ProgrammeModal from "./components/ProgrammeModal";
import toast from "react-hot-toast";

const Programmes = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [programmeToDelete, setProgrammeToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');

    const { 
        programmes, 
        loading, 
        error,
        listerProgrammes, 
        supprimerProgramme,
        setCurrentProgramme,
        clearCurrentProgramme,
        currentProgramme
    } = useProgrammesStore();

    // Charger les programmes au montage
    const chargerProgrammes = useCallback(async () => {
        try {
            await listerProgrammes();
        } catch (error) {
            console.error("Erreur lors du chargement des programmes:", error);
            toast.error("Erreur lors du chargement des programmes");
        }
    }, [listerProgrammes]);

    useEffect(() => {
        chargerProgrammes();
    }, [chargerProgrammes]);

    // Gestion de l'ajout
    const handleAdd = () => {
        clearCurrentProgramme();
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    // Gestion de la modification
    const handleEdit = (programme) => {
        setCurrentProgramme(programme);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    // Gestion de la suppression
    const handleDeleteClick = (programme) => {
        setProgrammeToDelete(programme);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!programmeToDelete) return;
        
        setIsDeleting(true);
        try {
            await supprimerProgramme(programmeToDelete.id);
            setDeleteModalOpen(false);
            setProgrammeToDelete(null);
            toast.success("Programme supprimé avec succès");
            await chargerProgrammes();
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            toast.error("Erreur lors de la suppression du programme");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setProgrammeToDelete(null);
        setIsDeleting(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        clearCurrentProgramme();
        setIsEditMode(false);
    };

    const handleSuccess = () => {
        handleCloseModal();
        chargerProgrammes();
    };

    // Navigation vers les sous-programmes
    const handleGérerSousProgrammes = (programme) => {
        navigate(`/sous-programmes/${programme.id}`);
    };

    // Filtrer les programmes selon la recherche
    const filteredProgrammes = programmes.filter(programme =>
        programme.titre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Effacer la recherche
    const clearSearch = () => {
        setSearchTerm('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/20 flex flex-col md:flex-row">
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
                    title={`Gestion des Programmes`}
                    subtitle="Organisez les programmes du hackathon"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto bg-transparent space-y-6">
                    {/* Header avec actions */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <HeaderSection
                            title="Programmes"
                            subtitle="Créez et gérez les programmes du hackathon"
                            buttonLabel="Nouveau Programme"
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
                        </div>
                    </div>

                    {/* Statistiques et métriques AVEC BARRE DE RECHERCHE */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Première métrique */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-bold text-slate-900">{programmes.length}</div>
                                    <div className="text-sm text-slate-600">Programmes total</div>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Calendar className="text-blue-600" size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Barre de recherche */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                            <div className="flex flex-col h-full justify-center">
                                <label htmlFor="search" className="text-sm font-medium text-slate-700 mb-2">
                                    Rechercher un programme
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="search"
                                        placeholder="Rechercher par nom..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-slate-900 placeholder-slate-400"
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
                                        {filteredProgrammes.length} programme(s) trouvé(s)
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* États de chargement et erreurs */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-16 bg-white/50 rounded-2xl border border-slate-200">
                            <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
                            <div className="text-lg font-medium text-slate-700">Chargement des programmes...</div>
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
                                        onClick={chargerProgrammes}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                    >
                                        Réessayer
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Liste des programmes */}
                    {!loading && !error && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <h2 className="text-xl font-semibold text-slate-900">
                                    Liste des programmes
                                    {searchTerm && (
                                        <span className="text-sm font-normal text-slate-500 ml-2">
                                            ({filteredProgrammes.length} résultat(s))
                                        </span>
                                    )}
                                    {!searchTerm && (
                                        <span className="text-sm font-normal text-slate-500 ml-2">
                                            ({programmes.length} total)
                                        </span>
                                    )}
                                </h2>

                                {/* Indicateur de recherche sur mobile */}
                                {searchTerm && (
                                    <div className="sm:hidden flex items-center gap-2 text-sm text-slate-600 bg-blue-50 px-3 py-1 rounded-full">
                                        <Search size={14} />
                                        <span>{filteredProgrammes.length} résultat(s)</span>
                                        <button
                                            onClick={clearSearch}
                                            className="text-slate-400 hover:text-slate-600"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {filteredProgrammes.length > 0 ? (
                                <div className={
                                    viewMode === 'grid' 
                                        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                                        : "space-y-4"
                                }>
                                    {filteredProgrammes.map((programme) => (
                                        <div
                                            key={programme.id}
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
                                                    <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/25 flex-shrink-0">
                                                        <Calendar className="text-white" size={viewMode === 'list' ? 20 : 24} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className={`font-semibold text-slate-900 group-hover:text-purple-600 transition-colors ${
                                                            viewMode === 'list' ? 'text-lg' : 'text-xl mb-2'
                                                        }`}>
                                                            {programme.titre}
                                                        </h3>

                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className={`flex items-center gap-2 ${
                                                viewMode === 'list' 
                                                    ? 'ml-4' 
                                                    : 'mt-4 pt-4 border-t border-slate-100 justify-end'
                                            }`}>
                                                {/* Bouton Gérer les sous-programmes */}
                                                <button
                                                    onClick={() => handleGérerSousProgrammes(programme)}
                                                    className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 font-medium flex items-center gap-1.5 text-xs sm:text-sm whitespace-nowrap"
                                                    title="Gérer les sous-programmes"
                                                >
                                                    <Folder size={14} className="sm:size-4" />
                                                    <span className="hidden sm:inline">Sous-programmes</span>
                                                </button>
                                                
                                                <button
                                                    onClick={() => handleEdit(programme)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                    title="Modifier le programme"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(programme)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                    title="Supprimer le programme"
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
                                                Aucun programme ne correspond à votre recherche "{searchTerm}".
                                            </p>
                                            <button
                                                onClick={clearSearch}
                                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/25 font-medium inline-flex items-center gap-2"
                                            >
                                                <X size={20} />
                                                Effacer la recherche
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                                <Calendar className="text-slate-400" size={32} />
                                            </div>
                                            <h3 className="text-xl font-semibold text-slate-600 mb-2">
                                                Aucun programme créé
                                            </h3>
                                            <p className="text-slate-500 mb-6 max-w-md mx-auto">
                                                Commencez par créer votre premier programme pour organiser le hackathon.
                                            </p>
                                            <button
                                                onClick={handleAdd}
                                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/25 font-medium inline-flex items-center gap-2"
                                            >
                                                <Plus size={20} />
                                                Créer le premier programme
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
            <ProgrammeModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={handleSuccess}
                programme={currentProgramme}
                isEdit={isEditMode}
            />

            {/* Modal de confirmation de suppression */}
            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                entityName={`le programme "${programmeToDelete?.titre}"`}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default Programmes;