import { createContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import * as jwt from "jwt-decode";

export const UserContext = createContext();

export const AuthProvider = ({
    children,
}) => {
    const [user,setUser] =useLocalStorage('authToken',null);
    function setToken(value){
        setUser(value);
    }

    function logout(){
        setUser(null);
    }

    const context = {
        user,
        setToken,
        logout,
        setUser,
        isAuthenticated:!!user,
        decodedUser: user ? jwt.jwtDecode(user) : null
    }

    return(
        <>
        <UserContext.Provider value={context}>
            {children}
        </UserContext.Provider>
        </>
    )
}