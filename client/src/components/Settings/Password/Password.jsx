import { useContext, useRef, useState } from 'react';
import { useForm } from '../../../hooks/useForm';
import styles from '../shared/styles.module.css';
import { UserContext } from '../../../contexts/AuthContext';
import { SettingsContext } from '../../../contexts/SettingsContext';
import { SmallSpinner } from '../../spinners/SmallSpinner';
import { editPassword } from '../../../services/userService';

export const Password = ({ userToEdit }) => {

    const { setUser } = useContext(UserContext);
    const { isPasswordSaving, setIsPasswordSaving, isPublicSaving, isPrivateSaving } = useContext(SettingsContext);
    const [successMsg, setSuccessMessage] = useState('');

    const formRef = useRef();

    const initialValues = {
        oldPassword: "",
        newPassword: "",
        reNewPassword: "",
    }

    const { values, setValues, onInputChange, onSubmitHandler, errorMsg, setErrorMsg } = useForm(initialValues);


    function onSubmit(e) {
        onSubmitHandler(e);

        setIsPasswordSaving(true);

        editPassword(userToEdit._id, values.oldPassword, values.newPassword, values.reNewPassword)
            .then((data) => {
                setUser(data);
                setErrorMsg('');
                setIsPasswordSaving(false);
                setSuccessMessage('Successfully updated the information!')
                setValues(initialValues);
            }).catch((err) => {
                setIsPasswordSaving(false)
                setValues(initialValues);
                setSuccessMessage('');
                setErrorMsg(err.message);
            });
    }

    const handleKeyDown = (e) => {
        if (values.oldPassword.length < 6 ||
            values.newPassword.length < 6 ||
            values.reNewPassword.length < 6) {
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
                    <h2>Password</h2>
                </div>
                <div className={styles["info"]}>
                    <div className={styles["single"]}>
                        <form onKeyDown={handleKeyDown} onSubmit={onSubmit} ref={formRef}>
                            {errorMsg && (
                                <div className={styles["errorDiv-first"]}>
                                    <p className={styles["errorMsg"]}>{errorMsg}</p>
                                </div>
                            )}
                            {successMsg && (
                                <div className={styles["errorDiv-first"]}>
                                    <p className={styles["successfullMsg"]}>{successMsg}</p>
                                </div>
                            )}
                            <div className={styles['field']}>
                                <p className={styles["first"]}>Old password</p>
                                <input
                                    disabled={isPrivateSaving || isPublicSaving || isPasswordSaving}
                                    value={values.oldPassword}
                                    autoComplete="off"
                                    type="password"
                                    name="oldPassword"
                                    placeholder="Old Password"
                                    required
                                    autoCapitalize='none'
                                    minLength="6"
                                    maxLength="20"
                                    onChange={onInputChange}
                                    className={`${values.oldPassword.length > 0 && values.oldPassword.length < 6 ? styles.invalidField : ""}`}

                                />
                            </div>
                            {values.oldPassword.length > 0 && values.oldPassword.length < 6 && (
                                <div className={styles.errorDiv}>
                                    <small className={styles.errorMsg}>*Password must be at least 6 characters!</small>
                                </div>
                            )}
                            <div className={styles['field']}>
                                <p className={styles["first"]}>New password</p>
                                <input
                                    disabled={isPrivateSaving || isPublicSaving || isPasswordSaving}
                                    value={values.newPassword}
                                    autoComplete="off"
                                    type="password"
                                    name="newPassword"
                                    placeholder="New Password"
                                    required
                                    autoCapitalize='none'
                                    minLength="6"
                                    maxLength="20"
                                    onChange={onInputChange}
                                    className={`${values.newPassword.length > 0 && values.newPassword.length < 6 ? styles.invalidField : ""}`}

                                />
                            </div>
                            {values.newPassword.length > 0 && values.newPassword.length < 6 && (
                                <div className={styles.errorDiv}>
                                    <small className={styles.errorMsg}>*Password must be at least 6 characters!</small>
                                </div>
                            )}
                            <div className={styles['field']}>
                                <p className={styles["first"]}>Repeat new password</p>
                                <input
                                    disabled={isPrivateSaving || isPublicSaving || isPasswordSaving}
                                    value={values.reNewPassword}
                                    autoComplete="off"
                                    type="password"
                                    name="reNewPassword"
                                    placeholder="Repeat New Password"
                                    required
                                    autoCapitalize='none'
                                    minLength="6"
                                    maxLength="20"
                                    onChange={onInputChange}
                                    className={`${values.reNewPassword.length > 0 && values.reNewPassword.length < 6 ? styles.invalidField : ""}`}

                                />
                            </div>
                            {values.reNewPassword.length > 0 && values.reNewPassword.length < 6 && (
                                <div className={styles.errorDiv}>
                                    <small className={styles.errorMsg}>*Password must be at least 6 characters!</small>
                                </div>
                            )}
                            {values.newPassword !== values.reNewPassword && (values.newPassword.length >= 6 && values.reNewPassword.length >= 6) && (
                                <div className={styles.errorDiv}>
                                    <small className={styles.errorMsg}>*Passwords do not match!</small>
                                </div>
                            )}
                        </form>
                    </div>

                </div>
                <div className={styles["button-div"]}>
                    {isPasswordSaving && (
                        <div className={styles['loader']} >
                            <SmallSpinner />
                        </div>)}
                    {!isPasswordSaving &&
                        <button onClick={() => formRef.current.requestSubmit()} className={styles["save"]}
                            disabled={
                                values.oldPassword.length < 6 ||
                                values.newPassword.length < 6 ||
                                values.newPassword !== values.reNewPassword ||
                                values.reNewPassword.length < 6
                                || isPublicSaving || isPrivateSaving || isPasswordSaving} >
                            Save changes
                        </button>}
                </div>
            </div >
        </div>
    );
};