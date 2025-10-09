import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";

import HeaderSection from "../components/HeaderSection";


const Domaines = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                title="Domaines"
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent space-y-6">
                <HeaderSection
                    title="Domaines"
                    subtitle="Gestion des domaines de compétition"
                    buttonLabel="Ajouter un domaine"
                    icon={Plus}
                    onButtonClick={() => setIsModalOpen(true)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* {domains.map((domain) => ( */}
                        <div
                            // key={domain.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {/* {domain.libelle} */}
                                    L1 Développement
                                </h3>
                                <div className="flex gap-2">
                                <button
                                    // onClick={() => handleEdit(domain)}
                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    // onClick={() => handleDelete(domain.id)}
                                    className="text-red-600 hover:text-red-800 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm">
                                {/* {domain.description || 'Aucune description'} */}
                                Licence 1 - Développement web et ou mobile
                            </p>
                        </div>
                    {/* ))} */}
                </div>
            </main>
        </div>
    </div>
    );
};

export default Domaines;