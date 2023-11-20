import { SettingsProvider } from "../../contexts/SettingsContext";
import { Password } from "./Password/Password";
import { PrivateInfo } from "./PrivateInfo/PrivateInfo";
import { PublicInfo } from "./PublicInfo/PublicInfo"
import styles from "./settings.module.css";
export const Settings = () => {
    return (
        <div className={styles["main"]}>
            <SettingsProvider>
                <PublicInfo />
                <PrivateInfo />
                <Password/>
            </SettingsProvider>
        </div>
    )
}