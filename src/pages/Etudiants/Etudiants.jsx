import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Search, Trash2, Loader } from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import ResponsiveSidebar from "../components/ResponsiveSidebar";
import TitreH1PPages from "../components/TitresH1PPages";
import useEtudiantStore from "../../stores/etudiants.store";
import DeleteConfirmModal from "../components/DeleteConfirmModal"

const Etudiants = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [etudiantToDelete, setEtudiantToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { 
        etudiants, 
        loading, 
        error,
        listerEtudiants, 
        supprimerEtudiant,
        getStatistiques 
    } = useEtudiantStore();

    // Charger les étudiants au montage du composant
    useEffect(() => {
        const chargerEtudiants = async () => {
            try {
                await listerEtudiants();
            } catch (error) {
                console.error("Erreur lors du chargement des étudiants:", error);
            }
        };

        chargerEtudiants();
    }, [listerEtudiants]);

    // Gestion de la suppression
    const handleDeleteClick = (etudiant) => {
        setEtudiantToDelete(etudiant);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!etudiantToDelete) return;
        
        setIsDeleting(true);
        try {
            await supprimerEtudiant(etudiantToDelete.id);
            setDeleteModalOpen(false);
            setEtudiantToDelete(null);
            toast.success("Étudiant supprimer avec succès");
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setEtudiantToDelete(null);
        setIsDeleting(false);
    };

    // Filtrer les étudiants selon la recherche
    const filteredEtudiants = etudiants.filter(etudiant => 
        etudiant.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
        etudiant.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        etudiant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        etudiant.domaine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        etudiant.team_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Obtenir les statistiques
    const stats = getStatistiques();

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
                    title="Étudiants"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent space-y-6">
                    <TitreH1PPages 
                        title="Étudiants"
                        subtitle="Gestion de tous les étudiants inscrits"
                    />

                    {/* Cartes de statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                            <div className="text-sm text-gray-600">Total étudiants</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                            <div className="text-2xl font-bold text-blue-600">{stats.createurs}</div>
                            <div className="text-sm text-gray-600">Créateurs</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                            <div className="text-2xl font-bold text-green-600">{stats.membres}</div>
                            <div className="text-sm text-gray-600">Membres</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                            <div className="text-2xl font-bold text-purple-600">{stats.pourcentageCreateurs}%</div>
                            <div className="text-sm text-gray-600">Créateurs</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        {/* Barre de recherche et filtres */}
                        <div className="flex gap-4 mb-6">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Rechercher un étudiant..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        {/* Message d'erreur */}
                        {error && (
                            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                    <span className="text-red-700 text-sm">{error}</span>
                                </div>
                            </div>
                        )}

                        {/* Loading state */}
                        {loading && (
                            <div className="flex justify-center items-center py-12">
                                <Loader className="animate-spin text-blue-600 mr-2" size={20} />
                                <span className="text-gray-600">Chargement des étudiants...</span>
                            </div>
                        )}

                        {/* Tableau des étudiants */}
                        {!loading && (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Matricule</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Nom complet</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Rôle</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Domaine</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Équipe</th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredEtudiants.length > 0 ? (
                                            filteredEtudiants.map((etudiant) => (
                                                <tr 
                                                    key={etudiant.id}
                                                    className="border-b border-gray-100 hover:bg-gray-50"
                                                >
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                                        {etudiant.matricule}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-900">
                                                        {etudiant.fullname}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">
                                                        {etudiant.email}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            etudiant.role === 'createur' 
                                                                ? 'bg-blue-100 text-blue-800' 
                                                                : 'bg-green-100 text-green-800'
                                                        }`}>
                                                            {etudiant.role === 'createur' ? 'Créateur' : 'Membre'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">
                                                        {etudiant.domaine}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">
                                                        {etudiant.team_name}
                                                    </td>
                                                    <td className="px-4 py-4 text-right">
                                                        <button
                                                            onClick={() => handleDeleteClick(etudiant)}
                                                            className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                                                            title="Supprimer l'étudiant"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                                    {searchTerm ? 'Aucun étudiant trouvé' : 'Aucun étudiant inscrit'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Modal de confirmation de suppression */}
            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                entityName={`l'étudiant ${etudiantToDelete?.fullname} (${etudiantToDelete?.matricule})`}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default Etudiants;