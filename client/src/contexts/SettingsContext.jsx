import { createContext, useState } from "react";

export const SettingsContext = createContext();

export const SettingsProvider = ({
    children,
}) => {

    const [isPublicSaving, setIsPublicSaving] = useState(false);
    const [isPrivateSaving, setIsPrivateSaving] = useState(false);
   
    const context = {
        isPublicSaving,
        setIsPublicSaving,
        isPrivateSaving,
        setIsPrivateSaving
    }

    return(
        <>
        <SettingsContext.Provider value={context}>
            {children}
        </SettingsContext.Provider>
        </>
    )
}