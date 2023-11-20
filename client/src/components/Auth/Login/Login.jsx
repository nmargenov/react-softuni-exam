import { useContext, useEffect } from "react";
import styles from "../shared/styles.module.css";
import { login } from "../../../services/authService";
import { UserContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router";
import { SmallSpinner } from "../../spinners/SmallSpinner";
import { useForm } from "../../../hooks/useForm";

export const Login = () => {
    useEffect(()=>{
        document.title="Login";
    },[])

    const initialValues={
        username: '',
        password: '',
    }

    const { values, onInputChange, onSubmitHandler,isLoading,setIsLoading,errorMsg,setErrorMsg } = useForm(initialValues)


    const navigate = useNavigate();

    const { setToken } = useContext(UserContext);

    function onSubmit(e) {
        onSubmitHandler(e);
        setIsLoading(true);
        login(values)
            .then((data)=>{
                setToken(data);
                setIsLoading(false);
                navigate('/feed');
            }).catch((err)=>{
                setIsLoading(false);
                setErrorMsg(err.message);
            })
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
                        disabled={isLoading}

                    />
                    {values.password.length > 0 && values.password.length < 6 && (
                        <div className={styles.errorDiv}>
                            <small className={styles.errorMsg}>
                                *Password must be at least 6 characters!
                            </small>
                        </div>
                    )}
                    {!isLoading &&
                        <input
                            type="submit"
                            className={styles["submit-button"]}
                            value="Login"
                            disabled={values.username.length < 3 || values.password.length < 6 || isLoading}
                        />}
                    {isLoading &&
                        <div className={styles["loader"]}>
                            <SmallSpinner />
                        </div>
                        }
                </form>
            </div>
        </div>
    )
};

