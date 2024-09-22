import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client"
import { API_URI } from "../utils/constant";
import { likePostComplete, prepandPostDataComplete, setSocketStatus, updateJoinCommunityComplete, updateVocabDataComplete } from "../actions";
let socket;
let timeout;
let userId;

export const sendSocketMessage = (actionName, payload) => { 
    if (socket) { 
        socket.emit(actionName, {
            ...payload, userId
        })
    }
}

export const getSocketId = () => socket ? socket.id : "";``

export default ({ children }) => {
    let dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.localStorage.getIn(["auth", "isLogged"]));
    const userDet = useSelector((state) => state.localStorage.get("user"));

    if (!socket && isAuthenticated && userDet) {
        userId = userDet.get("_id");
        socket = io.connect(API_URI);
        socket.emit("setup", userId);
        socket.on("connected", () => { 
            dispatch(setSocketStatus("connected"))
        })

        socket.on("updateVocabDataComplete", (data) => { 
            if (userId !== data.userId) { 
                if (data.isLiked !== undefined) { 
                    data.likesCount = data.isLiked ? 1 : -1;
                    delete data.isLiked    
                }
            }
            dispatch(updateVocabDataComplete(data))
        })
        
        socket.on("likePostComplete", (data) => { 
            if (userId !== data.userId) { 
                if (data.isLiked !== undefined) { 
                    data.likesCount = data.isLiked ? 1 : -1;
                    delete data.isLiked    
                }
            }
            dispatch(likePostComplete(data))
        })

        socket.on("joinCommunityComplete", (data) => { 
            // **todo to sjow joinn message
            // dispatch(updateJoinCommunityComplete(data))
        })
        
        socket.on("prepandPostDataComplete", (data) => { 
            dispatch(prepandPostDataComplete(data))
        })
    }

    return children
}

