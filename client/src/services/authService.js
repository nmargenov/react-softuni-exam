import { BASE_URL } from "./BASE_URL";
import { post } from "./requester";

export const login =(data)=>{
    return post(BASE_URL+'/users/login',data);
}

export const register = (data)=>{
    return post(BASE_URL+'/users/register',data);
}