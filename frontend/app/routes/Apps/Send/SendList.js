import React, { useState, useEffect } from "react";

import { Container, Card, CardFooter, CardBody, Row, Col, Table, Button } from "../../../components";
import { HeaderMain } from "../../components/HeaderMain";

import { TrTableSendList } from "./TrTableSendList";
import CustomSizePerPageButton from "../../components/CustomSizePerPageButton";
import { CustomPaginationTotal } from "../../components/CustomPaginationTotal";

import { Paginations } from "../../components/Paginations";

import Send from "../../../model/Send";
import Translate from "../../../utils/translate";

export default function SendList() {
    const [sendList, setSendList] = useState([]);
    const [sendListCount, setSendListCount] = useState(0);
    const [currPage, setCurrPage] = useState(0);
    const [currSizePerPage, setCurrSizePerPage] = useState(5);
    const options = [{ page: 5 }, { page: 10 }, { page: 20 }];
    const [connectionStatus, setConnectionStatus] = useState(true);

    useEffect(() => {
        fetchData(currPage, currSizePerPage);
    }, []);

    const fetchData = async (_currPage, _currSizePerPage) => {
        const ret1 = await Send.getSEStatus();
        if (ret1.error === 0) setConnectionStatus(ret1.status);

        const ret2 = await Send.list({
            page_index: _currPage,
            page_size: _currSizePerPage,
        });
        if (ret2.error === 0) {
            setSendList(ret2.list);
            setSendListCount(ret2.sender_count);
        }
    };
    const handleSEStart = async () => {
        const ret = await Send.handleSEStart();
        if (ret.error === 0) setConnectionStatus(ret.status);
    };
    const handleSEStop = async () => {
        const ret = await Send.handleSEStop();
        if (ret.error === 0) setConnectionStatus(ret.status);
    };
    const handleActionResult = (ret) => {
        if (ret.error === 0) fetchData(currPage, currSizePerPage);
    };
    const handlePageSelection = (_currPage) => {
        setCurrPage(_currPage);
        fetchData(_currPage, currSizePerPage);
    };
    const handleSizePerPageChange = (_currSizePerPage) => {
        setCurrSizePerPage(_currSizePerPage);
        fetchData(currPage, _currSizePerPage);
    };
    const handleSTAdd = () => {
        const newArr = [
            {
                host: "",
                active: 1,
                port: "",
                ae_title: "",
            },
        ];

        const newArray = newArr.concat(sendList);
        setSendList(newArray);
    };

    return (
        <React.Fragment>
            <Container style={{ maxWidth: "1350px" }}>
                <div className="d-flex">
                    <div>
                        <HeaderMain title={Translate.convert("PACs Settings")} className="mb-5 mt-4" />
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
                            {/* <Button color="primary" className="mr-2" onClick={handleSEStart}>
                SENDStart
              </Button>
              <Button color="primary" className="mr-2" onClick={handleSEStop}>
                SENDStop
              </Button> */}
                            <Button color="primary" className="mr-2" onClick={handleSTAdd}>
                                {Translate.convert("Add New")}
                            </Button>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col lg={12}>
                        <Card className="mb-3">
                            <div className="table-responsive-xl">
                                <Table className="mb-0" hover>
                                    <thead>
                                        <tr>
                                            <th className="align-middle bt-0">{Translate.convert("Title")}</th>
                                            <th className="align-middle bt-0">{Translate.convert("Host")}</th>
                                            <th className="align-middle bt-0">{Translate.convert("Port")}</th>
                                            <th className="align-middle bt-0">{Translate.convert("Status")}</th>
                                            <th className="align-middle bt-0 text-right">{Translate.convert("Actions")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <TrTableSendList sendList={sendList} onActionResult={handleActionResult} />
                                    </tbody>
                                </Table>
                            </div>
                            <CardFooter className="d-flex justify-content-between pb-0">
                                <div>
                                    <CustomSizePerPageButton
                                        currSizePerPage={currSizePerPage}
                                        options={options}
                                        onSizePerPageChange={handleSizePerPageChange}
                                    />
                                    <CustomPaginationTotal
                                        from={currPage * currSizePerPage}
                                        to={currPage * currSizePerPage + currSizePerPage}
                                        size={sendListCount}
                                    />
                                </div>
                                <Paginations
                                    count={sendListCount}
                                    currPage={currPage}
                                    currSizePerPage={currSizePerPage}
                                    onPageResult={handlePageSelection}
                                />
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    );
}
