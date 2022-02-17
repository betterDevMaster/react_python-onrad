import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import {
    Col,
    Label,
    Input,
    UncontrolledButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Modal,
    CustomInput,
    Button,
    Card,
    CardBody,
    Form,
    FormGroup,
    InputGroup,
    InputGroupAddon,
} from "../../../components";

import Send from "../../../model/Send";
import Translate from "../../../utils/translate";

const TrTableSendList = (props) => {
    const [modal, setModal] = useState(false);
    const [seData, setSEData] = useState({
        seId: 1000000,
        seTitle: "",
        seHost: "",
        sePort: "",
        seStatus: 0,
    });
    useEffect(() => {
        props.sendList.forEach((element, index) => {
            if (element.host == "")
                setTimeout(() => {
                    toggle(index);
                }, 100);
        });
    }, [props.sendList]);
    const toggle = (index) => {
        if (props.sendList[index]) {
            setSEData({
                seId: props.sendList[index].id,
                seTitle: props.sendList[index].ae_title,
                sePort: props.sendList[index].port,
                seHost: props.sendList[index].host,
                seStatus: props.sendList[index].active,
            });
        }
        setModal(index !== undefined);
    };
    const handleUpdate = async () => {
        if (seData.seId) {
            const ret = await Send.update({
                id: seData.seId,
                ae_title: seData.seTitle,
                host: seData.seHost,
                port: seData.sePort,
                active: seData.seStatus,
            });

            if (ret.error === 0) {
                if (props.onActionResult) props.onActionResult(ret);
                setModal(false);
            } else alert(Translate.convert("Update Failed"));
        } else {
            const ret = await Send.add({
                ae_title: seData.seTitle,
                host: seData.seHost,
                port: seData.sePort,
                active: seData.seStatus,
            });

            if (ret.error === 0) {
                if (props.onActionResult) props.onActionResult(ret);
                setModal(false);
            } else alert(Translate.convert("Add Failed"));
        }
    };
    const handleDelete = async (id) => {
        if (confirm(Translate.convert('Are you sure to delete?'))) {
            const ret = await Send.delete({ id: id });
            if (props.onActionResult) props.onActionResult(ret);
        }
    };
    const handleSEData = (e, type) => {
        if (type === 0)
            setSEData({
                seId: seData.seId,
                seTitle: e.target.value,
                seHost: seData.seHost,
                sePort: seData.sePort,
                seStatus: seData.seStatus,
            });
        else if (type === 1)
            setSEData({
                seId: seData.seId,
                seTitle: seData.seTitle,
                seHost: e.target.value,
                sePort: seData.sePort,
                seStatus: seData.seStatus,
            });
        else if (type === 2)
            setSEData({
                seId: seData.seId,
                seTitle: seData.seTitle,
                seHost: seData.seHost,
                sePort: e.target.value,
                seStatus: seData.seStatus,
            });
        else if (type === 3)
            setSEData({
                seId: seData.seId,
                seTitle: seData.seTitle,
                seHost: seData.seHost,
                sePort: seData.sePort,
                seStatus: e.target.checked ? 1 : 0,
            });
    };

    return (
        <React.Fragment>
            {props.sendList.map((element, index) => {
                if (element.host === "") return <tr key={index}></tr>;
                else
                    return (
                        <tr key={index}>
                            <td className="align-middle">{element.ae_title}</td>
                            <td className="align-middle">{element.host}</td>
                            <td className="align-middle">{element.port}</td>
                            <td className="align-middle">
                                {element.active === 1 ? (
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
                                        <DropdownItem onClick={() => toggle(index)}>
                                            <i className="fa fa-fw fa-edit mr-2"></i>
                                            {Translate.convert("Update")}
                                        </DropdownItem>
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
            <Modal isOpen={modal} toggle={() => toggle()} className="modal-outline-info">
                <ModalHeader toggle={() => toggle()}>{Translate.convert("Update PAC")}</ModalHeader>
                <ModalBody>
                    <Card className="mb-3">
                        <CardBody>
                            <Form>
                                <FormGroup row>
                                    <Label for="seId" sm={3}>
                                        {Translate.convert("Title")}
                                    </Label>
                                    <Col sm={9}>
                                        <InputGroup>
                                            <InputGroupAddon addonType="append">Title</InputGroupAddon>
                                            <Input
                                                placeholder="Title..."
                                                id="seId"
                                                value={seData.seTitle}
                                                onChange={() => handleSEData(event, 0)}
                                            />
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="seHost" sm={3}>
                                        {Translate.convert("Host")}
                                    </Label>
                                    <Col sm={9}>
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">Host</InputGroupAddon>
                                            <Input
                                                placeholder="Host..."
                                                id="seHost"
                                                value={seData.seHost}
                                                onChange={() => handleSEData(event, 1)}
                                            />
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="sePort" sm={3}>
                                        {Translate.convert("Port")}
                                    </Label>
                                    <Col sm={9}>
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">Port</InputGroupAddon>
                                            <Input
                                                placeholder="Port..."
                                                id="sePort"
                                                value={seData.sePort}
                                                onChange={() => handleSEData(event, 2)}
                                            />
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="s3status" sm={3}>
                                        {Translate.convert("Status")}
                                    </Label>
                                    <Col sm={9}>
                                        <CustomInput
                                            type="checkbox"
                                            id="s3status"
                                            className="pt-2"
                                            label={Translate.convert("Active")}
                                            defaultChecked={seData.seStatus === 1 ? true : false}
                                            onChange={() => handleSEData(event, 3)}
                                        />
                                    </Col>
                                </FormGroup>
                            </Form>
                        </CardBody>
                    </Card>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleUpdate}>
                        {Translate.convert("Update")}
                    </Button>{" "}
                    <Button color="secondary" onClick={() => toggle()}>
                        {Translate.convert("Cancel")}
                    </Button>
                </ModalFooter>
            </Modal>
        </React.Fragment>
    );
};
TrTableSendList.propTypes = {
    id: PropTypes.node,
};
TrTableSendList.defaultProps = {
    id: "1",
};

export { TrTableSendList };
