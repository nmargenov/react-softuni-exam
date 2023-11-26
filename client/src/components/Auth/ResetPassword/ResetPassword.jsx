import styles from '../shared/styles.module.css';
import { SmallSpinner } from "../../spinners/SmallSpinner";
import { useForm } from "../../../hooks/useForm";
import { useEffect, useState } from "react";
import { resetPassword } from '../../../services/userService';
import { useLocation } from 'react-router';
import { NotFound } from '../../NotFound/NotFound';

export const ResetPassword = () => {
    const [invalidToken, setInvalidToken] = useState(false);


    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('t');
    useEffect(() => {
        if (!token || token.length < 1) {
            setInvalidToken(true);
        }
        document.title = "Reset Password";
    }, []);

    const [successMessage, setSuccessMessage] = useState('');

    const initialValues = {
        newPassword: '',
        reNewPassword: '',
    }

    const { values, setValues, onInputChange, onSubmitHandler, isLoading, setIsLoading, errorMsg, setErrorMsg } = useForm(initialValues)

    function onSubmit(e) {
        onSubmitHandler(e);
        setIsLoading(true);
        resetPassword(token,values.newPassword, values.reNewPassword)
            .then((data) => {
                setSuccessMessage(`Password updated successfully!`)
                setErrorMsg('');
                setIsLoading(false);
                setValues(initialValues);
            }).catch((err) => {
                setSuccessMessage('');
                setErrorMsg(err.message);
                setValues(initialValues);
                setIsLoading(false);
            })
    }
    return (
        <>
            {invalidToken && <NotFound/>}
            {!invalidToken && <div className={styles["main"]}>
                <div className={styles.container}>
                    <h1>Reset password</h1>
                    {errorMsg && (
                        <div className={styles.errorDiv}>
                            <span className={styles.errorMsg}>{errorMsg}</span>
                        </div>
                    )}
                    {successMessage && (
                        <div className={styles.successDiv}>
                            <span className={styles.successMsg}>{successMessage}</span>
                        </div>
                    )}
                    <form className={styles.form} onSubmit={onSubmit}>
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="New Password"
                            autoCapitalize="none"
                            required
                            minLength="6"
                            maxLength="20"
                            className={`${values.newPassword.length > 0 && values.newPassword.length < 6 ? styles.invalidField : ""}`}
                            value={values.newPassword}
                            onChange={onInputChange}
                            disabled={isLoading}
                        />
                        {values.newPassword.length > 0 && values.newPassword.length < 6 && (
                            <div className={styles.errorDiv}>
                                <small className={styles.errorMsg}>*Password must be at least 6 characters!</small>
                            </div>
                        )}
                        <input
                            type="password"
                            name="reNewPassword"
                            placeholder="Repeat New Password"
                            autoCapitalize="none"
                            required
                            minLength="6"
                            maxLength="20"
                            className={`${values.reNewPassword.length > 0 && values.reNewPassword.length < 6 ? styles.invalidField : ""}`}
                            value={values.reNewPassword}
                            onChange={onInputChange}
                            disabled={isLoading}
                        />
                        {values.reNewPassword.length > 0 && values.reNewPassword !== values.newPassword && (
                            <div className={styles.errorDiv}>
                                <small className={styles.errorMsg}>*Passwords do not match!</small>
                            </div>
                        )}
                        {!isLoading &&
                            <input
                                type="submit"
                                className={styles["submit-button"]}
                                value="Change Password"
                                disabled={
                                    values.newPassword.length < 6 ||
                                    values.newPassword !== values.reNewPassword
                                }
                            />
                        }
                        {isLoading &&
                            <div className={styles["loader"]}>
                                <SmallSpinner />
                            </div>
                        }
                    </form>
                </div>
            </div>}
        </>
    )
}