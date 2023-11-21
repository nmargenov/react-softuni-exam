import { createContext, useState } from "react";

export const DetailsContext = createContext();

export const DetailsProvider = ({
    children,
}) => {

    const [post,setPost] = useState(null);
    const [isPostLoading,setIsPostLoading] = useState(true);
    const [hasPostLoadingError,setHasPostLoadingError] = useState(false);
   
   
    const context = {
        post,
        setPost,
        isPostLoading,
        setIsPostLoading,
        hasPostLoadingError,
        setHasPostLoadingError,
    }

    return(
        <>
        <DetailsContext.Provider value={context}>
            {children}
        </DetailsContext.Provider>
        </>
    )
}