import { BASE_URL } from "./BASE_URL";
import { get, post } from "./requester";


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

export const getLikedPosts =(userId) =>{
    const url = BASE_URL+ paths.likedPosts.replace(':userId',userId);
    return get(url);
}