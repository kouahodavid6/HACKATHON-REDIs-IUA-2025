import { useState } from "react";
import { Plus, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import ResponsiveSidebar from "../components/ResponsiveSidebar";

import HeaderSection from "../components/HeaderSection";

const Propositions = () => {
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
                title="Propositions"
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent space-y-6">
                <HeaderSection 
                    title="Propositions"
                    subtitle="Gestion des propositions de réponses"
                    buttonLabel="Ajouter une proposition"
                    icon={Plus}
                    onButtonClick={() => setIsModalOpen(true)}
                />

                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Proposition</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Question</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Correcte</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {proposals.map((proposal) => ( */}
                                    <tr 
                                        // key={proposal.id} 
                                        className="border-b border-gray-100 hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                                            {/* {proposal.libelle} */}
                                            Laravel
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-md">
                                            {/* {proposal.questions?.libelle || 'Aucune question'} */}
                                            Quel framework JavaScript est recommandé pour React ?
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {/* {proposal.is_correct ? (
                                                <CheckCircle className="inline text-green-600" size={20} />
                                            ) : (
                                                <XCircle className="inline text-red-600" size={20} />
                                            )} */}
                                            <XCircle className="inline text-red-600" size={20} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    // onClick={() => handleEdit(proposal)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    // onClick={() => handleDelete(proposal.id)}
                                                    className="text-red-600 hover:text-red-800 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
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

export default Propositions;