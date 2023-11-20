import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './error.module.css';
import { faFaceFrown } from '@fortawesome/free-solid-svg-icons';

export const Error = () => {
    return (
        <div className={styles['main-error-container']}>
            <h1 className={styles['woops']}>Woops!</h1>
            <h1>Something went wrong <FontAwesomeIcon icon={faFaceFrown}/> </h1>
            <h3>Please try again</h3>
        </div>
    );
}