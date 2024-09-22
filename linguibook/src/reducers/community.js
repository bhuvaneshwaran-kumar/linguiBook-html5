import { OrderedMap, fromJS } from "immutable"
const initialState = fromJS({
    communityLoadStatus: {
        isLoading: false,
        loadPercent: 0,
    },
    activeCommunity: {
        id: "",
        type: ""
    },
    userCommunites: OrderedMap({}),
    otherCommunites: OrderedMap({}),
    postsData: OrderedMap({})
})

const communityStorage = (state = initialState, action) => { 
    switch (action.type) { 
        case "SET_ACTIVE_COMMUNITY_COMPLETE": {
            const { id, type } = action.data
            state = state.update("activeCommunity", (active) => active.merge(fromJS({ id, type })));
            return state;
        }
        case "UPDATE_COMMUNITY_LOAD": {
            const { isLoading } = action.data;
            state = state.update("communityLoadStatus", (loadData) => loadData.merge({ isLoading }));
            return state;
        }
        case "UPDATE_USER_COMMUNITY": {
            state = state.update("userCommunites", (community) => community.merge(action.data));
            return state;
        }
        case "UPDATE_OTHER_COMMUNITY": {
            state = state.update("otherCommunites", (community) => community.merge(action.data));
            return state;
        }
        case "UPDATE_JOIN_COMMUNITY_COMPLETE": {
            const { userID, userName, profileUrl } = action.data;
            let communityDet = state.getIn(["otherCommunites",action.data.id]);
            communityDet = communityDet.update("members", (data) => data.push({ userID, userName, profileUrl }))
            state = state.deleteIn(["otherCommunites", action.data.id])
            state = state.update("userCommunites", (community) => community.merge({ [action.data.id]: communityDet }));
            return state;
        }
        case "INSERT_POST_DATA": { 
            const { postsData } = action.data;
            if (postsData !== undefined) { 
                state = state.set("postsData", postsData);
            }
            return state;
        }
        case "PREPAND_POST_DATA_COMPLETE": { 
            const { data } = action.data;
            if (data !== undefined) { 
                state = state.update("postsData", (postsData) => (OrderedMap(fromJS({ ...data })).merge(postsData)));
            }
            return state;
        }
        case "LIKE_POST_COMPLETE": { 
            const { isLiked, postId, likesCount } = action.data
            if (isLiked !== undefined) { 
                state = state.setIn(["postsData", postId, "isLiked"], isLiked);
                state = state.updateIn(["postsData", postId, "likesCount"], (value) => isLiked ? value + 1 : value - 1);
            }
            if (likesCount !== undefined) { 
                state = state.updateIn(["postsData", postId, "likesCount"], (value) => value + likesCount);
            }
        }
        default : 
            return state;
    }
}

export default communityStorage