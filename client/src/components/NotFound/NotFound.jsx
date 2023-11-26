import styles from './notFound.module.css';

export const NotFound = () => {
    return (
        <div id={styles["notfound"]}>
            <div className={styles["notfound"]}>
                <div className={styles["notfound-404"]}>
                    <h3>Oops! Page not found</h3>
                    <h1><span>4</span><span>0</span><span>4</span></h1>
                </div>
                <h2>we are sorry, but the page you requested was not found</h2>
            </div>
        </div>
    )
}