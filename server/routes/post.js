const express = require('express')
const Post = require('../models/Post')
const Router = express.Router()
const { isAuthenticated } = require('../utils/tokens')
const { getPostsAggregate } = require('../utils/aggregate')

Router.post('/create', isAuthenticated, async (req, res) => {
    try {
        const { heading, content, communityId } = req.body;

        const post = new Post({
            heading, content, communityId 
        })
        const savedPost = await post.save();
        return res.status(200).json({
            ok: true,
            data: { savedPost }
        })
    } catch (Err) { 
        return res.status(400).json({
            ok: false,
            data: { ok: "fail" }
        })
    }
})

Router.post('/gp', isAuthenticated, async (req, res) => {
    try {
        const { user } = req;
        const { communityId } = req.body
        const posts = await Post.aggregate(getPostsAggregate(communityId, 0, 1000, user._id));

        return res.status(200).json({
            ok: true,
            posts
        })
    } catch (Err) { 
        return res.status(400).json({
            ok: false,
            data: { ok: "fail" }
        })
    }
})


const updatePostLike = async (data) => { 
    const { isLiked, postId, userId } = data;

    try {
        let updatedVocabulary;

        if (isLiked) {
            // Add userId to likes array if not already present
            updatedVocabulary = await Post.findByIdAndUpdate(
                postId,
                { $addToSet: { likes: userId } }, // $addToSet ensures no duplicate userIds
                { new: true }
            );
        } else {
            // Remove userId from likes array
            updatedVocabulary = await Post.findByIdAndUpdate(
                postId,
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

module.exports = { Router, updatePostLike, updatePostComment }