import { setLoader, setVocabularies, updateVocabularies } from "../actions";
import { axiosWithAuthToken as authAxios } from "../utils/interceptors"
import { Map, OrderedMap, fromJS } from "immutable"
import { wait } from "./auth";
export const getContextDetials = async (params = {}) => {
    let headers = {};
    if (params.cancelToken) { 
        headers.cancelToken = params.cancelToken;
    }
    const resp = await authAxios.get('/api/project/getContext', {}, headers);
    let { activeContextId, contextData } = resp.data.data;
    contextData = OrderedMap(contextData).sortBy(value => value.index).mapEntries(([key, value]) => [key, Map(value)]);;
    return { activeContextId, contextData }
}

export const getVocDetials = async (params = {}) => {
    const { contextId, from = 0, size = 20, cancelToken } = params;
    let headers = {};
    if (cancelToken) {
        headers.cancelToken = cancelToken;
    }
    const resp = await authAxios.post(`/api/project/getVoc`, { contextId, from, size }, headers);
    let { vocabularies } = resp.data.data;
    vocabularies = OrderedMap(vocabularies).sortBy((value, key) => value.index).mapEntries(([key, value]) => [key, fromJS(value)]);;
    return { vocabularies };
}

/**
 * 
 * @param {object} payload 
 * @param {string} payload.contextId 
 * @param {number} payload.from 
 * @param {number} payload.to 
 * @param {Axios instance} payload.cancelToken optional 
 * @returns {object} error || hasData
 */
export const loadVocData = (payload = {}) => {
    return async (dispatch) => {
        try {
            const { size } = payload;
            await dispatch(setLoader({ isVocChunkLoad: true }));
            await wait(700);
            const { vocabularies } = await getVocDetials(payload);
            await dispatch(updateVocabularies({ vocabularies }));
            return { hasData: size === vocabularies.size };
        } catch (error) {
            return { error: true };
        } finally {
            await dispatch(setLoader({ isVocChunkLoad: false }));
        }
    };
};

export const loadCtxtVocData = (contextId) => {
    return async (dispatch) => {
        try {
            await dispatch(setLoader({ isVocLoading: true }));
            await wait(700);
            const { vocabularies } = await getVocDetials({ contextId });
            if (!vocabularies || !vocabularies.size) { throw new Error("no data found in the context") }
            await dispatch(setVocabularies({ vocabularies, contextId }));
        } catch (err) {
            // handle error message
        } finally {
            await dispatch(setLoader({ isVocLoading: false }));
        }
    }
}