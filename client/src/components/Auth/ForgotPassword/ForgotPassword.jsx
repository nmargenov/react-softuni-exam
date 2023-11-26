import styles from '../shared/styles.module.css';
import { SmallSpinner } from "../../spinners/SmallSpinner";
import { useForm } from "../../../hooks/useForm";
import { useEffect, useState } from "react";
import { birthdateValidator, isValidEmail } from "../../../utils/fieldsUtil";
import { forgotPassword } from '../../../services/userService';

export const ForgotPassword = () => {
    useEffect(() => {
        document.title = "Forgot Password";
    }, []);

    const [successMessage, setSuccessMessage] = useState('');

    const initialValues = {
        username: '',
        email: '',
        birthdate: ''
    }

    const { values, setValues, onInputChange, onSubmitHandler, isLoading, setIsLoading, errorMsg, setErrorMsg } = useForm(initialValues)

    function onSubmit(e) {
        onSubmitHandler(e);
        setIsLoading(true);
        forgotPassword(values.username, values.email, values.birthdate)
            .then((data) => {
                setSuccessMessage(`Email with instructions has been sent to ${values.email}. Please check spam folder!`)
                setErrorMsg('');
                setIsLoading(false);
                setValues(initialValues);
            }).catch((err) => {
                setSuccessMessage('');
                setErrorMsg(err.message);
                setIsLoading(false);
            })
    }
    return (
        <div className={styles["main"]}>
            <div className={styles.container}>
                <h1>Forgot password</h1>
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
                        type="text"
                        name="username"
                        placeholder="Username"
                        autoCapitalize="none"
                        required
                        minLength="3"
                        maxLength="20"
                        className={`${values.username.length > 0 && values.username.length < 3
                            ? styles.invalidField
                            : ''
                            }`}
                        value={values.username}
                        onChange={onInputChange}
                        disabled={isLoading}
                    />
                    {values.username.length > 0 && values.username.length < 3 && (
                        <div className={styles.errorDiv}>
                            <small className={styles.errorMsg}>
                                *Username must be at least 3 characters!
                            </small>
                        </div>
                    )}
                    <input
                        type="email"
                        name="email"
                        autoCapitalize="none"
                        placeholder="Email"
                        maxLength="50"
                        required
                        className={`${values.email.length > 0 && !isValidEmail(values.email) ? styles.invalidField : ""}`}
                        value={values.email}
                        onChange={onInputChange}
                        disabled={isLoading}
                    />
                    {values.email.length > 0 && !isValidEmail(values.email) && (
                        <div className={styles.errorDiv}>
                            <small className={styles.errorMsg}>*Invalid email address!</small>
                        </div>
                    )}
                    <input
                        type="date"
                        name="birthdate"
                        placeholder="Birth Date"
                        autoCapitalize="none"
                        required
                        className={`${birthdateValidator(values.birthdate) ? styles.invalidField : ""}`}
                        value={values.birthdate}
                        onChange={onInputChange}
                        disabled={isLoading}
                    />
                    {birthdateValidator(values.birthdate) && (
                        <div className={styles.errorDiv}>
                            <small className={styles.errorMsg}>*Invalid age!</small>
                        </div>
                    )}
                    {!isLoading &&
                        <input
                            type="submit"
                            className={styles["submit-button"]}
                            value="Send Email"
                            disabled={
                                values.username.length < 3 ||
                                !isValidEmail(values.email) ||
                                birthdateValidator(values.birthdate)
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
        </div>
    )
}