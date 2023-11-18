import { Link } from "react-router-dom";
import styles from "./header.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faClose } from "@fortawesome/free-solid-svg-icons"
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/AuthContext";
import * as jwt from "jwt-decode";

export const Header = () => {

    const [isOpen, setIsOpen] = useState(false);

    const {isAuthenticated,logout,user} = useContext(UserContext);

    function toggleOpen() {
        setIsOpen(!isOpen);
    }
    
    function clickHandler(){
        if(!isOpen){
            return;
        }
        setIsOpen(false);
    }

    function onLogoutClick(){
        logout(),
        clickHandler();
    }

    return (
        <nav>
            <ul>
                <li className={styles["logo"]}>
                    <Link onClick={clickHandler} to={"/"}><img src="../../assets/homeImage/homeImage.png" /></Link>
                </li>
                <li className={styles["burger"]}>
                    <FontAwesomeIcon onClick={toggleOpen} icon={isOpen ? faClose : faList} />

                </li>
                <li className={`${styles.menu} ${isOpen ? styles['is-open'] : ''}`}>
                    <Link onClick={clickHandler} to={"/feed"} className={styles["menu-item"]}>Feed</Link>
                    {!isAuthenticated && <>
                    <Link onClick={clickHandler} to={"/login"} className={styles["menu-item"]}> Login</Link >
                    <Link onClick={clickHandler} to={"/register"} className={styles["menu-item"]} > Register</Link >
                    </>}
                    {isAuthenticated&&<>
                    <Link onClick={clickHandler} to={"/profile/"+jwt.jwtDecode(user).username} className={styles["menu-item"]} > Profile</Link >
                    <Link onClick={onLogoutClick} to="/feed" className={styles["menu-item"]} > Logout</Link >
                    </>}
                </li >
            </ul >
        </nav >
    )
}