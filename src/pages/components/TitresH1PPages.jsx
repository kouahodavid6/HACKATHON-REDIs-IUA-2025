import PropTypes from "prop-types";

const TitreH1PPages = ({ title, subtitle }) => {
    return(
        <div>
            <h1 className="text-3xl font-bold text-gray-900">{ title }</h1>
            <p className="text-gray-600 mt-2">{ subtitle }</p>
        </div>
    );
}

TitreH1PPages.propTypes = {
    titre: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
}
export default TitreH1PPages;