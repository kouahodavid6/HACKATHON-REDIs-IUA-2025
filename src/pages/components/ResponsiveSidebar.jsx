// 📁 src/components/ResponsiveSidebar.jsx
import PropTypes from "prop-types";

const ResponsiveSidebar = ({
    isOpen,
    onClose,
    children,
    width = "w-64",
    color = "#2563eb",
}) => {
    return (
        <>
            {/* Overlay mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed md:sticky top-0 z-50 transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0 ${width} h-screen bg-white shadow-lg`}
            >
                {children}
            </div>

            {/* Bouton de fermeture mobile — collé au bord droit de l’écran */}
            {isOpen && (
                <button
                    onClick={onClose}
                    className={`fixed top-4 right-4 z-[60] text-[${color}] hover:text-blue-700 transition-all duration-300 
                        bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg md:hidden`}
                    aria-label="Fermer la sidebar"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </>
    );
};

ResponsiveSidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    width: PropTypes.string,
    color: PropTypes.string,
};

export default ResponsiveSidebar;
