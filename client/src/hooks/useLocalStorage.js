import { useState } from "react"

export const useLocalStorage = (key,initialValue)=>{
    const [state,setState]=useState(()=>{
        const persistedState = localStorage.getItem(key);
        if(persistedState){
            return persistedState;
        }
        return initialValue;
    });

    const setLocalStorageState = (value)=>{
        if(value){
            setState(value);
            localStorage.setItem(key,value);
        }else{
            setState(null);
            localStorage.removeItem(key);
        }
    };

    return [
        state,
        setLocalStorageState
    ]
}