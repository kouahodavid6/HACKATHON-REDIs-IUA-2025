import { useState } from "react";
import { Trash2, Users } from 'lucide-react';
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import ResponsiveSidebar from "../components/ResponsiveSidebar";

import TitreH1PPages from "../components/TitresH1PPages";

const Equipes = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* {teams.map((team) => ( */}
                        <div
                            // key={team.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {/* {team.name} */}
                                        Easy-Team
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        L2 Développement
                                        {/* {team.domains?.libelle || 'Aucun domaine'} */}
                                    </p>
                                </div>

                                <button
                                    //onClick={() => handleDelete(team.id)}
                                    className="text-red-600 hover:text-red-800 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <button
                                //onClick={() => handleViewMembers(team.id)}
                                className="flex items-center gap-2 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <Users size={18} />
                                Voir les membres
                            </button>
                        </div>
                    {/* ))} */}
                </div>
            </main>
        </div>
    </div>
    );
};

export default Equipes;