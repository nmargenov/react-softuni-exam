import { Link } from "react-router-dom";
import styles from "./header.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faClose } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react";

export const Header = () => {

    const [isOpen, setIsOpen] = useState(false);

    function toggleOpen() {
        setIsOpen(!isOpen);
    }
    
    function clickHandler(){
        if(!isOpen){
            return;
        }
        setIsOpen(false);
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
                    <Link onClick={clickHandler} to={"/login"} className={styles["menu-item"]}> Login</Link >
                    <Link onClick={clickHandler} to={"/register"} className={styles["menu-item"]} > Register</Link >
                    <Link onClick={clickHandler} to={"/profile"} className={styles["menu-item"]} > Profile</Link >
                    <Link onClick={clickHandler} to={"/logout"} className={styles["menu-item"]} > Logout</Link >
                </li >
            </ul >
        </nav >
    )
}