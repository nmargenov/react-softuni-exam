import { useContext } from "react"
import { UserContext } from "../../../contexts/AuthContext"
import styles from "./chooseFeed.module.css"

export const ChooseFeed = ({ isLoading, feed, setFeed }) => {
    const {isAuthenticated} = useContext(UserContext);

    function changeState(state) {
        if(isLoading){
            return;
        }
        setFeed(state)
    }
    return (
        <>
            <div className={styles["chooseFeed"]}>
                <a className={feed == 'explore' ? styles['isActive'] : ""} onClick={() => changeState('explore')}>explore</a>
                {isAuthenticated && <a className={feed == "following" ? styles['isActive'] : ""} onClick={() => changeState('following')} >following</a>}
            </div >
        </>
    )
}