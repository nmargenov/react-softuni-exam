import styles from "./footer.module.css";

export const Footer = () => {
    return (
        <div className={styles["footer"]}>
            <ul className={styles["social-icons"]}>
                <li>
                    <a href="https://facebook.com"><img src="/assets/icons/facebook-icon.png" alt="Facebook" /></a>
                </li>
                <li>
                    <a href="https://twitter.com"><img src="/assets/icons/twitter-icon.png" alt="Twitter" /></a>
                </li>
                <li>
                    <a href="https://instagram.com"><img src="/assets/icons/instagram-icon.png" alt="Instagram" /></a>
                </li>
                <li>
                    <a href="https://linkedin.com"><img src="/assets/icons/linkedin-icon.png" alt="Linkedin" /></a>
                </li>
            </ul>
            <p>Softuni reactJS december 2023 project.</p>
            <p>&copy; 2023 Nikolay Margenov. All rights reserved.</p>
        </div>
    )
}