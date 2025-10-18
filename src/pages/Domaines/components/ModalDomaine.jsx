import { useState, useEffect } from "react";
import { X } from "lucide-react";
import useDomaineStore from "../../../stores/domaines.store";
import toast from "react-hot-toast";

const ModalDomaine = ({ isOpen, onClose, onSuccess, domaine, isEdit = false }) => {
    const [titre, setTitre] = useState("");
    
    const { 
        ajouterDomaine, 
        modifierDomaine, 
        loading
    } = useDomaineStore();

    // Initialiser le formulaire
    useEffect(() => {
        console.log('ModalDomaine useEffect - domaine changed:', domaine);
        if (domaine) {
            setTitre(domaine.titre || "");
        } else {
            setTitre("");
        }
    }, [domaine, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting form with titre:', titre);
        
        if (!titre.trim()) {
            toast.error("Le nom du domaine est requis");
            return;
        }

        try {
            if (isEdit && domaine) {
                console.log('Editing domaine:', domaine.id, 'with titre:', titre);
                await modifierDomaine(domaine.id, titre.trim());
                toast.success("Domaine modifié avec succès !");
            } else {
                console.log('Adding new domaine with titre:', titre);
                await ajouterDomaine(titre.trim());
                toast.success("Domaine créé avec succès !");
            }
            
            // Fermer le modal après un court délai
            setTimeout(() => {
                onSuccess();
            }, 1000);
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Une erreur est survenue";
            toast.error(errorMessage);
            console.error("Erreur dans le modal:", error);
        }
    };

    const handleClose = () => {
        console.log('Modal close button clicked');
        onClose();
    };

    // Condition de rendu
    if (!isOpen) {
        console.log('Modal not rendering because isOpen is false');
        return null;
    }

    console.log('Modal rendering...');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                {/* En-tête */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {isEdit ? "Modifier le domaine" : "Ajouter un domaine"}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
                        disabled={loading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom du domaine
                        </label>
                        <input
                            type="text"
                            value={titre}
                            onChange={(e) => setTitre(e.target.value)}
                            placeholder="Ex: L1 Développement, L2 Design, etc."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !titre.trim()}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    {isEdit ? "Modification..." : "Création..."}
                                </>
                            ) : (
                                isEdit ? "Modifier" : "Créer"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalDomaine;