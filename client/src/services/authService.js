const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
import { post } from "./requester";

export const login =(data)=>{
    return post(BASE_URL+'/users/login',data);
}

export const register = (data)=>{
    return post(BASE_URL+'/users/register',data);
}