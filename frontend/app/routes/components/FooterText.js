import React from "react";
import PropTypes from "prop-types";
import Translate from "../../utils/translate";

const FooterText = (props) => (
    <React.Fragment>
        (C) {props.year} {Translate.convert('All Rights Reserved by')} &nbsp; 
        <a href="http://www.2msolutions.com" target="_blank" rel="noopener noreferrer" className="sidebar__link">
		{props.name}
        </a>
    </React.Fragment>
);
FooterText.propTypes = {
    year: PropTypes.node,
    name: PropTypes.node,
    desc: PropTypes.node,
};
FooterText.defaultProps = {
    year: "2020",
    name: "2M solutions",
    desc: "Bootstrap 4, React 16 (latest) & NPM",
};

export { FooterText };
