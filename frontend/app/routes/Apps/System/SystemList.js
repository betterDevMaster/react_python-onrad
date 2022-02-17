import React, { useState, useEffect } from "react";

import { Container, Card, CardFooter, Row, Col, Table } from "../../../components";
import { HeaderMain } from "../../components/HeaderMain";

import { TrTableSystemList } from "./TrTableSystemList";
import CustomSizePerPageButton from "../../components/CustomSizePerPageButton";
import { CustomPaginationTotal } from "../../components/CustomPaginationTotal";

import { Paginations } from "../../components/Paginations";

import System from "../../../model/System";
import Translate from "../../../utils/translate";

export default function SystemList() {
    const [data, setData] = useState([]);
    const [dataCount, setDataCount] = useState(0);
    const [currPage, setCurrPage] = useState(0);
    const [currSizePerPage, setCurrSizePerPage] = useState(5);
    const options = [{ page: 4 }, { page: 5 }, { page: 10 }, { page: 20 }];

    const [sysData, setSysData] = useState({
        modality: "",
        record_time: "",
        patient_name: "",
        exam: "",
    });

    useEffect(() => {
        fetchData(currPage, currSizePerPage);
    }, []);

    const fetchData = async (_currPage, _currSizePerPage) => {
        const ret2 = await System.list({
            page_index: _currPage,
            page_size: _currSizePerPage,
        });

        if (ret2.error === 0) {
            setData(ret2.list);
            setDataCount(ret2.history_count);
        }
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
    const handleSearch = (e, type) => {
        let temp = {};
        temp[type] = e.target.value;
        setSysData({ ...sysData, ...temp });
    };
    const handleCheckEnter = (e) => {
        console.log(e.keyCode);
        if (e.keyCode === 13) {
            System.list({
                page_index: currPage,
                page_size: currSizePerPage,
                modality: sysData.modality,
                record_time: sysData.record_time,
                patient_name: sysData.patient_name,
                exam: sysData.exam,
            }).then((ret2) => {
                console.log("ret2 : ', ", ret2);

                if (ret2.error === 0) {
                    setData(ret2.list);
                    setDataCount(ret2.history_count);
                }
            });
            // event.preventDefault();
            // return false;
            // e.preventDefault();
        }
    };
    return (
        <React.Fragment>
            <Container style={{ maxWidth: "1570px" }}>
                <HeaderMain title={Translate.convert("System Logs")} className="mb-5 mt-4" />
                <Row>
                    <Col lg={12}>
                        <Card className="mb-3">
                            <div className="table-responsive">
                                <Table className="mb-0" hover>
                                    <thead>
                                        <tr>
                                            <th className="align-middle bt-0 text-center">{Translate.convert("Cloud_File_Path")}</th>
                                            <th className="align-middle bt-0 text-center sortable">
                                                <div className="d-flex align-items-baseline">
                                                    {Translate.convert("Modality")}
                                                    <i className="fa fa-fw fa-sort text-muted"></i>
                                                </div>
                                                <div>
                                                    <input
                                                        placeholder={Translate.convert("Modality")}
                                                        type="text"
                                                        className="bg-white form-control-sm form-control"
                                                        value={sysData.modality}
                                                        onKeyDown={handleCheckEnter}
                                                        onChange={() => handleSearch(event, "modality")}
                                                    />
                                                </div>
                                            </th>
                                            <th className="align-middle bt-0 text-center">{Translate.convert("PatientID")}</th>
                                            <th className="align-middle bt-0 text-center sortable">
                                                <div className="d-flex align-items-baseline">
                                                    {Translate.convert("PatientName")}
                                                    <i className="fa fa-fw fa-sort text-muted"></i>
                                                </div>
                                                <div>
                                                    <input
                                                        placeholder={Translate.convert("PatientName")}
                                                        type="text"
                                                        className="bg-white form-control-sm form-control"
                                                        value={sysData.patient_name}
                                                        onKeyDown={handleCheckEnter}
                                                        onChange={() => handleSearch(event, "patient_name")}
                                                    />
                                                </div>
                                            </th>
                                            <th className="align-middle bt-0 text-center">{Translate.convert("Patient Sex")}</th>
                                            <th className="align-middle bt-0 text-center">{Translate.convert("Patient Age")}</th>
                                            <th className="align-middle bt-0 text-center">{Translate.convert("Patient Birthday")}</th>
                                            <th className="align-middle bt-0 text-center sortable" style={{ width: 120 }}>
                                                <div className="d-flex align-items-baseline">
                                                    {Translate.convert("Exam.....")}
                                                    <i className="fa fa-fw fa-sort text-muted"></i>
                                                </div>
                                                <div>
                                                    <input
                                                        placeholder={Translate.convert("Exam.....")}
                                                        type="text"
                                                        className="bg-white form-control-sm form-control"
                                                        value={sysData.exam}
                                                        onKeyDown={handleCheckEnter}
                                                        onChange={() => handleSearch(event, "exam")}
                                                    />
                                                </div>
                                            </th>
                                            <th className="align-middle bt-0 text-center">{Translate.convert("Accession_Number")}</th>
                                            <th className="align-middle bt-0 text-center">{Translate.convert("Study Identification")}</th>
                                            <th className="align-middle bt-0 text-center">{Translate.convert("Study Unified Identification")}</th>
                                            <th className="align-middle bt-0 text-center">{Translate.convert("Referring Physician Name")}</th>
                                            <th className="align-middle bt-0 text-center">{Translate.convert("Performing Physician Name")}</th>
                                            <th className="align-middle bt-0 text-center">{Translate.convert("Study_Date")}</th>
                                            <th className="align-middle bt-0 text-center sortable">
                                                <div className="d-flex align-items-baseline">
                                                {Translate.convert("Record_Time")}
                                                    <i className="fa fa-fw fa-sort text-muted"></i>
                                                </div>
                                                <div>
                                                    <input
                                                        placeholder={Translate.convert("Record_Time")}
                                                        type="text"
                                                        className="bg-white form-control-sm form-control"
                                                        value={sysData.record_time}
                                                        onKeyDown={handleCheckEnter}
                                                        onChange={() => handleSearch(event, "record_time")}
                                                    />
                                                </div>
                                            </th>
                                            <th className="align-middle bt-0 text-center">{Translate.convert("Origin ID")}</th>
                                            <th className="align-middle bt-0 text-center">{Translate.convert("Origin Name")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <TrTableSystemList data={data} onActionResult={handleActionResult} />
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
                                        size={dataCount}
                                    />
                                </div>
                                <Paginations
                                    count={dataCount}
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
