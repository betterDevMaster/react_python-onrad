import API from './api';
import Utils from '../utils';

export default class SThree {
    static async getSTStatus() {
        try {
            const retVal = await API.request(API.STHREE.STSTATUS);
            if (retVal.error) {
                Utils.error('Axios: SThree status.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: SThree status.', e);
        }
        return null;
    }
    static async handleSTStart() {
        try {
            const retVal = await API.request(API.STHREE.STSTART);
            if (retVal.error) {
                Utils.error('Axios: SThree status.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: SThree status.', e);
        }
        return null;
    }
    static async handleSTStop() {
        try {
            const retVal = await API.request(API.STHREE.STSTOP);
            if (retVal.error) {
                Utils.error('Axios: SThree status.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: SThree status.', e);
        }
        return null;
    }
    static async list(param) {
        // get SThree's list from backend
        try {
            const retVal = await API.request({ ...API.STHREE.LIST, url: API.STHREE.LIST.url + '?page_index=' + param.page_index + '&page_size=' + param.page_size });

            if (retVal.error) {
                Utils.error('Axios: SThree list.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: SThree list.', e);
        }
        return [];
    }
    static async update(param) {
        // update SThree
        try {
            const retVal = await API.request(API.STHREE.UPDATE, param);
            if (retVal.error) {
                Utils.error('Axios: Update SThree Error.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: Update SThree.', e);
        }
        return [];
    }
    static async add(param) {
        // update SThree
        try {
            const retVal = await API.request(API.STHREE.ADD, param);
            if (retVal.error) {
                Utils.error('Axios: Update SThree Error.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: Update SThree.', e);
        }
        return [];
    }
    static async delete(param) {
        // update SThree
        try {
            const retVal = await API.request({ ...API.STHREE.DELETE, url: API.STHREE.DELETE.url + '?id=' + param.id }, param);
            if (retVal.error) {
                Utils.error('Axios: Delete SThree Error.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: Delete SThree.', e);
        }
        return [];
    }
}
