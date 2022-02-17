import API from './api';
import Utils from '../utils';

function virtualFetch() {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), 2000);
    });
}
export default class User {
  
    static async list(param) {
        // get user's list from backend
        try {
            const retVal = await API.request({ ...API.USER.LIST, url: API.USER.LIST.url + '?page_index=' + param.page_index + '&page_size=' + param.page_size });

            if (retVal.error) {
                Utils.error('Axios: User list.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: User list.', e);
        }
        return [];
    }
    static async create(param) {
        // create user
        try {
            const retVal = await API.request(API.USER.USERCREATE, param);
            if (retVal.error) {
                Utils.error('Axios: Create User Error.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: Create User.', e);
        }
        return [];
    }
    static async update(param) {
        // update user
        try {
            const retVal = await API.request(API.USER.UPDATE, param);
            if (retVal.error) {
                Utils.error('Axios: Update User Error.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: Update User.', e);
        }
        return [];
    }
    static async toggleStatus(param) {
        // toggle user status
        try {
            const retVal = await API.request(API.USER.TOGGLESTATUS, param);
            if (retVal.error) {
                Utils.error('Axios: Toggle User Status Error.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: Toggle User Status.', e);
        }
        return [];
    }
    static async delete(param) {
        // update user
        try {
            const retVal = await API.request({ ...API.USER.DELETE, url: API.USER.DELETE.url + '?userid=' + param.user_id }, param);
            if (retVal.error) {
                Utils.error('Axios: Delete User Error.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: Delete User.', e);
        }
        return [];
    }
    /**
     *  login
     * @param {*} param : {username, password}
     */
    static async login(param) {
        try {
            const retVal = await API.request(API.USER.LOGIN, param);
            if (retVal.error) {
                Utils.error('Axios: User login.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: User login.', e);
        }
        return null;
    }
    /**
     *  register
     * @param {*} param : {username, password, email}
     */
    static async register(param) {
        try {
            const retVal = await API.request(API.USER.REGISTER, param);
            if (retVal.error) {
                Utils.error('Axios: User register.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: User register.', e);
        }
        return null;
    }
    /**
     *  send reset request
     * @param {*} param : {username, password}
     */
    static async forgotPassword(param) {
        try {
            const retVal = await API.request(API.USER.FORGOTPASSWORD, param);
            if (retVal.error) {
                Utils.error('Axios: forgotpassword Password.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: forgotpassword Password.', e);
        }
        return null;
    }

    /**
     *  getSCP
     */
    static async getSCPStatus() {
        try {
            const retVal = await API.request(API.USER.SCPSTATUS);
            if (retVal.error) {
                Utils.error('Axios: SCP status.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: SCP status.', e);
        }
        return null;
    }
    static async handleSCPStart() {
        try {
            const retVal = await API.request(API.USER.SCPSTART);
            if (retVal.error) {
                Utils.error('Axios: SCP status.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: SCP status.', e);
        }
        return null;
    }
    static async handleSCPStop() {
        try {
            const retVal = await API.request(API.USER.SCPSTOP);
            if (retVal.error) {
                Utils.error('Axios: SCP status.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: SCP status.', e);
        }
        return null;
    }

    /**
     *  getSCP
     */
    static async getSCP() {
        try {
            const retVal = await API.request(API.USER.SCPGET);
            if (retVal.error) {
                Utils.error('Axios: SCP data.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: SCP data.', e);
        }
        return null;
    }
        /**
     *  send reset request
     * @param {*} param : {username, password}
     */
    static async handleSCPUpdate(param) {
        try {
            const retVal = await API.request(API.USER.SCPSET, param);
            if (retVal.error) {
                Utils.error('Axios: scp update.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: scp update.', e);
        }
        return null;
    }
}
