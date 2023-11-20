import { useContext } from "react"
import { UserContext } from "../../../contexts/AuthContext"
import styles from "./chooseFeed.module.css"

export const ChooseFeed = ({ isLoading, feed, setFeed, valueOne, valueTwo, stateOne, stateTwo, checkOwner, ownerId }) => {
    const { isAuthenticated,decodedUser } = useContext(UserContext);

    function changeState(state) {
        if (isLoading) {
            return;
        }
        setFeed(state)
    }
    return (
        <>
            <div className={styles["chooseFeed"]}>
                <a className={feed == stateOne ? styles['isActive'] : ""} onClick={() => changeState(stateOne)}>{valueOne}</a>
                {checkOwner ? isAuthenticated && decodedUser._id === ownerId && <a className={feed == stateTwo ? styles['isActive'] : ""} onClick={() => changeState(stateTwo)} >{valueTwo}</a> :
                   isAuthenticated && <a className={feed == stateTwo ? styles['isActive'] : ""} onClick={() => changeState(stateTwo)} >{valueTwo}</a>}
            </div >
        </>
    )
}