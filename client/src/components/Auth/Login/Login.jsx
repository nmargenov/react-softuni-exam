import { useState } from "react";
import styles from "./login.module.css";

export const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [values, setValues] = useState({
        username: '',
        password: '',
    });

    function onInputChange(e){
        setValues(oldState=>({...oldState,[e.target.name]:e.target.value}));
    }

    function onSubmit(e) {
        e.preventDefault();
        console.log(values);
    }
    return (
        <div className={styles["main"]}>
            <div className={styles.container}>
                <h1>Login</h1>
                {errorMsg && (
                    <div className={styles.errorDiv}>
                        <span className={styles.errorMsg}>{errorMsg}</span>
                    </div>
                )}
                <form className={styles.form} onSubmit={onSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        required
                        minLength="3"
                        maxLength="20"
                        className={`${values.username.length > 0 && values.username.length < 3
                            ? styles.invalidField
                            : ''
                            }`}
                        value={values.username}
                        onChange={onInputChange}
                    />
                    {values.username.length > 0 && values.username.length < 3 && (
                        <div className={styles.errorDiv}>
                            <small className={styles.errorMsg}>
                                *Username must be at least 3 characters!
                            </small>
                        </div>
                    )}
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        minLength="6"
                        className={`${values.password.length > 0 && values.password.length < 6
                            ? styles.invalidField
                            : ''
                            }`}
                        value={values.password}
                        onChange={onInputChange}
                    />
                    {values.password.length > 0 && values.password.length < 6 && (
                        <div className={styles.errorDiv}>
                            <small className={styles.errorMsg}>
                                *Password must be at least 6 characters!
                            </small>
                        </div>
                    )}
                    <input
                        type="submit"
                        className={styles["submit-button"]}
                        value="Login"
                        disabled={values.username.length < 3 || values.password.length < 6}
                    />
                </form>
            </div>
        </div>
    )
};

