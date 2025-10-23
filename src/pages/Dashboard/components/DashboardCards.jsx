import { useEffect } from "react";
import { motion } from "framer-motion";
import {
    Users,
    ShieldHalf,
    FolderTree,
    FileText,
} from "lucide-react";
import useDomaineStore from "../../../stores/domaines.store";
import useEtudiantStore from "../../../stores/etudiants.store";
import useEquipeStore from "../../../stores/equipes.store";
import useEpreuveStore from "../../../stores/epreuves.store";

const DashboardCards = () => {
    const { nombreDomaines, getNombreDomaines, loading: loadingDomaines } = useDomaineStore();
    const { listerEtudiants, getStatistiques, loading: loadingEtudiants } = useEtudiantStore();
    const { listerEquipes, getNombreEquipes, loading: loadingEquipes } = useEquipeStore();
    const { listerEpreuves, getNombreEpreuves, loading: loadingEpreuve } = useEpreuveStore();

    // Charger les données au montage
    useEffect(() => {
        const chargerDonnees = async () => {
            try {
                await Promise.all([
                    getNombreDomaines(),
                    listerEtudiants(),
                    listerEquipes(),
                    listerEpreuves()
                ]);
            } catch (error) {
                console.error("Erreur lors du chargement des données:", error);
            }
        };

        chargerDonnees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // ✅ Désactivation ESLint pour cette ligne

    const statsEtudiants = getStatistiques();
    const nombreEquipes = getNombreEquipes();
    const nombreEpreuve = getNombreEpreuves();
    const loading = loadingDomaines || loadingEtudiants || loadingEquipes || loadingEpreuve;

    const cards = [
        { 
            title: "Étudiants", 
            value: loading ? "..." : statsEtudiants.total,
            icon: Users, 
            color: "bg-blue-500" 
        },
        { 
            title: "Équipes", 
            value: loading ? "..." : nombreEquipes,
            icon: ShieldHalf, 
            color: "bg-green-500" 
        },
        {
            title: "Domaines",
            value: loading ? "..." : nombreDomaines,
            icon: FolderTree,
            color: "bg-yellow-500",
        },
        { 
            title: "Épreuves", 
            value: loading ? "..." : nombreEpreuve, 
            icon: FileText, 
            color: "bg-red-500" 
        },
    ];

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                <div
                    key={card.title}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">{card.title}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {card.value}
                        </p>
                    </div>
                    <div className={`${card.color} p-3 rounded-lg`}>
                        <Icon className="text-white" size={24} />
                    </div>
                    </div>
                </div>
                );
            })}
        </motion.div>
    );
};

export default DashboardCards;