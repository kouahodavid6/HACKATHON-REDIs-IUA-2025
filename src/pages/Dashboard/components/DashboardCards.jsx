import { useEffect } from "react";
import { motion } from "framer-motion";
import {
    Users,
    ShieldHalf,
    FolderTree,
    FileText,
} from "lucide-react";
import useDomaineStore from "../../../stores/domaines.store";

const DashboardCards = () => {
    const { nombreDomaines, getNombreDomaines, loading } = useDomaineStore();

    useEffect(() => {
        getNombreDomaines();
    }, [getNombreDomaines]);

    const cards = [
        { title: "Étudiants", value: "", icon: Users, color: "bg-blue-500" },
        { title: "Équipes", value: "", icon: ShieldHalf, color: "bg-green-500" },
        {
            title: "Domaines",
            value: loading ? "..." : nombreDomaines ?? "",
            icon: FolderTree,
            color: "bg-yellow-500",
        },
        { title: "Épreuves", value: "", icon: FileText, color: "bg-red-500" },
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
