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

import Onroad from "../../../model/Onroad";
import Translate from "../../../utils/translate";

export default function OnroadPage(props) {
    const [onroadData, setOnroadData] = useState({
        url: "",
        user: "",
        passwd: "",
    });
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setOnroadData(await Onroad.get());
    };
    const handleSCPUpdate = async () => {
        const ret = await Onroad.set(onroadData);
        if (ret.error === 0) alert(Translate.convert("Update Success"));
        else alert(Translate.convert("Update Failed"));
    };
    const handleSCPData = (e, type) => {
        const newData = { ...onroadData };
        newData[type] = e.target.value;
        setOnroadData(newData);
    };

    return (
        <React.Fragment>
            <Container>
                <div className="d-flex">
                    <div>
                        <HeaderMain title={Translate.convert("Web Settings")} className="mb-5 mt-4" />
                    </div>
                </div>

                <Row>
                    <Col lg={12}>
                        <div style={{ float: "right", marginBottom: "1rem" }}>
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
                                        <Label for="url" sm={3}>
                                            {Translate.convert("URL")}
                                        </Label>
                                        <Col sm={9}>
                                            <InputGroup>
                                                <InputGroupAddon addonType="append">URL</InputGroupAddon>
                                                <Input id="url" value={onroadData.url} onChange={(event) => handleSCPData(event, "url")} />
                                            </InputGroup>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="user" sm={3}>
                                            {Translate.convert("User ID")}
                                        </Label>
                                        <Col sm={9}>
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">User</InputGroupAddon>
                                                <Input
                                                    id="user"
                                                    value={onroadData.user}
                                                    onChange={(event) => handleSCPData(event, "user")}
                                                />
                                            </InputGroup>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="passwd" sm={3}>
                                            {Translate.convert("Password")}
                                        </Label>
                                        <Col sm={9}>
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">Password</InputGroupAddon>
                                                <Input
                                                    placeholder=""
                                                    id="passwd"
                                                    value={onroadData.passwd}
                                                    onChange={(event) => handleSCPData(event, "passwd")}
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
