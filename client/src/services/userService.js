import { del, get, patch, post } from "./requester";

const BASE_URL = 'http://localhost:5000/api';

const paths = {
    register: '/users/register',
    login: '/users/login',
    user: '/users/:username',
    follow: '/users/follow',
    publicData: '/users/publicData/:userId',
    removeExistingImage: '/users/image/:userId',
    privateData: '/users/privateData/:userId',
    password: '/users/password/:userId',
}

export const getUser = (username) => {
    const url = BASE_URL + paths.user.replace(':username',username);
    return get(url);
}

export const follow = (userToFollow, userId) => {
    return post(BASE_URL + paths.follow, { userToFollow, userId });
}

export const editPublicData = (userId, formData) => {
    const url = BASE_URL + paths.publicData.replace(':userId', userId);
    return patch(url, formData);
}

export const removeExistingImage = (userId) =>{
    const url = BASE_URL + paths.removeExistingImage.replace(':userId', userId);
    return del(url);
}

export const editPrivateData=(userId,email,birthdate)=>{
    const url = BASE_URL + paths.privateData.replace(':userId', userId);
    return patch(url,{email,birthdate});
  }