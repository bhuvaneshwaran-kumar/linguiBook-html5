import { setActiveCommunity, setLoader, updateCommunityLoad, updateOtherCommunity, updateUserCommunity } from "../actions";
import { axiosWithAuthToken as authAxios } from "../utils/interceptors"
import { Map, OrderedMap, fromJS,  } from "immutable"
import { wait } from "./auth";

const create = async (params = {}) => {
    let headers = {};
    if (params.cancelToken) { 
        headers.cancelToken = params.cancelToken;
    }
    const resp = await authAxios.post('/api/community/create', params, headers);
    return { resp }
}

const getUserCommunities = async (params) => { 
    const resp = await authAxios.get('/api/community/guc', params);
    return { resp }
}

const getOtherCommunities = async (params) => { 
    const resp = await authAxios.get('/api/community/goc', params);
    return { resp }
}

export const createCommunity = (payload = {}) => {
    return async (dispatch) => {
        try {
            await dispatch(updateCommunityLoad({ isLoading: true }))
            await wait(700);
            const { resp } = await create(payload);

            if (!resp.error) { 
                let community = {
                    [resp.data.data.savedCommunity._id]: resp.data.data.savedCommunity
                }
                await dispatch(updateUserCommunity(fromJS(community)));
            }

            return resp
        } catch (error) {
            return { error: true, message: error.response.data.message };
        } finally {
            await dispatch(updateCommunityLoad({ isLoading: false }));
        }
    };
};

export const getCommunities = (payload = {}, of = "both") => { 
    return async (dispatch) => {
        try {
            let type, id;
            await dispatch(updateCommunityLoad({ isLoading: true }))
            await wait(100);

            if (of === "both" || of === "users") { 
                const resp = await getUserCommunities(payload); 
                const communites = resp.resp.data.communites[0];
                type = "userCommunites";
                id = Object.keys(communites)[0]            
                await dispatch(updateUserCommunity(OrderedMap(fromJS(communites))));
            }

            if (of === "both" || of === "others") { 
                const resp = await getOtherCommunities(payload);
                const communites = resp.resp.data.communites[0];   
                if (!type || !id) { 
                    id = Object.keys(communites)[0]
                    type = "otherCommunites"
                }
                await dispatch(updateOtherCommunity(OrderedMap(fromJS(communites))));
            }
            if (type && id) { 
                // await dispatch(setActiveCommunity({ id, type }));
            }
        } catch (error) {
            return { error: true, message: error?.response?.data?.message };
        } finally {
            await dispatch(updateCommunityLoad({ isLoading: false }));
        }
    };
}

export const changeCommunity = (payload = {}, of = "both") => { 
    return async (dispatch) => {
        try {
            const { type, id } = payload;
            await dispatch(updateCommunityLoad({ isLoading: true }))
            await wait(100);
            // await get post data
            await dispatch(setActiveCommunity({ id, type }));
        } catch (error) {
            return { error: true, message: error?.response?.data?.message };
        } finally {
            await dispatch(updateCommunityLoad({ isLoading: false }));
        }
    };
}