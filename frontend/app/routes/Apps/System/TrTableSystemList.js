import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import {
    Col,
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
    Card,
    CardBody,
    Form,
    FormGroup,
    Label,
    Input,
    InputGroup,
    CustomInput,
} from "../../../components";
import System from "../../../model/System";
import Translate from "../../../utils/translate";

const TrTableSystemList = (props) => {
    const [stList, setSTList] = useState([]);
    const [path, setPath] = useState();
    const [s3Id, setS3Id] = useState();
    const [downPath, setDownPath] = useState();
    const [modal, setModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const ret = await System.listAll();
        console.log("fetchdata : ", ret);
        if (ret.error === 0) {
            setSTList(ret.list);
        }
    };

    const toggle = (path) => {
        return;
        setDownPath("");
        setPath(path);
        setModal(!modal);
    };
    const handleDownload = async () => {
        if (!s3Id || s3Id === "-1") {
            alert(Translate.convert("Please select the UserID"));
            return;
        }
        const ret = await System.download({ s3_id: s3Id, file_name: path });
        console.log("handleDownload : ", ret);
        if (ret.error === 0) {
            window.open(ret.url, "_blank");
            // setDownPath(ret.url);
        }
    };
    const handleSTIDChange = (e) => {
        console.log(e.target.value);
        if (e.target.value === "-1") {
            alert(Translate.convert("Please select the UserID"));
            return;
        } else {
            setS3Id(e.target.value);
        }
    };
    return (
        <React.Fragment>
            {props.data.map((element, index) => {
                return (
                    <tr key={index}>
                        <td className="align-middle" style={{ wordBreak: "break-word" }}>
                            <a style={{ cursor: "pointer", color: "#663366" }} onClick={() => toggle(element.cloud_file_path)}>
                                {element.cloud_file_path}
                            </a>
                        </td>
                        <td className="align-middle" style={{ wordBreak: "break-word" }}>
                            {element.modality}
                        </td>
                        <td className="align-middle" style={{ wordBreak: "break-word" }}>
                            {element.patient_id}
                        </td>
                        <td className="align-middle" style={{ wordBreak: "break-word" }}>
                            {element.patient_name}
                        </td>
                        <td className="align-middle" style={{ wordBreak: "break-word" }}>
                            {element.patient_sex}
                        </td>
                        <td className="align-middle" style={{ wordBreak: "break-word" }}>
                            {element.patient_age}
                        </td>
                        <td className="align-middle" style={{ wordBreak: "break-word" }}>
                            {element.patient_birthday}
                        </td>
                        <td className="align-middle" style={{ wordBreak: "break-word" }}>
                            {element.exam}
                        </td>
                        <td className="align-middle" style={{ wordBreak: "break-word" }}>
                            {element.accession_number}
                        </td>
                        <td className="align-middle" style={{ wordBreak: "break-word" }}>
                            {element.study_id}
                        </td>
                        <td className="align-middle" style={{ wordBreak: "break-word" }}>
                            {element.study_uid}
                        </td>
                        <td className="align-middle" style={{ wordBreak: "break-word" }}>
                            {element.referring_physicians_name}
                        </td>
                        <td className="align-middle" style={{ wordBreak: "break-word" }}>
                            {element.performing_physicians_name}
                        </td>
                        <td className="align-middle" style={{ wordBreak: "break-word" }}>
                            {element.study_date}
                        </td>
                        <td className="align-middle" style={{ wordBreak: "break-word" }}>
                            {new Date(element.record_time).toLocaleString()}
                        </td>

                        <td className="align-middle" style={{ wordBreak: "break-word" }}>
                            {element.origin_id}
                        </td>
                        <td className="align-middle" style={{ wordBreak: "break-word" }}>
                            {element.origin_name}
                        </td>
                    </tr>
                );
            })}
            <Modal isOpen={modal} toggle={toggle} className="modal-outline-info">
                <ModalHeader toggle={toggle}>Download dicom files from AWS S3 bucket</ModalHeader>
                <ModalBody>
                    <Card className="mb-3">
                        <CardBody>
                            <Form>
                                <FormGroup row>
                                    <Label for="s3UId" sm={3}>
                                        Bucket
                                    </Label>
                                    <Col sm={9}>
                                        <InputGroup>
                                            <CustomInput type="select" id="s3Id" onChange={handleSTIDChange} value={s3Id}>
                                                <option key="-1" value="-1">
                                                    Select bucket where you download.
                                                </option>
                                                {stList.map((ele, index) => {
                                                    return (
                                                        <option key={ele.id} value={ele.id}>
                                                            {ele.bucket_name}
                                                        </option>
                                                    );
                                                })}
                                            </CustomInput>
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label sm={3}>FileName</Label>
                                    <Col sm={9}>
                                        <InputGroup>
                                            <Input placeholder="filename..." defaultValue={path} readOnly />
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    {/* <Label sm={3}>DownloadURL</Label> */}
                                    <Col sm={12}>{downPath}</Col>
                                </FormGroup>
                            </Form>
                        </CardBody>
                    </Card>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleDownload}>
                        Download
                    </Button>{" "}
                    <Button color="secondary" onClick={toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </React.Fragment>
    );
};
TrTableSystemList.propTypes = {
    id: PropTypes.node,
};
TrTableSystemList.defaultProps = {
    id: "1",
};

export { TrTableSystemList };
