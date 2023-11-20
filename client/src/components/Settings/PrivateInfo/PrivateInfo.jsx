import { useContext, useRef } from 'react';
import { useForm } from '../../../hooks/useForm';
import styles from '../shared/styles.module.css';
import { UserContext } from '../../../contexts/AuthContext';
import { SettingsContext } from '../../../contexts/SettingsContext';
import { SmallSpinner } from '../../spinners/SmallSpinner';
import { editPrivateData } from '../../../services/userService';

export const PrivateInfo = () => {

    const { setUser, decodedUser } = useContext(UserContext);
    const { isPasswordSaving, isPublicSaving, isPrivateSaving, setIsPrivateSaving } = useContext(SettingsContext);

    const formRef = useRef();

    const { values, onInputChange, onSubmitHandler, errorMsg, setErrorMsg } = useForm({
        email: decodedUser.email,
        birthdate: decodedUser.birthdate,
    });

    const emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;

    function isValidEmail(email) {
        return emailRegex.test(email);
    }

    function birthdateValidator(birthdate) {
        if (!birthdate) {
            return false;
        }
        const year = String(birthdate).split('-')[0];
        return !(Number(year) >= 1900 && Number(year) <= 2023);
    }

    function onSubmit(e) {
        onSubmitHandler(e);

        setIsPrivateSaving(true);

        editPrivateData(decodedUser._id, values.email, values.birthdate)
            .then((data) => {
                setUser(data);
                setErrorMsg('');
                setIsPrivateSaving(false);
            }).catch((err) => {
                setIsPrivateSaving(false)
                setErrorMsg(err.message);
            });
    }

    const handleKeyDown = (e) => {
        if (!isValidEmail(values.email) || birthdateValidator(values.birthdate)) {
            return;
        }
        if (e.key === 'Enter') {
            onSubmit(e);
        }
    };


    return (
        <div className={styles["container"]}>
            <div className={styles["single-info"]}>
                <div className={styles["title"]}>
                    <h2>Private info</h2>
                </div>
                <div className={styles["info"]}>
                    <div className={styles["single"]}>
                        <form onKeyDown={handleKeyDown} onSubmit={onSubmit} ref={formRef}>
                            {errorMsg && (
                                <div className={styles["errorDiv-first"]}>
                                    <p className={styles["errorMsg"]}>{errorMsg}</p>
                                </div>
                            )}
                            <div className={styles['field']}>
                            <p className={styles["first"]}>Email</p>
                                <input
                                    disabled={isPrivateSaving || isPublicSaving || isPasswordSaving}
                                    value={values.email}
                                    autoComplete="off"
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    required
                                    minLength="3"
                                    maxLength="50"
                                    onChange={onInputChange}
                                    className={`${values.email.length > 0 && !isValidEmail(values.email) ? styles.invalidField : ""}`}

                                />
                            </div>
                            {values.email.length > 0 && !isValidEmail(values.email) && (
                                <div className={styles.errorDiv}>
                                    <small className={styles.errorMsg}>*Invalid email address!</small>
                                </div>
                            )}
                            <div className={styles['field']}>
                                <p>Birthdate</p>
                                <input
                                    disabled={isPrivateSaving || isPublicSaving || isPasswordSaving}
                                    value={values.birthdate}
                                    autoComplete="off"
                                    type="date"
                                    name="birthdate"
                                    placeholder="Birth Date"
                                    required
                                    onChange={onInputChange}
                                    className={`${birthdateValidator(values.birthdate) ? styles.invalidField : ""}`}

                                />
                            </div>
                            {birthdateValidator(values.birthdate) && (
                                <div className={styles.errorDiv}>
                                    <small className={styles.errorMsg}>*Invalid age!</small>
                                </div>
                            )}
                        </form>
                    </div>

                </div>
                <div className={styles["button-div"]}>
                    {isPrivateSaving && (
                        <div className={styles['loader']} >
                            <SmallSpinner />
                        </div>)}
                    {!isPrivateSaving &&
                        <button onClick={() => formRef.current.requestSubmit()} className={styles["save"]}
                            disabled={!isValidEmail(values.email) || birthdateValidator(values.birthdate)
                                || isPublicSaving || isPrivateSaving ||isPasswordSaving} >
                            Save changes
                        </button>}
                </div>
            </div >
        </div>
    );
};