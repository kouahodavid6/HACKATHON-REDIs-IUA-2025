import LogoREDIs from "../../../assets/images/LogoREDIs.jpg"

const LogoBrandingREDIs = () => {
    return(
        <div className="absolute top-6 left-6 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <img 
                    src={LogoREDIs} 
                    alt="Logo du Département informatique (REDIs)" 
                    className="w-full h-full object-cover rounded-lg"
                />
            </div>
            <div className="text-white">
                <div className="font-bold text-lg leading-4">REDIs</div>
                <div className="text-xs text-gray-300">Hackathon Admin</div>
            </div>
        </div>
    );
}

export default LogoBrandingREDIs;