/**
 * This module contains action creators.
 * @module actionCreaters
 */


export const updateAppLoad = (data) => ({
    type: "UPDATE_APP_LOAD",
    data
})

export const updateUserAuth = (data) => ({
    type: "UPDATE_USER_AUTH",
    data
})

export const updateUserData = (data) => ({
    type: "UPDATE_USER_DATA",
    data
})

export const updateContextData = (data) => ({
    type: "UPDATE_CONTEXT_DATA",
    data
})

export const setSocketStatus = (data) => ({
    type: "SET_SOCKET_STATUS",
    data
})

/**
 * 
 * @param {object} data 
 * @param {boolean} data.isVocChunkLoad
 * @param {boolean} data.isVocLoading 
 * @returns 
 */
export const setLoader = (data) => ({
    type: "SET_LOADER",
    data
})

export const updateCommunityLoad = (data) => ({
    type: "UPDATE_COMMUNITY_LOAD",
    data
})

export const updateUserCommunity = (data) => ({
    type: "UPDATE_USER_COMMUNITY",
    data
})

export const updateJoinCommunity = (data) => ({
    type : "UPDATE_JOIN_COMMUNITY",
    data
})

export const updateJoinCommunityComplete = (data) => ({
    type: "UPDATE_JOIN_COMMUNITY_COMPLETE",
    data
})

export const updateOtherCommunity = (data) => ({
    type: "UPDATE_OTHER_COMMUNITY",
    data
})

export const setActiveCommunity = (data) => ({
    type: "SET_ACTIVE_COMMUNITY",
    data
})

export const setActiveCommunityComplete = (data) => ({
    type: "SET_ACTIVE_COMMUNITY_COMPLETE",
    data
})

export const likePost = (data) => ({
    type: "LIKE_POST",
    data
})

export const likePostComplete = (data) => ({
    type: "LIKE_POST_COMPLETE",
    data
})

export const insertPostData = (data) => ({
    type: "INSERT_POST_DATA",
    data
})

export const prepandPostData = (data, communityId) => ({
    type: "PREPAND_POST_DATA",
    data
})

export const prepandPostDataComplete = (data) => ({
    type: "PREPAND_POST_DATA_COMPLETE",
    data
})

export const setAiUsrMsgSugg = (data) => ({
    type: "SET_AI_USER_MSG_SUGG",
    data
})

export const updateVocabularies = (data) => ({
    type: "UPDATE_VOCABULARIES",
    data
})

export const setVocabularies = (data) => ({
    type: "SET_VOCABULARIES",
    data
})

export const updateAiConvo = data => ({
    type: "UPDATE_AI_CONVO",
    data
})

export const updateVocabData = data => ({
    type: "UPDATE_VOCAB_DATA",
    data
})

export const updateVocabDataComplete = data => ({
    type: "UPDATE_VOCAB_DATA_COMPLETE",
    data
})
