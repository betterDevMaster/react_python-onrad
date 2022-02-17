import React, { useState, useEffect } from "react";

import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Button,
    InputGroup,
    InputGroupAddon,
    Form,
    FormGroup,
    Label,
    Input,
} from "../../../components";
import { HeaderMain } from "../../components/HeaderMain";

import User from "../../../model/User";
import Translate from "../../../utils/translate";

export default function Information(props) {
    const [information, setInformation] = useState({
        
    });
    const [connectionStatus, setConnectionStatus] = useState(true);
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const _scpConnectionStatus = await User.getSCPStatus();
        if (_scpConnectionStatus.error === 0) setConnectionStatus(_scpConnectionStatus.status);

        const _scpData = await User.getSCP();
        if (_scpData.error === 0) {
            setScpData({
                scpId: _scpData.id,
                scpPort: _scpData.port,
                scpTitle: _scpData.ae_title,
                scpModalityIgnore: _scpData.modality_ignore,
                scpSleepTime: _scpData.time_upload,
                scpTempSaveTime: _scpData.time_new_study,
            });
        }
    };

    const handleSCPStart = async () => {
        const _scpStatus1 = await User.handleSCPStart();
        if (_scpStatus1.error === 0) setConnectionStatus(_scpStatus1.status);
    };

    const handleSCPStop = async () => {
        const _scpStatus2 = await User.handleSCPStop();
        if (_scpStatus2.error === 0) setConnectionStatus(_scpStatus2.status);
    };

    const handleSCPUpdate = async () => {
        const ret = await User.handleSCPUpdate({
            id: scpData.scpId,
            port: scpData.scpPort,
            ae_title: scpData.scpTitle,
            modality_ignore: scpData.scpModalityIgnore,
            time_upload: scpData.scpSleepTime,
            time_new_study: scpData.scpTempSaveTime,
        });
        if (ret.error === 0) alert(Translate.convert('Update Success'));
        else alert(Translate.convert("Update Failed"));
    };
    const handleSCPData = (e, type) => {
        const re = /^[0-9\b]+$/;
        const newScp = { ...scpData };
        newScp[type] = e.target.value;
        setScpData(newScp);
    };

    return (
        <React.Fragment>
            <Container>
                <div className="d-flex">
                    <div>
                        <HeaderMain title={Translate.convert("SCP Settings")} className="mb-5 mt-4" />
                    </div>
                    {/* {connectionStatus ? (
            <span
              className="fs-20 badge-success ml-auto align-self-center"
              style={{
                borderRadius: "5px",
                padding: "0 5px",
              }}
            >
              Service Started
            </span>
          ) : (
            <span
              className="fs-20 badge-danger ml-auto align-self-center"
              style={{
                borderRadius: "5px",
                padding: "0 5px",
              }}
            >
              Service Stopped
            </span>
          )} */}
                </div>

                <Row>
                    <Col lg={12}>
                        <div style={{ float: "right", marginBottom: "1rem" }}>
                            {/* <Button color="primary" className="mr-2" onClick={handleSCPStart}>
                SCP Start
              </Button>
              <Button color="primary" className="mr-2" onClick={handleSCPStop}>
                SCP Stop
              </Button> */}
                            <Button color="primary" onClick={handleSCPUpdate}>
                                {Translate.convert("Update")}
                            </Button>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col lg={12}>
                        <Card className="mb-3">
                            <CardBody>
                                <Form>
                                    <FormGroup row>
                                        <Label for="scpId" sm={3}>
                                            {Translate.convert("ID")}
                                        </Label>
                                        <Col sm={9}>
                                            <InputGroup>
                                                <InputGroupAddon addonType="append">SCP</InputGroupAddon>
                                                <Input
                                                    placeholder="81..."
                                                    id="scpId"
                                                    value={scpData.scpId}
                                                    onChange={() => handleSCPData(event, "scpId")}
                                                />
                                            </InputGroup>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="scpTitle" sm={3}>
                                            {Translate.convert("Title")}
                                        </Label>
                                        <Col sm={9}>
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">SCP</InputGroupAddon>
                                                <Input
                                                    placeholder="SERVIDOR..."
                                                    id="scpTitle"
                                                    value={scpData.scpTitle}
                                                    onChange={() => handleSCPData(event, "scpTitle")}
                                                />
                                            </InputGroup>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="scpModalityIgnore" sm={3}>
                                            {Translate.convert("Modality Ignore")}
                                        </Label>
                                        <Col sm={9}>
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">SCP</InputGroupAddon>
                                                <Input
                                                    placeholder="SR..."
                                                    id="scpModalityIgnore"
                                                    value={scpData.scpModalityIgnore}
                                                    onChange={() => handleSCPData(event, "scpModalityIgnore")}
                                                />
                                            </InputGroup>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="scpPort" sm={3}>
                                            {Translate.convert("Port")}
                                        </Label>
                                        <Col sm={9}>
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">SCP</InputGroupAddon>
                                                <Input
                                                    placeholder="11112"
                                                    id="scpPort"
                                                    value={scpData.scpPort}
                                                    onChange={() => handleSCPData(event, "scpPort")}
                                                />
                                            </InputGroup>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="scpPort" sm={3}>
                                            {Translate.convert("Sleep Time (minute)")}
                                        </Label>
                                        <Col sm={9}>
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">SCP</InputGroupAddon>
                                                <Input
                                                    placeholder="1"
                                                    id="scpSleepTime"
                                                    value={scpData.scpSleepTime}
                                                    onChange={() => handleSCPData(event, "scpSleepTime")}
                                                />
                                            </InputGroup>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="scpPort" sm={3}>
                                            {Translate.convert("Temp save time (minute)")}
                                        </Label>
                                        <Col sm={9}>
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">SCP</InputGroupAddon>
                                                <Input
                                                    placeholder="2880"
                                                    id="scpTempSaveTime"
                                                    value={scpData.scpTempSaveTime}
                                                    onChange={() => handleSCPData(event, "scpTempSaveTime")}
                                                />
                                            </InputGroup>
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    );
}
