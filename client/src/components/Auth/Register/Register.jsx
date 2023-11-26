import React, { useContext, useEffect } from "react";
import styles from "../shared/styles.module.css";
import { register } from "../../../services/authService";
import { UserContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router";
import { SmallSpinner } from "../../spinners/SmallSpinner";
import { useForm } from "../../../hooks/useForm";
import { birthdateValidator, isValidEmail } from "../../../utils/fieldsUtil";


export const Register = () => {
    useEffect(()=>{
        document.title='Register';
    },[]);

    const initialValues = {
        username: "",
        password: "",
        rePassword: "",
        email: "",
        firstName: "",
        lastName: "",
        birthdate: "",
    };
    
    const { values, onInputChange, onSubmitHandler,isLoading,setIsLoading,errorMsg,setErrorMsg } = useForm(initialValues)

    const navigate = useNavigate();
    
    const { setToken } = useContext(UserContext);



    function onSubmit(e) {
       onSubmitHandler(e);
        setIsLoading(true);
        register(values)
            .then((data) => {
                setToken(data);
                setIsLoading(false);
                navigate("/feed");
            })
            .catch((err) => {
                setIsLoading(false);
                setErrorMsg(err.message);
            });
    }

    return (
        <div className={styles["main"]}>
            <div className={styles.container}>
                <h1>Register</h1>
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
                        autoCapitalize="none"
                        required
                        minLength="3"
                        maxLength="20"
                        className={`${values.username.length > 0 && values.username.length < 3 ? styles.invalidField : ""}`}
                        value={values.username}
                        onChange={onInputChange}
                        disabled={isLoading}
                    />
                    {values.username.length > 0 && values.username.length < 3 && (
                        <div className={styles.errorDiv}>
                            <small className={styles.errorMsg}>*Username must be at least 3 characters!</small>
                        </div>
                    )}
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        autoCapitalize="none"
                        required
                        minLength="6"
                        maxLength="20"
                        className={`${values.password.length > 0 && values.password.length < 6 ? styles.invalidField : ""}`}
                        value={values.password}
                        onChange={onInputChange}
                        disabled={isLoading}
                    />
                    {values.password.length > 0 && values.password.length < 6 && (
                        <div className={styles.errorDiv}>
                            <small className={styles.errorMsg}>*Password must be at least 6 characters!</small>
                        </div>
                    )}
                    <input
                        type="password"
                        name="rePassword"
                        autoCapitalize="none"
                        placeholder="Re-enter Password"
                        required
                        minLength="6"
                        maxLength="20"
                        className={`${values.rePassword.length > 0 && values.rePassword !== values.password ? styles.invalidField : ""}`}
                        value={values.rePassword}
                        onChange={onInputChange}
                        disabled={isLoading}
                    />
                    {values.rePassword.length > 0 && values.rePassword !== values.password && (
                        <div className={styles.errorDiv}>
                            <small className={styles.errorMsg}>*Passwords do not match!</small>
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
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        autoCapitalize="none"
                        required
                        maxLength="30"
                        className={`${values.firstName.length > 0 && values.firstName.length < 2 ? styles.invalidField : ""}`}
                        value={values.firstName}
                        onChange={onInputChange}
                        disabled={isLoading}
                    />
                    {values.firstName.length > 0 && values.firstName.length < 2 && (
                        <div className={styles.errorDiv}>
                            <small className={styles.errorMsg}>*First Name must be at least 2 characters!</small>
                        </div>
                    )}
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        autoCapitalize="none"
                        required
                        maxLength="30"
                        className={`${values.lastName.length > 0 && values.lastName.length < 2 ? styles.invalidField : ""}`}
                        value={values.lastName}
                        onChange={onInputChange}
                        disabled={isLoading}
                    />
                    {values.lastName.length > 0 && values.lastName.length < 2 && (
                        <div className={styles.errorDiv}>
                            <small className={styles.errorMsg}>*Last Name must be at least 2 characters!</small>
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
                    {!isLoading && (
                        <input
                            type="submit"
                            className={styles["submit-button"]}
                            value="Register"
                            disabled={
                                values.username.length < 3 ||
                                values.password.length < 6 ||
                                values.rePassword !== values.password ||
                                !isValidEmail(values.email) ||
                                values.firstName.length < 2 ||
                                values.lastName.length < 2 ||
                                birthdateValidator(values.birthdate)
                            }
                        />
                    )}
                    {isLoading && (
                        <div className={styles["loader"]}>
                            <SmallSpinner />
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
};

