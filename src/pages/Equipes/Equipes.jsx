import { useState, useEffect } from "react";
import { Trash2, Users, Loader, Search } from 'lucide-react';
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import ResponsiveSidebar from "../components/ResponsiveSidebar";
import TitreH1PPages from "../components/TitresH1PPages";
import useEquipeStore from "../../stores/equipes.store";
import useEtudiantStore from "../../stores/etudiants.store";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import ModalMembresEquipe from "./components/ModalMembresEquipe";
import toast from "react-hot-toast";

const Equipes = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [membresModalOpen, setMembresModalOpen] = useState(false);
    const [equipeToDelete, setEquipeToDelete] = useState(null);
    const [equipeSelectionnee, setEquipeSelectionnee] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // ✅ État pour la recherche

    const { 
        equipes, 
        loading, 
        error,
        listerEquipes, 
        supprimerEquipe,
        getNombreEquipes 
    } = useEquipeStore();

    const { 
        etudiants, 
        listerEtudiants,
        loading: loadingEtudiants 
    } = useEtudiantStore();

    // Charger les équipes ET les étudiants au montage du composant
    useEffect(() => {
        const chargerDonnees = async () => {
            try {
                await Promise.all([
                    listerEquipes(),
                    listerEtudiants()
                ]);
            } catch (error) {

            }
        };

        chargerDonnees();
    }, [listerEquipes, listerEtudiants]);

    // ✅ Fonction pour obtenir les membres d'une équipe
    const getMembresEquipe = (equipeId) => {
        const equipe = equipes.find(e => e.id === equipeId);
        if (!equipe) return [];
        
        return etudiants.filter(etudiant => 
            etudiant.team_name === equipe.team_name
        );
    };

    // ✅ Fonction pour filtrer les équipes selon la recherche
    const filteredEquipes = equipes.filter(equipe => 
        equipe.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipe.domaine.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ✅ Gestion de l'affichage des membres
    const handleViewMembers = (equipe) => {
        setEquipeSelectionnee(equipe);
        setMembresModalOpen(true);
    };

    const handleCloseMembresModal = () => {
        setMembresModalOpen(false);
        setEquipeSelectionnee(null);
    };

    // Gestion de la suppression
    const handleDeleteClick = (equipe) => {
        setEquipeToDelete(equipe);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!equipeToDelete) return;
        
        setIsDeleting(true);
        try {
            await supprimerEquipe(equipeToDelete.id);
            setDeleteModalOpen(false);
            setEquipeToDelete(null);
            toast.success("Équipe supprimée avec succès");
        } catch (error) {
            toast.error("Erreur lors de la suppression de l'équipe");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setEquipeToDelete(null);
        setIsDeleting(false);
    };

    const nombreEquipes = getNombreEquipes();
    const loadingTotal = loading || loadingEtudiants;

    // ✅ Membres de l'équipe sélectionnée
    const membresEquipe = equipeSelectionnee ? getMembresEquipe(equipeSelectionnee.id) : [];

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
                    title="Équipes"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent space-y-6">
                    <TitreH1PPages 
                        title="Équipes"
                        subtitle="Gestion des équipes formées"
                    />

                    {/* ✅ Barre de recherche */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Rechercher une équipe par nom ou domaine..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Statistiques */}
                    <div className="max-w-72 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="text-2xl font-bold text-gray-900">{nombreEquipes}</div>
                        <div className="text-sm text-gray-600">Total équipes</div>
                    </div>

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
                    {loadingTotal && (
                        <div className="flex justify-center items-center py-12">
                            <Loader className="animate-spin text-blue-600 mr-2" size={20} />
                            <span className="text-gray-600">Chargement des données...</span>
                        </div>
                    )}

                    {/* Liste des équipes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {!loadingTotal && filteredEquipes.length > 0 ? (
                            filteredEquipes.map((equipe) => {
                                const membresCount = getMembresEquipe(equipe.id).length;
                                return (
                                    <div
                                        key={equipe.id}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {equipe.team_name || "Nom non défini"}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {equipe.domaine || 'Aucun domaine'}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {membresCount} membre{membresCount > 1 ? 's' : ''}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => handleDeleteClick(equipe)}
                                                className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                                                title="Supprimer l'équipe"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => handleViewMembers(equipe)}
                                            className="flex items-center gap-2 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            <Users size={18} />
                                            Voir les membres ({membresCount})
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            !loadingTotal && (
                                <div className="col-span-full text-center py-12">
                                    <div className="text-gray-400 text-lg">
                                        {searchTerm 
                                            ? 'Aucune équipe trouvée' 
                                            : 'Aucune équipe créée pour le moment'
                                        }
                                    </div>
                                    <p className="text-gray-500 text-sm mt-2">
                                        {searchTerm 
                                            ? 'Essayez avec un autre terme de recherche'
                                            : 'Les équipes apparaîtront ici une fois créées'
                                        }
                                    </p>
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Voir toutes les équipes
                                        </button>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </main>
            </div>

            {/* Modal de confirmation de suppression */}
            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                entityName={`l'équipe "${equipeToDelete?.team_name}"`}
                isDeleting={isDeleting}
            />

            {/* Modal pour afficher les membres */}
            <ModalMembresEquipe
                isOpen={membresModalOpen}
                onClose={handleCloseMembresModal}
                equipe={equipeSelectionnee}
                membres={membresEquipe}
            />
        </div>
    );
};

export default Equipes;