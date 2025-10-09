import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import ResponsiveSidebar from "../components/ResponsiveSidebar";

import HeaderSection from "../components/HeaderSection";


const Domaines = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

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