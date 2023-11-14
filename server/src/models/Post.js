const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Description is required!'],
        minLength: [5, 'Description must be at least 5 characters long!'],
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Owner is required!'],
    },
    comments: [{
        createdAt: {
            type: Date,
            default: Date.now,
        },
        lastEditedAt: {
            type: Date,
            default: Date.now,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comment: {
            type: String,
            minLength: [2, 'Comment must at least 2 characters long!']
        }
    }],
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    image: {
        data: {
            type: Buffer,
        },
        contentType: {
            type: String,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastEditedAt: {
        type: Date,
        default: Date.now,
    },
});



const Post = mongoose.model('Post', postSchema);

module.exports = Post;