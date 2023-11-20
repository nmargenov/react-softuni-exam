import { get, post } from "./requester";

const BASE_URL = "http://localhost:5000/api";

const paths = {
    posts: '/posts',
    followingPosts: '/posts/following',
    post: '/posts/:postId',
    like: '/posts/like/:postId',
    deleteExistingImage: '/posts/deleteImage/:postId',
    comment: '/posts/comment/:postId',
    commentWithId: '/posts/comment/:postId/:commentId',
    likedPosts: '/posts/liked/:userId',
};


export const createPost = (formData) => {
    return post(BASE_URL + paths.posts, formData);
}

export const getAllPosts = () =>{
    return get(BASE_URL+paths.posts);
}

export const getFollowingPosts = () =>{
    return get(BASE_URL+paths.followingPosts);
}

