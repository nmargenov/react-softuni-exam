import { createContext, useState } from "react";

export const DetailsContext = createContext();

export const DetailsProvider = ({
    children,
}) => {

    const [post,setPost] = useState(null);
    const [isPostLoading,setIsPostLoading] = useState(true);
    const [hasPostLoadingError,setHasPostLoadingError] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isPostImageLoading, setIsPostImageLoading] = useState(true);
    

   
   
    const context = {
        post,
        setPost,
        isPostLoading,
        setIsPostLoading,
        hasPostLoadingError,
        setHasPostLoadingError,
        isDeleting,
        setIsDeleting,
        isEditOpen,
        setIsEditOpen,
        isPostImageLoading,
        setIsPostImageLoading,
        isEditing,
        setIsEditing
    }

    return(
        <>
        <DetailsContext.Provider value={context}>
            {children}
        </DetailsContext.Provider>
        </>
    )
}