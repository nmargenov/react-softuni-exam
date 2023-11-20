import { useState } from "react"

export const useForm = (initialValues) => {
    const [values, setValues] = useState(initialValues);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    function onInputChange(e){
        setValues(state=>({...state,[e.target.name]:e.target.value}));
    } 

    function onSubmitHandler(e){
        e.preventDefault();
    }

    return{
        values,
        setValues,
        onInputChange,
        onSubmitHandler,
        isLoading,
        setIsLoading,
        errorMsg,
        setErrorMsg
    }
}