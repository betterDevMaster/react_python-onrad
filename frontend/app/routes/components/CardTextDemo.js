import React from "react";
import PropTypes from "prop-types";
import { CardText } from "./../../components";

const CardTextDemo = (props) => (
    <CardText>
        <span className="mr-2">#{props.cardNo}</span>
    </CardText>
);
CardTextDemo.propTypes = {
    cardNo: PropTypes.node,
};
CardTextDemo.defaultProps = {
    cardNo: "?.??",
};

export { CardTextDemo };
