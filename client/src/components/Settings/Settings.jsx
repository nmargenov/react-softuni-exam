import { SettingsProvider } from "../../contexts/SettingsContext";
import { PrivateInfo } from "./PrivateInfo/PrivateInfo";
import { PublicInfo } from "./PublicInfo/PublicInfo"
import styles from "./settings.module.css";
export const Settings = () => {
    return (
        <div className={styles["main"]}>
            <SettingsProvider>
                <PublicInfo />
                <PrivateInfo />
            </SettingsProvider>
        </div>
    )
}