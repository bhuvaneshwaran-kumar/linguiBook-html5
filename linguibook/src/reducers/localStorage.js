import { fromJS } from "immutable"
const initialState = fromJS({
    user: {
        name: "",
        bio: "",
        profileUrl: "",
        _id: ""
    },
    appLoadStatus: {
        isLoading: true,
        loadPercent: 0,
    },
    auth: {
        isLogged: false,
        isLoading: false
    },
    aiConvo: [{ from: "ai", msg: "Hi I'm LinguiBook Your learning assistant, How can I help you today?" }],
    isAiMsgLoading: false,
    aiUserMsgSugg: "",
    isVocChunkLoad: false,
    isVocLoading: false,
    socketStatus: "connecting",
})

const localStorage = (state = initialState, action) => { 
    switch (action.type) { 
        case "UPDATE_USER_DATA": { 
            const { data: user } = action;
            state = state.update("user", (userDet) => userDet.merge(user));
            return state;
        }
        case "UPDATE_APP_LOAD": {
            const { isLoading, loadPercent } = action.data;
            state = state.update("appLoadStatus", (loadData) => loadData.merge({ isLoading, loadPercent }));
            return state;
        }
        case "UPDATE_USER_AUTH": {
            const { isLogged, isLoading } = action.data;
            state = state.update("auth", (authData) => authData.merge({ isLogged, isLoading }));
            return state;
        }
        case "SET_LOADER": {
            const { isVocChunkLoad, isVocLoading, isAiMsgLoading } = action.data;
            if (isVocChunkLoad !== undefined) { 
                state = state.set("isVocChunkLoad", isVocChunkLoad);
            } 
            if (isVocLoading !== undefined) { 
                state = state.set("isVocLoading", isVocLoading);
            } 
            if (isAiMsgLoading !== undefined) { 
                state = state.set("isAiMsgLoading", isAiMsgLoading);
            } 
            return state;
        }
        case "UPDATE_AI_CONVO": {
            state = state.update("aiConvo", (convo) => convo.push(fromJS(action.data)));
            return state;
        }
        case "SET_AI_USER_MSG_SUGG": { 
            state = state.set("aiUserMsgSugg", action.data);
            return state;
        }
        case "SET_SOCKET_STATUS": {
            state = state.set("socketStatus", action.data);
            return state;
        }
        default : 
            return state;
    }
}

export default localStorage