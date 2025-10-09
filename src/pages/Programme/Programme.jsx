import { useState } from "react";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import ResponsiveSidebar from "../components/ResponsiveSidebar";

import HeaderSection from "../components/HeaderSection";

const Programme = () => {
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
                title="Programme"
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent space-y-6">
                <HeaderSection 
                    title="Programme Principal"
                    subtitle="Gestion du programme de l'hackathon"
                    buttonLabel="Ajouter un sous-programme"
                    icon={Plus}
                    onButtonClick={() => setIsModalOpen(true)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* {subprograms.map((subprogram) => ( */}
                        <div
                            // key={subprogram.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {/* {subprogram.libelle} */}
                                    Cérémonie d'ouverture
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        // onClick={() => handleEdit(subprogram)}
                                        className="text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        // onClick={() => handleDelete(subprogram.id)}
                                        className="text-red-600 hover:text-red-800 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                                {/* {subprogram.description || 'Aucune description'} */}
                                Discours d'ouverture et présentation du hackathon
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                <Calendar size={16} />
                                <span>
                                    {/* {new Date(subprogram.date).toLocaleDateString('fr-FR')} */}
                                    09/10/2025
                                </span>
                            </div>
                        </div>
                    {/* ))} */}
                </div>
            </main>
        </div>
    </div>
    );
};

export default Programme;