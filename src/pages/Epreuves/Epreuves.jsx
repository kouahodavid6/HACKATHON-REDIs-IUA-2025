import { useState } from "react";
import { Plus, Edit, Trash2, Calendar, Clock } from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import ResponsiveSidebar from "../components/ResponsiveSidebar";

import HeaderSection from "../components/HeaderSection";

const Epreuves = () => {
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
                title="Épreuves"
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent space-y-6">
                <HeaderSection
                    title="Épreuves"
                    subtitle="Gestion des épreuves du hackathon"
                    buttonLabel="Ajouter une épreuve"
                    icon={Plus}
                    onButtonClick={() => setIsModalOpen(true)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* {tests.map((test) => ( */}
                        <div
                            // key={test.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            {/* {test.url_image && ( */}
                                <img
                                    // src={test.url_image}
                                    // alt={test.titre}
                                    className="w-full h-40 object-cover"
                                />
                            {/* )} */}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {/* {test.titre} */}
                                        Quiz Algoritmique
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            // onClick={() => handleEdit(test)}
                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            // onClick={() => handleDelete(test.id)}
                                            className="text-red-600 hover:text-red-800 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {/* {test.description || 'Aucune description'} */}
                                    yujoxisyhxus wxfgiuxhigx
                                </p>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar size={16} />
                                        <span>
                                            {/* {new Date(test.date).toLocaleDateString('fr-FR')} */}
                                            09/10/2025
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock size={16} />
                                        <span>
                                            {/* {test.duree} minutes */}
                                            30 minutes
                                        </span>
                                    </div>
                                    <div className="pt-2">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                            {/* {test.domains?.libelle || 'Aucun domaine'} */}
                                            Aucun domaine
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/* ))} */}
                </div>
            </main>
        </div>
    </div>
    );
};

export default Epreuves;