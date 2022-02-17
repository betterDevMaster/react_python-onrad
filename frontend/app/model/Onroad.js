import API from './api';
import Utils from '../utils';

export default class Onroad {
    /**
     *  get
     */
    static async get() {
        try {
            const retVal = await API.request(API.ONROAD.GET);
            if (retVal.error) {
                Utils.error('Axios: SCP status.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: SCP status.', e);
        }
        return {};
    }
    /**
     *  send reset request
     * @param {*} param : {username, password}
     */
    static async set(param) {
        try {
            const retVal = await API.request(API.ONROAD.SET, param);
            if (retVal.error) {
                Utils.error('Axios: scp update.', retVal.message);
            } else {
                return retVal.data;
            }
        } catch (e) {
            Utils.error('Axios: scp update.', e);
        }
        return {};
    }
}
