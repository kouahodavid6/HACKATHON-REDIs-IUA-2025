import PropTypes from "prop-types";
import { Plus } from "lucide-react";

const HeaderSection = ({
    title,
    subtitle,
    buttonLabel,
    onButtonClick,
    icon: Icon = Plus,
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
                    className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 ${buttonColor} 
                    text-white rounded-lg transition-colors shadow-sm active:scale-95 w-fit self-end sm:self-auto`}
                    aria-label={buttonLabel}
                >
                    {/* Sur mobile : icône seule */}
                    <span className="sm:hidden">
                        {Icon && <Icon size={22} />}
                    </span>

                    {/* Sur desktop : icône + texte */}
                    <span className="hidden sm:flex items-center gap-2">
                        {Icon && <Icon size={20} />}
                        <span>{buttonLabel}</span>
                    </span>
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
    icon: PropTypes.elementType,
    buttonColor: PropTypes.string,
};

export default HeaderSection;
