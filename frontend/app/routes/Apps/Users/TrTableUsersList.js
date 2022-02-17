import React, { useState } from "react";
import PropTypes from "prop-types";

import { UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "../../../components";

import User from "../../../model/User";
import Translate from "../../../utils/translate";

const TrTableUsersList = (props) => {
    const handleActive = async (id, status) => {
        const ret = await User.update({ userid: id, status: status === 0 ? 1 : 0 });
        if (props.onActionResult) props.onActionResult(ret);
    };
    const handleDelete = async (id) => {
        if (confirm(Translate.convert('Are you sure to delete?'))) {
            const ret = await User.delete({ user_id: id });
            if (props.onActionResult) props.onActionResult(ret);
        }
    };

    return (
        <React.Fragment>
            {props.users.map((element, index) => {
                return (
                    <tr key={index}>
                        <td className="align-middle">{element.name}</td>
                        <td className="align-middle">{element.email}</td>
                        <td className="align-middle">
                            {element.status === 0 ? (
                                <span className="badge badge-success">{Translate.convert("Active")}</span>
                            ) : (
                                <span className="badge badge-danger">{Translate.convert("Inactive")}</span>
                            )}
                        </td>
                        <td className="align-middle text-right">
                            <UncontrolledButtonDropdown>
                                <DropdownToggle color="link" className="pr-0">
                                    <i className="fa fa-bars"></i>
                                    <i className="fa fa-angle-down ml-2" />
                                </DropdownToggle>
                                <DropdownMenu right>
                                    {element.status !== 0 ? (
                                        <DropdownItem onClick={() => handleActive(element.id, element.status)}>
                                            <i className="fa fa-fw fa-unlock mr-2"></i>
                                            {Translate.convert("Active")}
                                        </DropdownItem>
                                    ) : null}
                                    {element.status === 0 ? (
                                        <DropdownItem onClick={() => handleActive(element.id, element.status)}>
                                            <i className="fa fa-fw fa-lock mr-2"></i>
                                            {Translate.convert("Inactive")}
                                        </DropdownItem>
                                    ) : null}
                                    <DropdownItem onClick={() => handleDelete(element.id)}>
                                        <i className="fa fa-fw fa-close mr-2"></i>
                                        {Translate.convert("Delete")}
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledButtonDropdown>
                        </td>
                    </tr>
                );
            })}
        </React.Fragment>
    );
};
TrTableUsersList.propTypes = {
    id: PropTypes.node,
};
TrTableUsersList.defaultProps = {
    id: "1",
};

export { TrTableUsersList };
