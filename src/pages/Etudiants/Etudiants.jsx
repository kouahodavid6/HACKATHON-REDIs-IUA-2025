import { useState } from "react";
import { Search, Trash2 } from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";

import TitreH1PPages from "../components/TitresH1PPages";

const Etudiants = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    //const [filterTeam, setFilterTeam] = useState('');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/20 flex flex-col md:flex-row">

        {/* Overlay mobile */}
        {sidebarOpen && (
            <div
                className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
                onClick={() => setSidebarOpen(false)}
            />
        )}

        {/* Sidebar */}
        <div
            className={`fixed md:sticky top-0 z-50 transition-transform duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0 w-64 h-screen`}
        >
            {/* Croix mobile */}
            <div className="md:hidden flex justify-end p-4 absolute top-0 right-0 z-50">
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-emerald-600 hover:text-emerald-800 transition-all duration-300 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg"
                    aria-label="Fermer la sidebar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <DashboardSidebar/>
        </div>

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

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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

                        <select
                            //value={filterTeam}
                            //onChange={(e) => setFilterTeam(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                            <option value="">Toutes les équipes</option>
                            {/* {teams.map((team) => (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                            ))} */}
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Matricule</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Nom complet</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Rôle</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Équipe</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Domaine</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {filteredStudents.map((student) => ( */}
                                    <tr 
                                        // key={student.id} 
                                        className="border-b border-gray-100 hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-4 text-sm text-gray-900">23SIC00800</td>
                                        <td className="px-4 py-4 text-sm text-gray-900">Kouaho David</td>
                                        <td className="px-4 py-4 text-sm text-gray-600">emmanuel.kouaho@iua.ci</td>
                                        <td className="px-4 py-4 text-sm">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                Capitaine
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600">
                                            Easy-Team
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600">L2 Développement</td>
                                        <td className="px-4 py-4 text-right">
                                            <button
                                                // onClick={() => handleDelete(student.id)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                {/* ))} */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    </div>
    );
};

export default Etudiants;