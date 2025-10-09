import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import ResponsiveSidebar from "../components/ResponsiveSidebar";

import HeaderSection from "../components/HeaderSection";

const Questions = () => {
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
                title="Questions"
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent space-y-6">
                <HeaderSection
                    title="Questions"
                    subtitle="Gestion des questions des épreuves"
                    buttonLabel="Ajouter une question"
                    icon={Plus}
                    onButtonClick={() => setIsModalOpen(true)}
                />

                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Question</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Épreuve</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            {/* {Questions.map((question) => ( */}
                                <tr
                                    // key={Questions.id}
                                    className="border-b border-gray-100 hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                                        {/* {Questions.libelle} */}
                                        Quelle est la complexité de l'algorithme de tri à bulles ? 
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium 
                                        {
                                            question.type === 'unique'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-green-100 text-green-800'
                                        } 
                                        bg-blue-100 text-blue-800`}>
                                            {/* {question.type === 'uniue' ? 'Choix unique' : 'Choix multiple'} */}
                                            Choix unique
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {/* {question.tests?.titre || 'Aucune épreuve'} */}
                                        L2-Développement
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                // onClick={() => handleEdit(question)}
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                // onClick={() => handleDelete(question.id)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            {/* ))} */}
                        </table>
                    </div>
                </div>
            </main>
        </div>
    </div>
    );
};

export default Questions;