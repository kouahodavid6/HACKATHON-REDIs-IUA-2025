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
    Target,
    Search,
    Filter,
    X
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
    const [searchTerm, setSearchTerm] = useState("");
    const [scoreFilter, setScoreFilter] = useState("");
    const [showFilters, setShowFilters] = useState(false);

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

    // DEBUG : Afficher les données du classement
    useEffect(() => {
        console.log('Données du classement:', classement);
        if (classement.length > 0) {
            console.log('Première équipe:', classement[0]);
        }
    }, [classement]);

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

    // CORRIGÉ : Fonction utilitaire pour obtenir le nombre total de questions
    const getTotalQuestions = (equipe) => {
        // CORRECTION : Utiliser scoreTotalPossible depuis votre API
        const total = equipe.scoreTotalPossible;
        console.log(`Équipe ${equipe.team_name}: score=${equipe.score}, totalPossible=${total}`);
        return total;
    };

    // Filtrer le classement
    const filteredClassement = classement.filter(equipe => {
        const matchesSearch = equipe.team_name.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesScore = true;
        if (scoreFilter) {
            const totalQuestions = getTotalQuestions(equipe);
            const score = equipe.score;
            
            if (totalQuestions && totalQuestions > 0) {
                switch (scoreFilter) {
                    case "excellent":
                        matchesScore = score === totalQuestions;
                        break;
                    case "bon":
                        matchesScore = score >= Math.floor(totalQuestions * 0.7) && score < totalQuestions;
                        break;
                    case "moyen":
                        matchesScore = score >= Math.floor(totalQuestions * 0.5) && score < Math.floor(totalQuestions * 0.7);
                        break;
                    case "faible":
                        matchesScore = score < Math.floor(totalQuestions * 0.5);
                        break;
                    default:
                        matchesScore = true;
                }
            } else {
                // Si scoreTotalPossible est 0, on ne peut pas filtrer par score
                matchesScore = true;
            }
        }
        
        return matchesSearch && matchesScore;
    });

    // Réinitialiser tous les filtres
    const resetFilters = () => {
        setSearchTerm("");
        setScoreFilter("");
    };

    // Obtenir le nombre de résultats filtrés
    const resultsCount = filteredClassement.length;
    const totalCount = classement.length;

    // CORRIGÉ : Obtenir les labels des filtres
    const getFilterLabels = () => {
        const firstTeam = classement[0];
        const totalQuestions = firstTeam ? getTotalQuestions(firstTeam) : null;
        
        // CORRECTION : Si scoreTotalPossible est 0, désactiver les filtres basés sur le score
        if (!totalQuestions || totalQuestions === 0) {
            return [
                { value: "excellent", label: "Excellent", color: "bg-green-500", disabled: true },
                { value: "bon", label: "Bon", color: "bg-blue-500", disabled: true },
                { value: "moyen", label: "Moyen", color: "bg-yellow-500", disabled: true },
                { value: "faible", label: "Faible", color: "bg-red-500", disabled: true }
            ];
        }
        
        return [
            { 
                value: "excellent", 
                label: `Excellent (${totalQuestions}/${totalQuestions})`, 
                color: "bg-green-500",
                disabled: false
            },
            { 
                value: "bon", 
                label: `Bon (${Math.floor(totalQuestions * 0.7)}+)`, 
                color: "bg-blue-500",
                disabled: false
            },
            { 
                value: "moyen", 
                label: `Moyen (${Math.floor(totalQuestions * 0.5)}+)`, 
                color: "bg-yellow-500",
                disabled: false
            },
            { 
                value: "faible", 
                label: `Faible (<${Math.floor(totalQuestions * 0.5)})`, 
                color: "bg-red-500",
                disabled: false
            }
        ];
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl p-4 shadow-lg">
                                <div className="flex items-center gap-3">
                                    <Users size={24} />
                                    <div>
                                        <div className="text-2xl font-bold">{classement.length}</div>
                                        <div className="text-indigo-100">Équipes participantes</div>
                                    </div>
                                </div>
                            </div>

                            {/* CORRIGÉ : Meilleur score */}
                            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 shadow-lg">
                                <div className="flex items-center gap-3">
                                    <TrendingUp size={24} />
                                    <div>
                                        <div className="text-2xl font-bold">
                                            {classement.length > 0 ? 
                                                Math.max(...classement.map(e => e.score))
                                                : '0'
                                            }
                                        </div>
                                        <div className="text-green-100">Meilleur score</div>
                                    </div>
                                </div>
                            </div>

                            {/* CORRIGÉ : Plus bas score */}
                            <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl p-4 shadow-lg">
                                <div className="flex items-center gap-3">
                                    <TrendingUp size={24} className="rotate-90" />
                                    <div>
                                        <div className="text-2xl font-bold">
                                            {classement.length > 0 ? 
                                                Math.min(...classement.map(e => e.score))
                                                : '0'
                                            }
                                        </div>
                                        <div className="text-gray-100">Plus bas score</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Barre de recherche et filtres */}
                    {classement.length > 0 && !loadingClassement && (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                                {/* Barre de recherche */}
                                <div className="flex-1 relative">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Rechercher une équipe..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        />
                                        {searchTerm && (
                                            <button
                                                onClick={() => setSearchTerm("")}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <X size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Bouton filtre */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`flex items-center gap-2 px-4 py-3 border rounded-lg transition-colors ${
                                            showFilters || scoreFilter
                                                ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                        }`}
                                    >
                                        <Filter size={20} />
                                        Filtres
                                        {(searchTerm || scoreFilter) && (
                                            <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                {(searchTerm ? 1 : 0) + (scoreFilter ? 1 : 0)}
                                            </span>
                                        )}
                                    </button>

                                    {(searchTerm || scoreFilter) && (
                                        <button
                                            onClick={resetFilters}
                                            className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <X size={20} />
                                            Réinitialiser
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Filtres étendus */}
                            {showFilters && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Filtrer par score</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {getFilterLabels().map(filter => (
                                            <button
                                                key={filter.value}
                                                onClick={() => !filter.disabled && setScoreFilter(scoreFilter === filter.value ? "" : filter.value)}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                                                    filter.disabled
                                                        ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                                                        : scoreFilter === filter.value
                                                        ? "bg-white border-indigo-300 shadow-sm text-gray-700"
                                                        : "bg-white border-gray-300 hover:border-gray-400 text-gray-700"
                                                }`}
                                                disabled={filter.disabled}
                                                title={filter.disabled ? "Filtre non disponible (score total manquant)" : ""}
                                            >
                                                <div className={`w-3 h-3 rounded-full ${filter.color} ${filter.disabled ? 'opacity-50' : ''}`}></div>
                                                <span className="text-sm">{filter.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    {/* CORRIGÉ : Message d'information si scoreTotalPossible est 0 */}
                                    {classement.length > 0 && getTotalQuestions(classement[0]) === 0 && (
                                        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                                            Les filtres de score sont désactivés car le score total possible n'est pas défini.
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Résultats de la recherche */}
                            {(searchTerm || scoreFilter) && (
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        {resultsCount} équipe{resultsCount > 1 ? 's' : ''} trouvée{resultsCount > 1 ? 's' : ''}
                                        {totalCount > 0 && ` sur ${totalCount}`}
                                    </div>
                                    {resultsCount === 0 && (
                                        <button
                                            onClick={resetFilters}
                                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                        >
                                            Afficher toutes les équipes
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

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
                            {filteredClassement.length > 0 ? (
                                filteredClassement.map((equipe, index) => {
                                    const rank = index + 1;
                                    const medal = getMedal(rank);
                                    const MedalIcon = medal.icon;
                                    const totalQuestions = getTotalQuestions(equipe);

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

                                                        {/* CORRIGÉ : Score */}
                                                        <div className="text-right">
                                                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                                                {equipe.score}
                                                                {totalQuestions > 0 && `/${totalQuestions}`}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                Score
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* CORRIGÉ : Barre de progression seulement si totalQuestions > 0 */}
                                                {rank <= 3 && classement.length > 1 && totalQuestions && totalQuestions > 0 && (
                                                    <div className="mt-4">
                                                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                                            <span>Progression</span>
                                                            <span>{equipe.score}/{totalQuestions}</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full ${
                                                                    rank === 1 ? "bg-yellow-500" :
                                                                    rank === 2 ? "bg-gray-400" :
                                                                    "bg-orange-500"
                                                                }`}
                                                                style={{
                                                                    width: `${(equipe.score / totalQuestions) * 100}%`
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
                                    {searchTerm || scoreFilter ? (
                                        <>
                                            <Search className="text-gray-400 mx-auto mb-4" size={64} />
                                            <h3 className="text-2xl font-bold text-gray-600 mb-2">
                                                Aucune équipe trouvée
                                            </h3>
                                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                                Aucune équipe ne correspond à vos critères de recherche.
                                                Essayez de modifier vos filtres ou votre recherche.
                                            </p>
                                            <button
                                                onClick={resetFilters}
                                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                            >
                                                Réinitialiser les filtres
                                            </button>
                                        </>
                                    ) : (
                                        <>
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
                                        </>
                                    )}
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