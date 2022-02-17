import axios from "axios";

axios.defaults.headers.get["Content-Type"] = "application/x-www-form-urlencoded";
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

export default class API {
    static request(api, params = null) {
        if (axios[api.method])
            return params
                ? axios[api.method](api.url, params, { headers: api.headers })
                : axios[api.method](api.url, { headers: api.headers });
        return null;
    }

    // static server_address = "/api";
    static server_address = "http://127.0.0.1:8000/api";

    static USER = {
        LOGIN: {
            method: "post",
            url: `${this.server_address}/TUser/login`,
            headers: {
                "Content-Type": "application/json",
                // Authorization: 'Q2hhdGFsa19Ob2RlX0FQSV9EZXZlbG9wZWQhQCM='
            },
        },
        REGISTER: {
            method: "post",
            url: `${this.server_address}/TUser/register`,
            headers: {
                "Content-Type": "application/json",
            },
        },
        FORGOTPASSWORD: {
            method: "post",
            url: `${this.server_address}/TUser/forgotPassword`,
            headers: {
                "Content-Type": "application/json",
            },
        },
        LIST: {
            method: "get",
            url: `${this.server_address}/TUser/list`,
            headers: {
                "Content-Type": "application/json",
            },
        },
        UPDATE: {
            method: "put",
            url: `${this.server_address}/TUser/update`,
            headers: {
                "Content-Type": "application/json",
            },
        },
        DELETE: {
            method: "delete",
            url: `${this.server_address}/TUser/delete`,
            headers: {
                "Content-Type": "application/json",
            },
        },
        SCPGET: {
            method: "get",
            url: `${this.server_address}/TOrigin/get`,
            headers: {
                "Content-Type": "application/json",
            },
        },
        SCPSET: {
            method: "put",
            url: `${this.server_address}/TOrigin/set`,
            headers: {
                "Content-Type": "application/json",
            },
        },
        SCPSTART: {
            method: "post",
            url: `${this.server_address}/TOrigin/start`,
            headers: {},
        },
        SCPSTOP: {
            method: "post",
            url: `${this.server_address}/TOrigin/stop`,
            headers: {},
        },
        SCPSTATUS: {
            method: "get",
            url: `${this.server_address}/TOrigin/status`,
            headers: {
                "Content-Type": "application/json",
            },
        },
    };

    static STHREE = {
        STSTATUS: {
            method: "get",
            url: `${this.server_address}/TS3/status`,
            headers: {
                "Content-Type": "application/json",
            },
        },
        STSTART: {
            method: "post",
            url: `${this.server_address}/TS3/start`,
            headers: {},
        },
        STSTOP: {
            method: "post",
            url: `${this.server_address}/TS3/stop`,
            headers: {},
        },
        LIST: {
            method: "get",
            url: `${this.server_address}/TS3/list`,
            headers: {
                "Content-Type": "application/json",
            },
        },
        ADD: {
            method: "post",
            url: `${this.server_address}/TS3/add`,
            headers: {
                "Content-Type": "application/json",
            },
        },
        UPDATE: {
            method: "put",
            url: `${this.server_address}/TS3/update`,
            headers: {
                "Content-Type": "application/json",
            },
        },
        DELETE: {
            method: "delete",
            url: `${this.server_address}/TS3/delete`,
            headers: {
                "Content-Type": "application/json",
            },
        },
    };

    static SEND = {
        SESTATUS: {
            method: "get",
            url: `${this.server_address}/TSend/status`,
            headers: {
                "Content-Type": "application/json",
            },
        },
        SESTART: {
            method: "post",
            url: `${this.server_address}/TSend/start`,
            headers: {},
        },
        SESTOP: {
            method: "post",
            url: `${this.server_address}/TSend/stop`,
            headers: {},
        },
        LIST: {
            method: "get",
            url: `${this.server_address}/TSend/list`,
            headers: {
                "Content-Type": "application/json",
            },
        },
        ADD: {
            method: "post",
            url: `${this.server_address}/TSend/add`,
            headers: {
                "Content-Type": "application/json",
            },
        },
        UPDATE: {
            method: "put",
            url: `${this.server_address}/TSend/update`,
            headers: {
                "Content-Type": "application/json",
            },
        },
        DELETE: {
            method: "delete",
            url: `${this.server_address}/TSend/delete`,
            headers: {
                "Content-Type": "application/json",
            },
        },
    };

    static SYSTEM = {
        SYSSTATUS: {
            method: "get",
            url: `${this.server_address}/TSystem/status`,
            headers: {
                "Content-Type": "application/json",
            },
        },
        LIST: {
            method: "get",
            url: `${this.server_address}/TSystem/log`,
            headers: {
                "Content-Type": "application/json",
            },
        },
        SEARCH: {
            method: "get",
            url: `${this.server_address}/TSystem/log`,
            headers: {
                "Content-Type": "application/json",
            },
        },
        DOWNLOAD: {
            method: "get",
            url: `${this.server_address}/TSystem/download`,
            headers: {
                "Content-Type": "application/json",
            },
        },
    };
    static ONROAD = {
        GET: {
            method: "get",
            url: `${this.server_address}/TWeb/get`,
            headers: {
                "Content-Type": "application/json",
            },
        },
        SET: {
            method: "put",
            url: `${this.server_address}/TWeb/set`,
            headers: {
                "Content-Type": "application/json",
            },
        },
    };
}
