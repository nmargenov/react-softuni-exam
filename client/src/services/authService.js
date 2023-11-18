import { post } from "./requester";

const BASE_URL = 'http://localhost:5000/api/users';

export const login =(data)=>{
    return post(BASE_URL+'/login',data);
}

export const register = (data)=>{
    return post(BASE_URL+'/register',data);
}