import { PublicInfo } from "./PublicInfo/PublicInfo"
import styles from "./settings.module.css";
export const Settings = () =>{
    return(
        <div className={styles["main"]}>
            <PublicInfo/>
        </div>
    )
}