const Post = require("../models/Post");
const User = require("../models/User");

const fs = require('fs');

exports.getAllPosts = async (userId) => {
    const posts = await Post.find().sort({ createdAt: -1 }).populate({
        path: 'owner',
        select: '-password'
    });
    if (!userId) {
        return posts;
    } else {
        const user = await User.findById(userId);
        const filteredPosts = posts.filter(p => user.following.includes(p.owner._id));
        return filteredPosts;
    }
};

exports.createPost = (description, owner, image) => {
    const date = Date.now();
    const post = {
        description,
        owner,
        createdAt: date,
        lastEditedAt: date
    };
    if (image) {
        post.image = {
            data: image,
            contentType: 'image/png'
        }
    }
    return Post.create(post);
};

exports.getPostById = (postId) => {
    return Post.findById(postId).populate({
        path: 'owner',
        select: '-password'
    }).populate({
        path: 'comments',
        populate: {
            path: 'owner',
            select: '-password'
        }
    });
};


exports.likePost = async (postId, userId) => {
    const post = await Post.findById(postId);

    if (checkIfLiked(post, userId)) {
        return Post.findByIdAndUpdate(postId, { $pull: { likedBy: userId } }, { runValidators: true, new: true })
            .populate({ path: 'owner', select: '-password' })
            .populate({ path: 'comments', populate: { path: 'owner', select: '-password' } });
    } else {
        return Post.findByIdAndUpdate(postId, { $push: { likedBy: userId } }, { new: true })
            .populate({ path: 'owner', select: '-password' })
            .populate({ path: 'comments', populate: { path: 'owner', select: '-password' } });
    }
};

exports.deletePostById = async (postId, loggedInUser) => {
    const post = await Post.findById(postId);

    if (post.owner._id.toString() != loggedInUser) {
        throw new Error('Unautorized');
    }

    if (post.image.data) {
        const path = post.image.data.toString().replace(/\\/g, '/');
        fs.unlinkSync(path);
    }

    return Post.findByIdAndDelete(postId);
};


exports.editPost = async (postId, description, photo, loggedInUser) => {

    const post = await Post.findById(postId);
    if (post.owner._id.toString() != loggedInUser) {
        throw new Error('Unautorized!');
    }
    const edit = {
        description,
        lastEditedAt: Date.now()
    }
    if (photo) {
        if (post.image.data) {
            const path = post.image.data.toString().replace(/\\/g, '/');
            fs.unlinkSync(path);
        }
        edit.image = {
            data: photo,
            contentType: 'image/png'
        };
    }
    return Post.findByIdAndUpdate(postId, edit, { runValidators: true, new: true })
        .populate({ path: 'owner', select: '-password' })
        .populate({ path: 'comments', populate: { path: 'owner', select: '-password' } });;
};

exports.deleteExistingImage = async (postId, loggedInUser) => {
    const post = await Post.findById(postId);
    if (post.owner._id.toString() != loggedInUser) {
        throw new Error("Unautorized!");
    }

    const edit = {
        lastEditedAt: Date.now()
    }

    if (post.image.data) {
        const path = post.image.data.toString().replace(/\\/g, '/');
        fs.unlinkSync(path);
    }

    edit.image = {};

    return Post.findByIdAndUpdate(postId, edit, { runValidators: true, new: true })
        .populate({ path: 'owner', select: '-password' })
        .populate({ path: 'comments', populate: { path: 'owner', select: '-password' } });;
}

exports.writeComment = (postId, userId, comment) => {
    return Post.findByIdAndUpdate(postId, { $push: { comments: { owner: userId, comment } } }, { runValidators: true, new: true })
        .populate({ path: 'owner', select: '-password' })
        .populate({ path: 'comments', populate: { path: 'owner', select: '-password' } });
}

exports.deleteComment = async (postId, commentId, loggedInUser) => {
    const post = await Post.findById(postId).populate({ path: 'comments', populate: { path: 'owner' } });
    const filteredPost = post.comments.filter(p => p._id.toString() == commentId);

    if (filteredPost.length==0 || filteredPost[0].owner._id.toString() != loggedInUser) {
        throw new Error("Unautorized!");
    }

    return Post.findByIdAndUpdate(postId, { $pull: { comments: { _id: commentId } } }, { runValidators: true, new: true })
        .populate({ path: 'owner', select: '-password' })
        .populate({ path: 'comments', populate: { path: 'owner', select: '-password' } });
}

exports.editComment = async (postId, commentId, comment, loggedInUser) => {
    const post = await Post.findById(postId).populate({ path: 'comments', populate: { path: 'owner' } });
    const filteredPost = post.comments.filter(p => p._id.toString() == commentId);

    if (filteredPost.length==0  || filteredPost[0].owner._id.toString() != loggedInUser) {
        throw new Error("Unautorized!");
    }
    filteredPost[0].comment = comment.trim();
    filteredPost[0].lastEditedAt = Date.now();

    const updatedPost = await post.save();

    const populatedPost = await Post.findById(updatedPost._id)
        .populate({ path: 'owner', select: '-password' })
        .populate({ path: 'comments', populate: { path: 'owner', select: '-password' } });

    return populatedPost;
}

exports.getLikedPostsByUser = async(userId)=>{
    const posts = await Post.find().sort({ createdAt: -1 }).populate({
        path: 'owner',
        select: '-password'
    });

    const filteredPosts = posts.filter(p=>p.likedBy.map(id=>id.toString()).includes(userId));
    return filteredPosts;
}

function checkIfLiked(post, userId) {
    return post.likedBy.map(p => p.toString()).includes(userId);
};