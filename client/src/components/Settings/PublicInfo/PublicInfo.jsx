import { useState, useEffect, useContext, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { decodeBuffer } from '../../../utils/imageHelper';
import { UserContext } from '../../../contexts/AuthContext';
import styles from "../shared/styles.module.css";
import { useForm } from '../../../hooks/useForm';
import { editPublicData, removeExistingImage } from '../../../services/userService';
import { SmallSpinner } from '../../spinners/SmallSpinner';

export const PublicInfo = () => {
    const navigate = useNavigate();
    const { setUser, decodedUser } = useContext(UserContext);
    const [previewUrl, setPreviewUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const { values, onInputChange, onSubmitHandler, isLoading, setIsLoading, errorMsg, setErrorMsg } = useForm({
        username: decodedUser.username,
        firstName: decodedUser.firstName,
        lastName: decodedUser.lastName,
        bio: decodedUser.bio,
        profilePicture: decodedUser.profilePicture
    });
    

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
        setIsLoading(true);
        removeExistingImage(decodedUser._id)
            .then((data) => {
                setIsLoading(false);
                setUser(data);
            }).catch((err) => {
                setIsLoading(false);
                console.log(err);
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

        setIsLoading(true);

        editPublicData(decodedUser._id, formData)
            .then((data) => {
                setUser(data);
                setPreviewUrl(false);
                setSelectedFile(null);
                setIsLoading(false);
            }).catch((err) => {
                setPreviewUrl(false);
                setSelectedFile(null);
                setIsLoading(false);
                console.log(err);
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
                                <div className={styles["errorDiv"]}>
                                    <p className={styles["errorMsg first"]}>{errorMsg}</p>
                                </div>
                            )}
                            <div className={styles['field']}>
                                <p className={styles["first"]}>Username</p>
                                <input
                                    disabled={isLoading}
                                    value={values.username}
                                    autoComplete="off"
                                    type="text"
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
                                    disabled={isLoading}
                                    value={values.firstName}
                                    autoComplete="off"
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
                                    disabled={isLoading}
                                    value={values.lastName}
                                    autoComplete="off"
                                    type="text"
                                    name="lastName"
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
                                    disabled={isLoading}
                                    autoComplete="off"
                                    type="text"
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

                                        src={decodeBuffer(decodedUser.profilePicture)}
                                        
                                        alt=""
                                    />
                                </>)}
                        </div>
                        <div className={styles["upload-div"]}>
                            <input
                                disabled={isLoading}
                                type="file"
                                name='profilePicture'
                                ref={fileInputRef}
                                accept="image/*"
                                id="file-input"
                                onChange={onFileInputChange}
                            />
                            {!previewUrl && !isLoading && <FontAwesomeIcon className={styles['icon']} icon={faUpload} onClick={() => fileInputRef.current.click()} />}
                            {previewUrl && !isLoading && <FontAwesomeIcon className={styles['cancel-icon']} disabled={isLoading} onClick={onClearPreview} icon={faTimesCircle} />}
                            {hasProfilePicture(decodedUser.profilePicture) && !previewUrl && !isLoading && <button disabled={isLoading} onClick={onRemoveExistingImage} className={styles["remove-existing-image"]}>
                                Remove existing image
                            </button>}
                        </div>
                    </div>
                </div>
                <div className={styles["button-div"]}>
                    {isLoading && (
                        <div className={styles['loader']} >
                            <SmallSpinner />
                        </div>)}
                    {!isLoading &&
                        <button onClick={() => formRef.current.requestSubmit()} className={styles["save"]}
                            disabled={values.username.length < 3 || values.firstName < 2
                                || values.lastName < 2 || isLoading} >
                            Save changes
                        </button>}
                </div>
            </div>
        </div >
    );
};