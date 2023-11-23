import { useState, useContext, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { decodeBuffer } from '../../../utils/imageHelper';
import { UserContext } from '../../../contexts/AuthContext';
import { SettingsContext } from '../../../contexts/SettingsContext';
import styles from "../shared/styles.module.css";
import { useForm } from '../../../hooks/useForm';
import { editPublicData, removeExistingImage } from '../../../services/userService';
import { SmallSpinner } from '../../spinners/SmallSpinner';
import * as jwt from 'jwt-decode';

export const PublicInfo = ({userToEdit,setUserToEdit}) => {
    const { setUser } = useContext(UserContext);
    const { isPasswordSaving, isPrivateSaving, isPublicSaving, setIsPublicSaving } = useContext(SettingsContext);
    const [previewUrl, setPreviewUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const initialValues = {
        username: userToEdit.username,
        firstName: userToEdit.firstName,
        lastName: userToEdit.lastName,
        bio: userToEdit.bio,
        profilePicture: userToEdit.profilePicture
    }

    const { values, onInputChange, onSubmitHandler, errorMsg, setErrorMsg } = useForm(initialValues);


    const formRef = useRef(null);
    const fileInputRef = useRef(null);

    function onFileInputChange(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        setSelectedFile(file);
        reader.onload = () => {
            setPreviewUrl(reader.result)
        };
        reader.readAsDataURL(file);
    }

    function onClearPreview() {
        setPreviewUrl('');
        setSelectedFile(null);
    }

    function onRemoveExistingImage() {
        setIsPublicSaving(true);
        removeExistingImage(userToEdit._id)
            .then((data) => {
                setErrorMsg('');
                setUser(data);
                setUserToEdit(jwt.jwtDecode(data));
                setIsPublicSaving(false);
            }).catch((err) => {
                setIsPublicSaving(false);
                setErrorMsg(err.message);
            })
    }
    function onSubmit(e) {
        onSubmitHandler(e);

        const formData = new FormData();
        formData.append('username', values.username);
        formData.append('firstName', values.firstName);
        formData.append('lastName', values.lastName);
        formData.append('bio', values.bio);
        formData.append('profilePicture', selectedFile);

        setIsPublicSaving(true);

        editPublicData(userToEdit._id, formData)
            .then((data) => {
                setUser(data);
                setUserToEdit(jwt.jwtDecode(data));
                setPreviewUrl(false);
                setSelectedFile(null);
                setErrorMsg('');
                setIsPublicSaving(false);
            }).catch((err) => {
                setPreviewUrl(false);
                setSelectedFile(null);
                setIsPublicSaving(false);
                setErrorMsg(err.message);
            })
    }

    const handleKeyDown = (e) => {
        if (values.username.length < 3 || values.firstName.length < 2 || values.lastName.length < 2) {
            return;
        }
        if (e.key === 'Enter') {
            onSubmit(e);
        }
    };

    function hasProfilePicture(data) {
        const url = decodeBuffer(data);
        const normalizedPath = url.replace(/\\/g, '/');
        const parts = normalizedPath.split("/");
        const filename = parts[parts.length - 1];
        return filename !== 'defaultUser.png';
    }

    return (
        <div className={styles["container"]}>
            <div className={styles["public-info"]}>
                <div className={styles["title"]}>
                    <h2>Public info</h2>
                </div>
                <div className={styles["info"]}>
                    <div className={styles["left-info"]}>
                        <form onKeyDown={handleKeyDown} ref={formRef} onSubmit={onSubmit}>
                            {errorMsg && (
                                <div className={styles["errorDiv-first"]}>
                                    <p className={styles["errorMsg"]}>{errorMsg}</p>
                                </div>
                            )}
                            <div className={styles['field']}>
                                <p className={styles["first"]}>Username</p>
                                <input
                                    disabled={isPublicSaving || isPrivateSaving || isPasswordSaving}
                                    value={values.username}
                                    autoComplete="off"
                                    type="text"
                                    autoCapitalize="none"
                                    name="username"
                                    placeholder="Username"
                                    required
                                    minLength="3"
                                    maxLength="20"
                                    onChange={onInputChange}
                                    className={`${values.username.length > 0 && values.username.length < 3
                                        ? styles.invalidField
                                        : ''
                                        }`}
                                />
                            </div>
                            {values.username.length > 0 && values.username.length < 3 && (
                                <div className={styles["errorDiv"]}>
                                    <small className={styles["errorMsg"]}>*Username must be at least 3 characters!</small>
                                </div>
                            )}
                            <div className={styles['field']}>
                                <p>First Name</p>
                                <input
                                    disabled={isPublicSaving || isPrivateSaving || isPasswordSaving}
                                    value={values.firstName}
                                    autoComplete="off"
                                    autoCapitalize="none"
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    required
                                    minLength="2"
                                    maxLength="30"
                                    onChange={onInputChange}
                                    className={`${values.firstName.length > 0 && values.firstName.length < 2
                                        ? styles.invalidField
                                        : ''
                                        }`}
                                />
                            </div>
                            {values.firstName.length > 0 && values.firstName.length < 2 && (
                                <div className={styles["errorDiv"]}>
                                    <small className={styles["errorMsg"]}>*First Name must be at least 2 characters!</small>
                                </div>)}
                            <div className={styles['field']}>
                                <p>Last Name</p>
                                <input
                                    disabled={isPublicSaving || isPrivateSaving || isPasswordSaving}
                                    value={values.lastName}
                                    autoComplete="off"
                                    type="text"
                                    name="lastName"
                                    autoCapitalize="none"
                                    placeholder="Last Name"
                                    required
                                    minLength="2"
                                    maxLength="30"
                                    onChange={onInputChange}
                                    className={`${values.lastName.length > 0 && values.lastName.length < 2
                                        ? styles.invalidField
                                        : ''
                                        }`}
                                />
                            </div>
                            {values.lastName.length > 0 && values.lastName.length < 2 && (
                                <div className={styles["errorDiv"]}>
                                    <small className={styles["errorMsg"]}>*Last Name must be at least 2 characters!</small>
                                </div>)}
                            <div className={styles['field']}>
                                <p>Biography</p>
                                <textarea
                                    value={values.bio}
                                    disabled={isPublicSaving || isPrivateSaving || isPasswordSaving}
                                    autoComplete="off"
                                    type="text"
                                    autoCapitalize="none"
                                    name="bio"
                                    placeholder="Biography"
                                    maxLength="100"
                                    onChange={onInputChange}
                                >
                                </textarea>
                            </div>

                        </form>
                    </div>
                    <div className={styles["right-info"]}>
                        <div className={styles["image-div"]}>
                            {previewUrl && <img src={previewUrl} alt="Preview" />}
                            {!previewUrl && (
                                <>
                                    <img

                                        src={decodeBuffer(userToEdit.profilePicture)}

                                        alt="pic"
                                    />
                                </>)}
                        </div>
                        <div className={styles["upload-div"]}>
                            <input
                                disabled={isPublicSaving || isPrivateSaving || isPasswordSaving}
                                type="file"
                                name='profilePicture'
                                ref={fileInputRef}
                                accept="image/*"
                                id="file-input"
                                onChange={onFileInputChange}
                            />
                            {!previewUrl && !isPublicSaving && !isPrivateSaving && !isPasswordSaving && <FontAwesomeIcon className={styles['icon']} icon={faUpload} onClick={() => fileInputRef.current.click()} />}
                            {previewUrl && !isPublicSaving && !isPrivateSaving && !isPasswordSaving && <FontAwesomeIcon className={styles['cancel-icon']} disabled={isPublicSaving || isPasswordSaving || isPrivateSaving} onClick={onClearPreview} icon={faTimesCircle} />}
                            {hasProfilePicture(userToEdit.profilePicture) && !previewUrl && !isPublicSaving && !isPrivateSaving && !isPasswordSaving && <button disabled={isPublicSaving || isPrivateSaving || isPasswordSaving} onClick={onRemoveExistingImage} className={styles["remove-existing-image"]}>
                                Remove existing image
                            </button>}
                        </div>
                    </div>
                </div>
                <div className={styles["button-div"]}>
                    {isPublicSaving && (
                        <div className={styles['loader']} >
                            <SmallSpinner />
                        </div>)}
                    {!isPublicSaving &&
                        <button onClick={() => formRef.current.requestSubmit()} className={styles["save"]}
                            disabled={values.username.length < 3 || values.firstName < 2
                                || values.lastName < 2 || isPublicSaving || isPrivateSaving || isPasswordSaving} >
                            Save changes
                        </button>}
                </div>
            </div>
        </div >
    );
};