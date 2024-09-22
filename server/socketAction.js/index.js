const socketIo = require("socket.io");
const { CORS_ORIGIN } = require("../constants");
const { updateLike, updateComment } = require("../routes/ctxtVoc");
const { joinCommunity } = require("../routes/community");
const { updatePostLike } = require("../routes/post");
let CORS_ORIGINS = CORS_ORIGIN.split(' ');

function connectSocket(server) {
    const io = socketIo(server, {
        pingTimeout: 600000,
        cors: {
            origin: CORS_ORIGINS
        }
    })

    io.on("connection", (socket) => {
        socket.on("setup", (userId) => { 
            socket.join(userId);
            socket.emit("connected");
        })
        
        socket.on("joinVocab", (data) => { 
            const { ctxId } = data;
            console.log("joinVocab", ctxId);
            socket.join(ctxId);
        })

        socket.on("leaveVocab", (data) => { 
            const { ctxId } = data;
            socket.leave(ctxId);
        })

        socket.on("joinRoom", (data) => { 
            const { roomId } = data;
            socket.join(roomId);
        })

        socket.on("leaveRoom", (data) => { 
            const { roomId } = data;
            socket.leave(roomId);
        })
        
        socket.on("updateVocabData", async (data) => { 
            const { ctxId, isLiked, commentData } = data;
            socket.broadcast.to(ctxId).emit("updateVocabDataComplete",data);

            try{
                if (isLiked !== undefined) { 
                    await updateLike(data);
                }
                if (commentData !== undefined) { 
                    await updateComment(data);
                }
            } catch (err) { 
                // throw error autoSaveException
            }
        }) 

        socket.on("prepandPostData", async (data) => { 
            const { communityId } = data;
            socket.broadcast.to(communityId).emit("prepandPostDataComplete", data);
        }) 

        socket.on("joinCommunity", async (data) => { 
            const { id, userId, userName, profileUrl  } = data;
            socket.broadcast.to(id).emit("joinCommunityComplete", { id, userId, userName, profileUrl });
            try{
                await joinCommunity(data);
            } catch (err) { 
                // throw error autoSaveException
            }
        })

        socket.on("likePost", async (data) => { 
            const { communityId, isLiked } = data;
            socket.broadcast.to(communityId).emit("likePostComplete", data);
            try {
                console.log(data, "data");
                await updatePostLike(data);
            } catch (err) { 
                // throw error autoSaveException
            }
        })
    })
}

module.exports = { connectSocket }