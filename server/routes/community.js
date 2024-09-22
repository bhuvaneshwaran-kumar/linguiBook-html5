const express = require('express')
const Community = require('../models/Community')
const Router = express.Router()
const { isAuthenticated } = require('../utils/tokens')
const { communityAggregate } = require('../utils/aggregate')

Router.post('/create', isAuthenticated, async (req, res) => {
    try {
        const { profileUrl, name, description, adminId, adminName, adminProfileUrl } = req.body;

        const communityExist = await Community.findOne({ name: name });

        if (communityExist) {
            return res.status(403).json({
                ok: false,
                message: `community name ${name} already exist`
            })
        }

        const community = new Community({
            profileUrl, name, description, adminId, adminName, adminProfileUrl 
        })
        const savedCommunity = await community.save();
        return res.status(200).json({
            ok: true,
            data: { savedCommunity }
        })
    } catch (Err) { 
        return res.status(400).json({
            ok: false,
            data: { ok: "fail" }
        })
    }
})

Router.get('/guc', isAuthenticated, async (req, res) => {
    try {
        const { user } = req
        const communites = await Community.aggregate([
            {
                $match: {
                    $or: [
                        { adminId: user._id },
                        { members: { $elemMatch: { userID: user._id } } }
                    ]
                }
            },
            ...communityAggregate
        ]);

        return res.status(200).json({
            ok: true,
            communites
        })
    } catch (Err) { 
        return res.status(400).json({
            ok: false,
            data: { ok: "fail" }
        })
    }
})

Router.get('/goc', isAuthenticated, async (req, res) => {
    try {
        const { user } = req
        const communites = await Community.aggregate([
            {
                $match: {
                    $nor: [
                        { adminId: user._id },
                        { members: { $elemMatch: { userID: user._id } } }
                    ]
                }
            },
            ...communityAggregate
        ]);

        return res.status(200).json({
            ok: true,
            communites
        })
    } catch (Err) { 
        return res.status(400).json({
            ok: false,
            data: { ok: "fail" }
        })
    }
})

const updatePostLike = async (data) => { 
    const { isLiked, vocabId, userId } = data;

    try {
        let updatedVocabulary;

        if (isLiked) {
            // Add userId to likes array if not already present
            updatedVocabulary = await Vocabulary.findByIdAndUpdate(
                vocabId,
                { $addToSet: { likes: userId } }, // $addToSet ensures no duplicate userIds
                { new: true }
            );
        } else {
            // Remove userId from likes array
            updatedVocabulary = await Vocabulary.findByIdAndUpdate(
                vocabId,
                { $pull: { likes: userId } },
                { new: true }
            );
        }

        if (!updatedVocabulary) {
            throw new Error('Vocabulary not found');
        }

        return updatedVocabulary;
    } catch (error) {
        throw error;
    }
}

const updatePostComment = async (data) => { 
    const { vocabId, commentData } = data;
    try {
        let updatedVocabulary;
        if (commentData !== undefined) {
            updatedVocabulary = await Vocabulary.findByIdAndUpdate(
                vocabId,
                { $push: { comments: commentData } }, // $addToSet ensures no duplicate userIds
                { new: true }
            );
        } 
        if (!updatedVocabulary) {
            throw new Error('Vocabulary not found');
        }
        return updatedVocabulary;
    } catch (error) {
        throw error;
    }
}

const joinCommunity = async (data) => {
    const { id, userId, userName, profileUrl } = data;
    try {
        await Community.findByIdAndUpdate(
            id,
            { $push: { members: { userID: userId, userName: userName, profileUrl: profileUrl } } }, // push a single object with all properties
            { new: true, useFindAndModify: false } // additional option to ensure compatibility
        );
    } catch (err) {
        throw error;
    }
}

module.exports = { Router, updatePostLike, updatePostComment, joinCommunity }