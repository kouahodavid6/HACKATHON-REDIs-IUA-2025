import { useState, useEffect, useCallback } from "react";
import { 
    Trophy, 
    Medal, 
    Users,
    Calendar,
    ArrowLeft,
    Loader,
    AlertCircle,
    Crown,
    Star,
    TrendingUp,
    Target
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import ResponsiveSidebar from "../components/ResponsiveSidebar";
import useEpreuveStore from "../../stores/epreuves.store";
import toast from "react-hot-toast";

const ClassementEquipesEpreuve = () => {
    const { idEpreuve } = useParams();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const {
        classement,
        loadingClassement,
        error,
        getClassementEpreuve,
        getEpreuveById,
        clearError,
        clearClassement
    } = useEpreuveStore();

    // Récupérer les informations de l'épreuve
    const epreuve = getEpreuveById(idEpreuve);

    // Charger le classement
    const chargerClassement = useCallback(async () => {
        if (!idEpreuve) return;
        
        try {
            clearError();
            await getClassementEpreuve(idEpreuve);
        } catch (error) {
            console.error("Erreur lors du chargement du classement:", error);
            toast.error("Erreur lors du chargement du classement");
        }
    }, [idEpreuve, clearError, getClassementEpreuve]);

    useEffect(() => {
        chargerClassement();

        // Nettoyer le classement quand on quitte la page
        return () => {
            clearClassement();
        };
    }, [chargerClassement, clearClassement]);

    // Gestion des erreurs
    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    // Fonction pour obtenir la médaille selon le rang
    const getMedal = (rank) => {
        switch (rank) {
            case 1:
                return { icon: Crown, color: "text-yellow-500", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" };
            case 2:
                return { icon: Medal, color: "text-gray-400", bgColor: "bg-gray-50", borderColor: "border-gray-200" };
            case 3:
                return { icon: Medal, color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200" };
            default:
                return { icon: Target, color: "text-blue-500", bgColor: "bg-blue-50", borderColor: "border-blue-200" };
        }
    };

    // Formater la date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex flex-col md:flex-row">
            <ResponsiveSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            >
                <DashboardSidebar />
            </ResponsiveSidebar>

            <div className="flex-1 min-w-0 flex flex-col">
                <DashboardHeader
                    title="Classement des Équipes"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent">
                    {/* Bouton retour */}
                    <div className="mb-6">
                        <button
                            onClick={() => navigate('/epreuves')}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md"
                        >
                            <ArrowLeft size={20} />
                            Retour aux épreuves
                        </button>
                    </div>

                    {/* En-tête avec informations de l'épreuve */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl shadow-lg">
                                <Trophy className="text-white" size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Classement des Équipes
                                </h1>
                                {epreuve ? (
                                    <div className="space-y-1">
                                        <p className="text-lg text-gray-700">
                                            Épreuve: <span className="font-semibold text-indigo-600">{epreuve.titre}</span>
                                        </p>
                                        {epreuve.description_epreuve && (
                                            <p className="text-gray-600 max-w-2xl">
                                                {epreuve.description_epreuve}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-600">Chargement des informations de l'épreuve...</p>
                                )}
                            </div>
                        </div>

                        {/* Statistiques du classement */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl p-4 shadow-lg">
                                <div className="flex items-center gap-3">
                                    <Users size={24} />
                                    <div>
                                        <div className="text-2xl font-bold">{classement.length}</div>
                                        <div className="text-indigo-100">Équipes participantes</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 shadow-lg">
                                <div className="flex items-center gap-3">
                                    <TrendingUp size={24} />
                                    <div>
                                        <div className="text-2xl font-bold">
                                            {classement.length > 0 ? Math.max(...classement.map(e => e.score)) : 0}
                                        </div>
                                        <div className="text-green-100">Meilleur score</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Loading state */}
                    {loadingClassement && (
                        <div className="flex justify-center items-center py-16">
                            <Loader className="animate-spin text-indigo-600 mr-3" size={28} />
                            <span className="text-xl text-gray-600">Chargement du classement...</span>
                        </div>
                    )}

                    {/* Message d'erreur */}
                    {error && !loadingClassement && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                            <AlertCircle className="text-red-500 mx-auto mb-3" size={32} />
                            <h3 className="text-lg font-semibold text-red-800 mb-2">
                                Erreur de chargement
                            </h3>
                            <p className="text-red-700 mb-4">
                                {error}
                            </p>
                            <button
                                onClick={chargerClassement}
                                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Réessayer
                            </button>
                        </div>
                    )}

                    {/* Classement */}
                    {!loadingClassement && !error && (
                        <div className="space-y-4">
                            {classement.length > 0 ? (
                                classement.map((equipe, index) => {
                                    const rank = index + 1;
                                    const medal = getMedal(rank);
                                    const MedalIcon = medal.icon;

                                    return (
                                        <div
                                            key={equipe.id}
                                            className={`bg-white rounded-xl shadow-lg border-2 ${medal.borderColor} transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                                                rank <= 3 ? "transform -translate-y-1" : ""
                                            }`}
                                        >
                                            <div className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4 flex-1">
                                                        {/* Rang et médaille */}
                                                        <div className={`flex items-center justify-center w-16 h-16 rounded-full ${medal.bgColor} border-2 ${medal.borderColor}`}>
                                                            <MedalIcon className={medal.color} size={24} />
                                                            <span className={`ml-1 text-lg font-bold ${medal.color}`}>
                                                                {rank}
                                                            </span>
                                                        </div>

                                                        {/* Informations de l'équipe */}
                                                        <div className="flex-1">
                                                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                                {equipe.team_name}
                                                            </h3>
                                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar size={14} />
                                                                    <span>
                                                                        Fini le {formatDate(equipe.created_at)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Score */}
                                                        <div className="text-right">
                                                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                                                {equipe.score} pts
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                Score total
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Barre de progression visuelle pour le top 3 */}
                                                {rank <= 3 && classement.length > 1 && (
                                                    <div className="mt-4">
                                                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                                            <span>Progression</span>
                                                            <span>{equipe.score} pts</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full ${
                                                                    rank === 1 ? "bg-yellow-500" :
                                                                    rank === 2 ? "bg-gray-400" :
                                                                    "bg-orange-500"
                                                                }`}
                                                                style={{
                                                                    width: `${(equipe.score / classement[0].score) * 100}%`
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                                    <Trophy className="text-gray-400 mx-auto mb-4" size={64} />
                                    <h3 className="text-2xl font-bold text-gray-600 mb-2">
                                        Aucune équipe inscrite
                                    </h3>
                                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                        Aucune équipe n'a encore participé à cette épreuve. 
                                        Le classement apparaîtra ici dès que les premières équipes auront commencé.
                                    </p>
                                    <div className="flex justify-center gap-4">
                                        <button
                                            onClick={() => navigate('/epreuves')}
                                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                        >
                                            Retour aux épreuves
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Légende pour les mobiles */}
                    {classement.length > 0 && (
                        <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Star className="text-indigo-600" size={16} />
                                <span className="text-sm font-semibold text-indigo-800">Légende du classement</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-indigo-700">
                                <div className="flex items-center gap-1">
                                    <Crown className="text-yellow-500" size={12} />
                                    <span>1ère place - Or</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Medal className="text-gray-400" size={12} />
                                    <span>2ème place - Argent</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Medal className="text-orange-500" size={12} />
                                    <span>3ème place - Bronze</span>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ClassementEquipesEpreuve;