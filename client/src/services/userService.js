import { get } from "./requester";

const BASE_URL = 'http://localhost:5000/api/users';

export const getUser= (username) =>{
    return get(BASE_URL+"/"+username);
}