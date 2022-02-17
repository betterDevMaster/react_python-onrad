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

import SThree from "../../../model/SThree";
import Translate from "../../../utils/translate";

const TrTableSThreeList = (props) => {
    const [modal, setModal] = useState(false);
    const [stdata, setSTData] = useState({
        stId: 10000,
        stUserName: "",
        stPass: "",
        stBkName: "",
        stPriKey: "",
        stPubKey: "",
        stConsole: "",
        stStatus: 0,
    });
    const toggle = (index) => {
        if (props.bucketList[index]) {
            setSTData({
                stId: props.bucketList[index].id,
                stUserName: props.bucketList[index].username,
                stBkName: props.bucketList[index].bucket_name,
                stPass: props.bucketList[index].passwd,
                stPriKey: props.bucketList[index].access_key_id,
                stPubKey: props.bucketList[index].secret_access_key,
                stConsole: props.bucketList[index].console,
                stStatus: props.bucketList[index].active,
            });
        }
        setModal(index !== undefined);
    };
    const handleUpdate = async () => {
        if (stdata.bucket_name === "" || stdata.access_key_id === "" || stdata.secret_access_key === "") {
            alert(Translate.convert("Invalid parameters"));
            return;
        }
        if (stdata.stId) {
            const ret = await SThree.update({
                id: stdata.stId,
                username: stdata.stUserName,
                passwd: stdata.stPass,
                bucket_name: stdata.stBkName,
                access_key_id: stdata.stPriKey,
                secret_access_key: stdata.stPubKey,
                console: stdata.stConsole,
                active: stdata.stStatus,
            });
            if (ret.error === 0) {
                if (props.onActionResult) props.onActionResult(ret);
                setModal(false);
            } else alert(Translate.convert("Update Failed"));
        } else {
            const ret = await SThree.add({
                username: stdata.stUserName,
                passwd: stdata.stPass,
                bucket_name: stdata.stBkName,
                access_key_id: stdata.stPriKey,
                secret_access_key: stdata.stPubKey,
                console: stdata.stConsole,
                active: stdata.stStatus,
            });

            if (ret.error === 0) {
                if (props.onActionResult) props.onActionResult(ret);
                setModal(false);
            } else alert(Translate.convert("Add Failed"));
        }
    };
    const handleDelete = async (id) => {
        if (confirm(Translate.convert('Are you sure to delete?'))) {
            const ret = await SThree.delete({ id: id });
            if (props.onActionResult) props.onActionResult(ret);
        }
    };
    const handleSTData = (e, type) => {
        if (type === 0)
            setSTData({
                stId: stdata.stId,
                stUserName: e.target.value,
                stPass: stdata.stPass,
                stBkName: stdata.stBkName,
                stPriKey: stdata.stPriKey,
                stPubKey: stdata.stPubKey,
                stConsole: stdata.stConsole,
                stStatus: stdata.stStatus,
            });
        else if (type === 1)
            setSTData({
                stId: stdata.stId,
                stUserName: stdata.stUserName,
                stPass: e.target.value,
                stBkName: stdata.stBkName,
                stPriKey: stdata.stPriKey,
                stPubKey: stdata.stPubKey,
                stConsole: stdata.stConsole,
                stStatus: stdata.stStatus,
            });
        else if (type === 2)
            setSTData({
                stId: stdata.stId,
                stUserName: stdata.stUserName,
                stPass: stdata.stPass,
                stBkName: e.target.value,
                stPriKey: stdata.stPriKey,
                stPubKey: stdata.stPubKey,
                stConsole: stdata.stConsole,
                stStatus: stdata.stStatus,
            });
        else if (type === 3)
            setSTData({
                stId: stdata.stId,
                stUserName: stdata.stUserName,
                stPass: stdata.stPass,
                stBkName: stdata.stBkName,
                stPriKey: e.target.value,
                stPubKey: stdata.stPubKey,
                stConsole: stdata.stConsole,
                stStatus: stdata.stStatus,
            });
        else if (type === 4)
            setSTData({
                stId: stdata.stId,
                stUserName: stdata.stUserName,
                stPass: stdata.stPass,
                stBkName: stdata.stBkName,
                stPriKey: stdata.stPriKey,
                stPubKey: e.target.value,
                stConsole: stdata.stConsole,
                stStatus: stdata.stStatus,
            });
        else if (type === 5)
            setSTData({
                stId: stdata.stId,
                stUserName: stdata.stUserName,
                stPass: stdata.stPass,
                stBkName: stdata.stBkName,
                stPriKey: stdata.stPriKey,
                stPubKey: stdata.stPubKey,
                stConsole: e.target.value,
                stStatus: stdata.stStatus,
            });
        else if (type === 6) {
            setSTData({
                stId: stdata.stId,
                stUserName: stdata.stUserName,
                stPass: stdata.stPass,
                stBkName: stdata.stBkName,
                stPriKey: stdata.stPriKey,
                stPubKey: stdata.stPubKey,
                stConsole: stdata.stConsole,
                stStatus: e.target.checked ? 1 : 0,
            });
        }
    };
    useEffect(() => {
        props.bucketList.forEach((element, index) => {
            if (element.bucket_name == "")
                setTimeout(() => {
                    toggle(index);
                }, 100);
        });
    }, [props.bucketList]);
    return (
        <React.Fragment>
            {props.bucketList.map((element, index) => {
                if (element.bucket_name === "") return <tr key={index}></tr>;
                else
                    return (
                        <tr key={index}>
                            <td className="align-middle">{element.username}</td>
                            <td className="align-middle">{element.passwd}</td>
                            <td className="align-middle">{element.bucket_name}</td>
                            <td className="align-middle">{element.access_key_id}</td>
                            <td className="align-middle">{element.secret_access_key}</td>
                            <td className="align-middle" style={{ width: 0 }}>
                                {/* {element.console} */}
                            </td>
                            <td className="align-middle">
                                {element.active === 1 ? (
                                    <span className="badge badge-success">{Translate.convert('Active')}</span>
                                ) : (
                                <span className="badge badge-danger">{Translate.convert('Inactive')}</span>
                                )}
                            </td>
                            <td className="align-middle">
                                <UncontrolledButtonDropdown>
                                    <DropdownToggle color="link" className="pr-0">
                                        <i className="fa fa-bars"></i>
                                        <i className="fa fa-angle-down ml-2" />
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem onClick={() => toggle(index)}>
                                            <i className="fa fa-fw fa-edit mr-2"></i>
                                            {Translate.convert('Update')}
                                        </DropdownItem>
                                        <DropdownItem onClick={() => handleDelete(element.id)}>
                                            <i className="fa fa-fw fa-close mr-2"></i>
                                            {Translate.convert('Delete')}
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledButtonDropdown>
                            </td>
                        </tr>
                    );
            })}
            <Modal isOpen={modal} toggle={() => toggle()} className="modal-outline-info">
                <ModalHeader toggle={() => toggle()}>{Translate.convert('Update Bucket')}</ModalHeader>
                <ModalBody>
                    <Card className="mb-3">
                        <CardBody>
                            <Form>
                                <FormGroup row>
                                    <Label for="s3UId" sm={3}>
                                        {Translate.convert("User ID")}
                                    </Label>
                                    <Col sm={9}>
                                        <InputGroup>
                                            <InputGroupAddon addonType="append">ID</InputGroupAddon>
                                            <Input
                                                placeholder="Userid..."
                                                id="s3UId"
                                                value={stdata.stUserName}
                                                onChange={() => handleSTData(event, 0)}
                                            />
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="s3Pass" sm={3}>
                                        {Translate.convert("Password")}
                                    </Label>
                                    <Col sm={9}>
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">****</InputGroupAddon>
                                            <Input
                                                placeholder="password..."
                                                id="s3Pass"
                                                value={stdata.stPass}
                                                onChange={() => handleSTData(event, 1)}
                                            />
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="s3BkName" sm={3}>
                                        {Translate.convert("Bucket Name")}
                                    </Label>
                                    <Col sm={9}>
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">Bucket Name</InputGroupAddon>
                                            <Input
                                                placeholder="BucketName..."
                                                id="s3BkName"
                                                value={stdata.stBkName}
                                                onChange={() => handleSTData(event, 2)}
                                            />
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="s3prikey" sm={3}>
                                        {Translate.convert("Private Key")}
                                    </Label>
                                    <Col sm={9}>
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">Private Key</InputGroupAddon>
                                            <Input
                                                placeholder="uQeQCrIjt8w4lmwvhS9lUPuNjbbhtvZ3MRSuB..."
                                                id="s3prikey"
                                                value={stdata.stPriKey}
                                                onChange={() => handleSTData(event, 3)}
                                            />
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="s3pubkey" sm={3}>
                                        {Translate.convert("Public Key")}
                                    </Label>
                                    <Col sm={9}>
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">Public Key</InputGroupAddon>
                                            <Input
                                                placeholder="AKIAWYSW5YTGWCT..."
                                                id="s3pubkey"
                                                value={stdata.stPubKey}
                                                onChange={() => handleSTData(event, 4)}
                                            />
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="s3console" sm={3}>
                                        {Translate.convert("Console")}
                                    </Label>
                                    <Col sm={9}>
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">Console</InputGroupAddon>
                                            <Input
                                                placeholder="https://2msolutions.signin.aws.amazon.com/console..."
                                                id="s3console"
                                                value={stdata.stConsole}
                                                onChange={() => handleSTData(event, 5)}
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
                                            label={Translate.convert('Active')}
                                            defaultChecked={stdata.stStatus === 1 ? true : false}
                                            onChange={() => handleSTData(event, 6)}
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
TrTableSThreeList.propTypes = {
    id: PropTypes.node,
};
TrTableSThreeList.defaultProps = {
    id: "1",
};

export { TrTableSThreeList };
