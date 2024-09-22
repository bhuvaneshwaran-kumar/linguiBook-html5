const mongoose = require('mongoose')

const { model, Schema } = mongoose

const postSchema = new Schema(
    {
        heading: String,
        content: String,
        communityId: String,
        likes: {
            type: [String],
            default: [],
        },
        comments: {
            type: [{
                userID: String,
                userName: String,
                comment: String,
                profileUrl: String
            }],
            default: []
        }
    }
)

const Post = model("posts", postSchema)

module.exports = Post