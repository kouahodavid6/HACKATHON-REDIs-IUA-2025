import PropTypes from "prop-types";
import { Plus } from "lucide-react";

const HeaderSection = ({
    title,
    subtitle,
    buttonLabel,
    onButtonClick,
    icon: Icon = Plus, // Par défaut l’icône Plus
    buttonColor = "bg-blue-600 hover:bg-blue-700",
}) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
            </div>

            {onButtonClick && (
                <button
                    onClick={onButtonClick}
                    className={`flex items-center gap-2 px-4 py-2 ${buttonColor} text-white rounded-lg transition-colors`}
                >
                    {Icon && <Icon size={20} />}
                    {buttonLabel}
                </button>
            )}
        </div>
    );
};

// ✅ Définition des PropTypes
HeaderSection.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    buttonLabel: PropTypes.string,
    onButtonClick: PropTypes.func,
    icon: PropTypes.elementType, // Pour passer un composant d’icône
    buttonColor: PropTypes.string, // Pour personnaliser la couleur du bouton
};

export default HeaderSection;
