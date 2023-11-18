import { get, post } from "./requester";

const BASE_URL = 'http://localhost:5000/api/users';

export const getUser = (username) => {
    return get(BASE_URL + "/" + username);
}

export const follow = (userToFollow, userId)=>{
    return post(BASE_URL + "/follow", { userToFollow, userId });
}