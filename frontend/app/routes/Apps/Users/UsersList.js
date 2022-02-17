import React, { useState, useEffect } from "react";

import { Card, CardFooter, Table } from "./../../../components";

import { TrTableUsersList } from "./TrTableUsersList";
import CustomSizePerPageButton from "../../components/CustomSizePerPageButton";
import { CustomPaginationTotal } from "../../components/CustomPaginationTotal";

import { Paginations } from "../../components/Paginations";

import User from "../../../model/User";
import Translate from "../../../utils/translate";

export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [userCount, setUserCount] = useState(0);
    const [currPage, setCurrPage] = useState(0);
    const [currSizePerPage, setCurrSizePerPage] = useState(5);
    const options = [{ page: 5 }, { page: 10 }, { page: 20 }];

    useEffect(() => {
        fetchData(currPage, currSizePerPage);
    }, []);

    const fetchData = async (_currPage, _currSizePerPage) => {
        const ret = await User.list({ page_index: _currPage, page_size: _currSizePerPage });
        if (ret.error === 0) {
            setUsers(ret.users);
            setUserCount(ret.users_count);
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

    return (
        <Card className="mb-3">
            {/* START Table */}
            <div className="table-responsive">
                <Table className="mb-0" hover>
                    <thead>
                        <tr>
                            <th className="align-middle bt-0">{Translate.convert("Name")}</th>
                            <th className="align-middle bt-0">{Translate.convert("Email")}</th>
                            <th className="align-middle bt-0">{Translate.convert("Status")}</th>
                            <th className="align-middle bt-0 text-right">{Translate.convert("Actions")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TrTableUsersList users={users} onActionResult={handleActionResult} />
                    </tbody>
                </Table>
            </div>
            {/* END Table */}
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
                        size={userCount}
                    />
                </div>
                <Paginations count={userCount} currPage={currPage} currSizePerPage={currSizePerPage} onPageResult={handlePageSelection} />
            </CardFooter>
        </Card>
    );
}
