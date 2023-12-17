const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
import { del, get, patch, post } from "./requester";

const paths = {
    register: '/users/register',
    login: '/users/login',
    user: '/users/:username',
    follow: '/users/follow',
    publicData: '/users/publicData/:userId',
    removeExistingImage: '/users/image/:userId',
    privateData: '/users/privateData/:userId',
    password: '/users/password/:userId',
    search: "/users/search/:search",
    forgotPassword:"/users/forgotPassword",
    resetPassword:"/users/resetPassword",
}

export const getUser = (username) => {
    const url = BASE_URL + paths.user.replace(':username', username);
    return get(url);
}

export const follow = (userToFollow, userId) => {
    return post(BASE_URL + paths.follow, { userToFollow, userId });
}

export const editPublicData = (userId, formData) => {
    const url = BASE_URL + paths.publicData.replace(':userId', userId);
    return patch(url, formData);
}

export const removeExistingImage = (userId) => {
    const url = BASE_URL + paths.removeExistingImage.replace(':userId', userId);
    return del(url);
}

export const editPrivateData = (userId, email, birthdate) => {
    const url = BASE_URL + paths.privateData.replace(':userId', userId);
    return patch(url, { email, birthdate });
}


export const editPassword = (userId, oldPassword, newPassword, newRePassword) => {
    const url = BASE_URL + paths.password.replace(':userId', userId);
    return patch(url, { oldPassword, newPassword, newRePassword });
}

export const searchUsers = (search) =>{
    const url = BASE_URL+paths.search.replace(':search',search);
    return get(url);
}

export const forgotPassword = (username,email,birthdate)=>{
    const url = BASE_URL+paths.forgotPassword;
    return post(url,{username,email,birthdate});
}

export const resetPassword = (token,newPassword,reNewPassword)=>{
    const url = BASE_URL+paths.resetPassword;
    return post(url,{token,newPassword,reNewPassword});
}