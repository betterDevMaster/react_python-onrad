import API from './api';
import Utils from '../utils';

export default class Send {
    static async getSEStatus() {
        try {
            const retVal = await API.request(API.SEND.SESTATUS);
            if (retVal.error) {
                Utils.error('Axios: Send status.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: Send status.', e);
        }
        return null;
    }
    static async handleSEStart() {
        try {
            const retVal = await API.request(API.SEND.SESTART);
            if (retVal.error) {
                Utils.error('Axios: Send status.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: Send status.', e);
        }
        return null;
    }
    static async handleSEStop() {
        try {
            const retVal = await API.request(API.SEND.SESTOP);
            if (retVal.error) {
                Utils.error('Axios: Send status.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: Send status.', e);
        }
        return null;
    }
    static async list(param) {
        // get Send's list from backend
        try {
            const retVal = await API.request({ ...API.SEND.LIST, url: API.SEND.LIST.url + '?page_index=' + param.page_index + '&page_size=' + param.page_size });

            if (retVal.error) {
                Utils.error('Axios: Send list.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: Send list.', e);
        }
        return [];
    }
    static async update(param) {
        // update Send
        try {
            const retVal = await API.request(API.SEND.UPDATE, param);
            if (retVal.error) {
                Utils.error('Axios: Update Send Error.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: Update Send.', e);
        }
        return [];
    }
    static async add(param) {
        // update Send
        try {
            const retVal = await API.request(API.SEND.ADD, param);
            if (retVal.error) {
                Utils.error('Axios: Update Send Error.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: Update Send.', e);
        }
        return [];
    }
    static async delete(param) {
        // update Send
        try {
            const retVal = await API.request({ ...API.SEND.DELETE, url: API.SEND.DELETE.url + '?id=' + param.id }, param);
            if (retVal.error) {
                Utils.error('Axios: Delete Send Error.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: Delete Send.', e);
        }
        return [];
    }
}
