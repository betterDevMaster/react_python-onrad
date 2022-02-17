import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { ThemeConsumer } from "../../../components/Theme";
import Translate from "../../../utils/translate"

const LogoThemed = ({ checkBackground, className, ...otherProps }) => (
    <ThemeConsumer>
        {/* {({ style, color }) => (
      <img
        src={
          checkBackground
            ? getLogoUrlBackground(style, color)
            : getLogoUrl(style, color)
        }
        className={classNames("d-block", className)}
        alt="Dicom Logo"
        {...otherProps}
      />
    )} */}
        {({ style, color }) => <h3 style={{ color: '#FFC060' }}>{Translate.convert('Dicom Server')}</h3>}
    </ThemeConsumer>
);
LogoThemed.propTypes = {
    checkBackground: PropTypes.bool,
    className: PropTypes.string,
};

export { LogoThemed };
