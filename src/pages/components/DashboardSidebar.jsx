import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';
import {
    Store,
    LayoutDashboard,
    Users,
    ShieldHalf,
    FolderTree,
    FileText,
    HelpCircle,
    ListChecks,
    Calendar,
    CalendarDays,
    Bell,
    LogOut,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import ConfirmLogoutModal from '../../components/ConfirmLogoutModal';

const DashboardSidebar = () => {
    const location = useLocation();
    const [isModalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleConfirmLogout = async () => {
        try {
                localStorage.removeItem('token');
                navigate('/login');
                toast.success('Déconnexion effectuée avec succès !');
        } catch (error) {
            toast.error('Erreur lors de la déconnexion !');
            console.error('Erreur:', error);
        }
    };

    const isActive = (path) => location.pathname === path;

    const sidebarItems = [
        { path: '/dashboard', name: 'Tableau de bord', icon: <LayoutDashboard className="h-5 w-5" /> },
        { path: '/etudiants', name: 'Étudiants', icon: <Users className="h-5 w-5" /> },
        { path: '/equipes', name: 'Équipes', icon: <ShieldHalf className="h-5 w-5" /> },
        { path: '/domaines', name: 'Domaines', icon: <FolderTree className="h-5 w-5" /> },
        { path: '/epreuves', name: 'Épreuves', icon: <FileText className="h-5 w-5" /> },
        { path: '/questions', name: 'Questions', icon: <HelpCircle className="h-5 w-5" /> },
        { path: '/propositions', name: 'Propositions', icon: <ListChecks className="h-5 w-5" /> },
        { path: '/programme', name: 'Programme', icon: <Calendar className="h-5 w-5" /> },
        { path: '/annonces', name: 'Annonces', icon: <Bell className="h-5 w-5" /> },
    ];

    const itemVariants = {
        hover: { x: 5, transition: { duration: 0.2 } },
    };

    const buttonVariants = {
        hover: { scale: 1.02, transition: { duration: 0.2 } },
        tap: { scale: 0.98, transition: { duration: 0.1 } },
    };

    return (
        <>
            <div className="h-screen w-64 bg-[#0f172a] text-[#090f1b] fixed left-0 top-0 z-30 border-r border-[#0f172a] backdrop-blur-sm shadow-xl flex flex-col">
                {/* Logo en haut du menu */}
                <div className="px-6 py-4 border-b border-emerald-100 flex-shrink-0">
                    <Link to="/dashboard" className="flex items-center space-x-2">
                        {/* <Store className="h-8 w-8 text-emerald-500" /> */}
                        <div className="font-bold text-xl text-white">
                            {/* Hackathon-Redis-IUA */}
                            Gestion Estudiantine
                        </div>
                    </Link>
                </div>

                {/* Liens de navigation (scrollable si déborde) */}
                <div className="flex-1 overflow-y-auto py-4 px-4 scrollbar-thin scrollbar-thumb-emerald-100 scrollbar-track-transparent hover:scrollbar-thumb-emerald-200 border-b border-blue-100/70">
                    <ul>
                        {sidebarItems.map((item, index) => (
                            <motion.li key={index} className="mb-1" variants={itemVariants} whileHover="hover">
                                <Link
                                    to={item.path}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                                        isActive(item.path)
                                        ? 'bg-white text-[#0f172a] border-l-4 border-[#2563eb] shadow-sm'
                                        : 'text-white hover:bg-[#dbdbdb] hover:text-[#0f172a]'
                                    }`}
                                >
                                    <div className={`${isActive(item.path) ? 'text-[#0f172a]' : 'text-white'}`}>
                                        {item.icon}
                                    </div>
                                    <span className="ml-2 font-medium">{item.name}</span>
                                </Link>
                            </motion.li>
                        ))}
                    </ul>
                </div>

                {/* Bouton Déconnexion */}
                    <motion.li 
                        className="flex justify-center mt-6" 
                        variants={itemVariants} 
                        whileHover="hover"
                    >
                        <motion.button
                            onClick={() => setModalOpen(true)}
                            className="flex w-4/5 items-center px-6 py-3 text-white bg-gradient-to-r from-[#2563eb] to-[#1e65ff] hover:from-[#105bff] hover:to-[#105bff] rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/25"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="ml-3 font-bold">Déconnexion</span>
                        </motion.button>
                    </motion.li>

                {/* Footer */}
                <motion.div
                    className="flex-shrink-0 px-6 py-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="text-center">
                        <p className="text-xs text-[#105bff] font-medium">Dashboard-Admin</p>
                        <div className="flex justify-center gap-1 mt-1">
                        <div className="w-1 h-1 rounded-full bg-[#105bff]"></div>
                        <div className="w-1 h-1 rounded-full bg-[#105bff]"></div>
                        <div className="w-1 h-1 rounded-full bg-[#105bff]"></div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Modal de confirmation déconnexion */}
            {isModalOpen &&
                createPortal(
                    <ConfirmLogoutModal
                        isOpen={isModalOpen}
                        onClose={() => setModalOpen(false)}
                        onConfirm={handleConfirmLogout}
                    />,
                    document.body
                )
            }
        </>
    );
};

export default DashboardSidebar;
