import React, { useState, useEffect } from "react";

import {
  Container,
  Card,
  CardFooter,
  CardBody,
  Row,
  Col,
  Table,
  Button,
} from "../../../components";
import { HeaderMain } from "../../components/HeaderMain";

import { TrTableSThreeList } from "./TrTableSThreeList";
import CustomSizePerPageButton from "../../components/CustomSizePerPageButton";
import { CustomPaginationTotal } from "../../components/CustomPaginationTotal";

import { Paginations } from "../../components/Paginations";

import SThree from "../../../model/SThree";
import Translate from "../../../utils/translate";

export default function SThreeList() {
  const [bucketList, setBucketList] = useState([]);
  const [bucketListCount, setBucketListCount] = useState(0);
  const [currPage, setCurrPage] = useState(0);
  const [currSizePerPage, setCurrSizePerPage] = useState(5);
  const options = [{ page: 5 }, { page: 10 }, { page: 20 }];
  const [connectionStatus, setConnectionStatus] = useState(true);

  useEffect(() => {
    fetchData(currPage, currSizePerPage);
  }, []);

  const fetchData = async (_currPage, _currSizePerPage) => {
    const _stConnectionStatus = await SThree.getSTStatus();
    if (_stConnectionStatus.error === 0)
      setConnectionStatus(_stConnectionStatus.status);

    const ret = await SThree.list({
      page_index: _currPage,
      page_size: _currSizePerPage,
    });
    if (ret.error === 0) {
      setBucketList(ret.list);
      setBucketListCount(ret.s3_count);
    }
  };
  const handleSTStart = async () => {
    const ret = await SThree.handleSTStart();
    if (ret.error === 0) setConnectionStatus(ret.status);
  };
  const handleSTStop = async () => {
    const ret = await SThree.handleSTStop();
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
        access_key_id: "",
        active: 1,
        bucket_name: "",
        console: "",
        passwd: "",
        secret_access_key: "",
        username: "",
      },
    ];

    const newArray = newArr.concat(bucketList);
    setBucketList(newArray);
  };

  return (
    <React.Fragment>
      <Container style={{ maxWidth: "1350px" }}>
        <div className="d-flex">
          <div>
            <HeaderMain title={Translate.convert('AWS S3 Buckets setting')} className="mb-5 mt-4" />
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
              {/* <Button color="primary" className="mr-2" onClick={handleSTStart}>
                S3Start
              </Button>
              <Button color="primary" className="mr-2" onClick={handleSTStop}>
                S3Stop
              </Button> */}
              <Button color="primary" className="mr-2" onClick={handleSTAdd}>
              {Translate.convert('Add New')}
              </Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <Card className="mb-3">
              <div className="table-responsive">
                <Table className="mb-0" hover>
                  <thead>
                    <tr>
                      <th className="align-middle bt-0">{Translate.convert('User ID')}</th>
                      <th className="align-middle bt-0">{Translate.convert('Password')}</th>
                      <th className="align-middle bt-0">{Translate.convert('Bucket Name')}</th>
                      <th className="align-middle bt-0">{Translate.convert('Private Key')}</th>
                      <th className="align-middle bt-0">{Translate.convert('Public Key')}</th>
                      <th className="align-middle bt-0" style={{ width: 0 }}>
                        {/* Console */}
                      </th>
                      <th className="align-middle bt-0">{Translate.convert('Status')}</th>
                      <th className="align-middle bt-0 text-right">{Translate.convert('Actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <TrTableSThreeList
                      bucketList={bucketList}
                      onActionResult={handleActionResult}
                    />
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
                    size={bucketListCount}
                  />
                </div>
                <Paginations
                  count={bucketListCount}
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
