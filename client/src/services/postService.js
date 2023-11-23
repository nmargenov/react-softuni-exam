import { BASE_URL } from "./BASE_URL";
import { del, get, patch, post } from "./requester";


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

export const getPostById = (postId)=>{
    const url = BASE_URL+paths.post.replace(':postId',postId);
    return get(url);
}

export const likePost = (postId,userId)=>{
    const url = BASE_URL+paths.like.replace(':postId',postId);
    return post(url,{userId});
}

export const deletePost =  (postId) =>{
    const url = BASE_URL+paths.post.replace(':postId',postId);
    return del(url);
}

export const editPost = (postId, formData)=>{
    const url = BASE_URL + paths.post.replace(':postId',postId);
    return patch(url,formData);
}

export const removeExistingImage = (postId) =>{
    const url = BASE_URL + paths.deleteExistingImage.replace(':postId',postId);
    return del(url);
}

export const writeComment = (postId,userId,comment) =>{
    const url = BASE_URL+paths.comment.replace(':postId',postId);
    return post(url,{userId,comment});
}