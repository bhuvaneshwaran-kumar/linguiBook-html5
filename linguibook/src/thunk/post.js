import { insertPostData, prepandPostData, updateCommunityLoad} from "../actions";
import { axiosWithAuthToken as authAxios } from "../utils/interceptors"
import { Map, OrderedMap, fromJS,  } from "immutable"
import { wait } from "./auth";

const create = async (params = {}) => {
    const resp = await authAxios.post('/api/post/create', params);
    return { resp }
}

const getPostsData = async (params) => { 
    const resp = await authAxios.post('/api/post/gp', params);
    return { resp }
}


export const createPost = (payload = {}) => {
    return async (dispatch) => {
        try {
            await dispatch(updateCommunityLoad({ isLoading: true }))
            await wait(700);
            const result = await create(payload);
            if (!result?.error) { 
                const data = result?.resp?.data?.data?.savedPost;
                data.isLiked = false;
                data.likesCount = 0;
                data.commentsCount = 0;
                if (data !== undefined) { 
                    await dispatch(prepandPostData({ data: { [data._id]: data }, communityId: payload.communityId }))
                }
            }
            return resp
        } catch (error) {
            return { error: true, message: error?.response?.data?.message };
        } finally {
            await dispatch(updateCommunityLoad({ isLoading: false }));
        }
    };
};

export const getPosts = (payload = {}) => { 
    return async (dispatch) => {
        try {
            await dispatch(updateCommunityLoad({ isLoading: true }))
            await wait(100);
            const result = await getPostsData(payload);
            let postData = result.resp.data.posts;
            if (postData.length) { 
                postData =  OrderedMap(fromJS(postData[0]));
            } else { 
                postData = OrderedMap({});
            }
            await dispatch(insertPostData({ postsData: postData }));
        } catch (error) {
            return { error: true, message: error?.response?.data?.message };
        } finally {
            await dispatch(updateCommunityLoad({ isLoading: false }));
        }
    };
}

