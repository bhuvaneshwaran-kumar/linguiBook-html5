import { likePostComplete, prepandPostDataComplete, setActiveCommunityComplete, updateJoinCommunityComplete, updateVocabDataComplete } from "../actions";
import { sendSocketMessage } from "../socket";

export const autosaveMiddleware = (store) => next => action => {

    const state = store.getState();
    const { type } = action;
    switch (type) { 
        case "UPDATE_VOCAB_DATA": { 
            sendSocketMessage("updateVocabData", action.data);
            store.dispatch(updateVocabDataComplete(action.data));
            break;
        }
        case "SET_ACTIVE_COMMUNITY": {
            const { id, type } = action.data
            const prevActiveCommunity = state.communityStorage.get("activeCommunity")
            if (prevActiveCommunity.get("id") !== "" && prevActiveCommunity.get("type") !== "otherCommunites") {
                sendSocketMessage("leaveRoom", { roomId: id });
            }
            if (id !== "" && type !== "otherCommunites") {
                sendSocketMessage("joinRoom", { roomId: id });
            }
            store.dispatch(setActiveCommunityComplete(action.data));
            break;
        }
        case "UPDATE_JOIN_COMMUNITY": {
            sendSocketMessage("joinCommunity", action.data);
            store.dispatch(updateJoinCommunityComplete(action.data));
            break;
        }
        case "PREPAND_POST_DATA": {
            sendSocketMessage("prepandPostData", action.data);
            store.dispatch(prepandPostDataComplete(action.data));
            break;
        }
        case "LIKE_POST": { 
            sendSocketMessage("likePost", action.data);
            store.dispatch(likePostComplete(action.data));
        }
        default: 
            break;
    }
    return next(action);
}