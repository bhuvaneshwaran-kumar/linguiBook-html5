const mongoose = require('mongoose')

const { model, Schema } = mongoose

const communitySchema = new Schema(
    {
        name: String,
        description: String,
        members: {
            type: [{
                userID: String,
                userName: String,
                profileUrl: String
            }],
            default: []
        },
        adminId: String,
        adminName: String,
        profileUrl: String,
        adminProfileUrl: String
    }
)

const Vocabulary = model("communities", communitySchema)

module.exports = Vocabulary