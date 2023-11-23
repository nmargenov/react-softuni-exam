import { useContext, useEffect, useState } from "react";
import { SettingsProvider } from "../../contexts/SettingsContext";
import { Password } from "./Password/Password";
import { PrivateInfo } from "./PrivateInfo/PrivateInfo";
import { PublicInfo } from "./PublicInfo/PublicInfo"
import styles from "./settings.module.css";
import { getUser } from "../../services/userService";
import { UserContext } from "../../contexts/AuthContext";
import { GlobalSpinner } from "../Spinners/GlobalSpinner/GlobalSpinner";
import { Error } from "../Error/Error";
export const Settings = () => {
    const [hasError, setHasError] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { decodedUser } = useContext(UserContext);

    useEffect(() => {
        document.title = 'Settings';
        getUser(decodedUser.username)
            .then((data) => {
                setUser(data);
                setHasError(false);
                setIsLoading(false);
            }).catch((err) => {
                setHasError(true);
                setIsLoading(false);
            })
    }, []);

    return (
        <>
            {isLoading &&
                <div className={styles['settings-spinner']}>
                    <GlobalSpinner />
                </div>}
            {!isLoading && hasError && <Error />}
            {!isLoading && !hasError && <div className={styles["main"]}>
                <SettingsProvider>
                    <PublicInfo userToEdit={user} setUserToEdit={setUser}/>
                    <PrivateInfo userToEdit={user} setUserToEdit={setUser}/>
                    <Password userToEdit={user} setUserToEdit={setUser}/>
                </SettingsProvider>
            </div>}
        </>
    )
}