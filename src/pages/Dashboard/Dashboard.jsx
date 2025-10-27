import { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import ResponsiveSidebar from "../components/ResponsiveSidebar";
import { Calendar } from "lucide-react";
import { data } from "../../data/data";
import { motion } from "framer-motion";
import DashboardCards from "./components/DashboardCards";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Récupération des données depuis le fichier data.js
  const { modules } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 flex flex-col md:flex-row">

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
          title="Tableau de bord"
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent space-y-6">
          {/* Section Bienvenue */}
          <motion.div 
            className="bg-gradient-to-r from-[#121c32] to-[#090f1b] rounded-2xl p-6 sm:p-8 text-white shadow-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  Bienvenue à vous, Administrateur du <br/> HACKATHON-REDIs-IUA-2025
                </h1>

                <p className="text-blue-300 mt-2">
                  Vue d'ensemble du HackaRedis IUA
                </p>
              </div>
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="hidden sm:block"
              >
                <Calendar className="w-12 h-12 text-white" />
              </motion.div>
            </div>
          </motion.div>

          <DashboardCards />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Modules disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <a
                    key={module.title}
                    href={module.path}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:-translate-y-1"
                  >
                    <div className={`${module.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <h3 className="font-semibold text-gray-900">{module.title}</h3>
                  </a>
                );
              })}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;