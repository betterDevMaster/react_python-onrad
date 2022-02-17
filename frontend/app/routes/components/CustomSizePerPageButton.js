import React from 'react';
import { map } from 'lodash';
import {
    UncontrolledButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from './../../components';

export default function CustomSizePerPageButton(props) {
    const handleSizePerPageChange = (page) => {
        if (props.onSizePerPageChange) props.onSizePerPageChange(page)
    }

    return (
        <UncontrolledButtonDropdown>
            <DropdownToggle size="sm" color="link" className="text-decoration-none">
                { props.currSizePerPage }<i className="fa fa-angle-down ml-2" />
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem header>Page Size</DropdownItem>
                {
                    map(props.options, (option, index) => (
                        <DropdownItem
                            key={index}
                            onClick={() => handleSizePerPageChange(option.page)}
                            active={option.page === props.currSizePerPage}
                        >
                            { option.page }
                        </DropdownItem>
                    ))
                }
            </DropdownMenu>
        </UncontrolledButtonDropdown>
    )
}