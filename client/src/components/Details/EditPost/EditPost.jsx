import { useContext, useRef, useState } from 'react';
import styles from './editPost.module.css';
import { decodeBuffer } from '../../../utils/imageHelper';
import { DetailsContext } from '../../../contexts/DetailsContext';
import { useForm } from '../../../hooks/useForm';
import { editPost, removeExistingImage } from '../../../services/postService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

export const EditPost = () => {

    const { post, setPost, isEditing, setIsEditing, setIsEditOpen } = useContext(DetailsContext);

    const fileInputRef = useRef();
    const formRef = useRef();

    const [previewUrl, setPreviewUrl] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isRemovePhoto, setIsRemovePhoto] = useState(false);

    const initialValues = {
        description: post.description
    }

    const { values, setValues, onSubmitHandler, onInputChange } = useForm(initialValues);

    function onCancel() {
        setIsEditOpen(false);
    }

    function onSubmit(e) {
        onSubmitHandler(e);
        const formData = new FormData();
        formData.append('description', values.description.trim());
        formData.append('postImage', selectedFile);

        editPost(post._id, formData)
            .then((data) => {
                setPost(data);
                setIsEditOpen(false);
            })

    }

    function onFileInputChange(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        setSelectedFile(file);
        reader.onload = () => {
            setPreviewUrl(reader.result)
        };
        reader.readAsDataURL(file);
    }

    function onFileClear() {
        setSelectedFile(null);
        setPreviewUrl(null);
    }

    function onRemovePhotoAccept() {
        removeExistingImage(post._id)
            .then((data) => {
                setPost(data);
                setIsRemovePhoto(false);
                setIsEditOpen(false);
            })
    }

    function onRemovePhotoClick() {
        setIsRemovePhoto(true);
    }

    function onRemovePhotoCancel() {
        setIsRemovePhoto(false);
    }

    return (
        <div className={styles.container}>
            <form ref={formRef} onSubmit={onSubmit}>
                {errorMsg && (
                    <div className={styles['error-div']}>
                        <p className={styles.errorMsg}>{errorMsg}</p>
                    </div>
                )}
                <div className={styles['textarea-div']}>
                    <textarea
                        onChange={onInputChange}
                        value={values.description}
                        name="description"
                        placeholder="What's happening"
                    ></textarea>
                </div>
            </form>
            {post.image && !previewUrl && (
                <div className={styles['image-div']}>
                    <img src={decodeBuffer(post.image)} alt="" />
                    {!isRemovePhoto && <button onClick={onRemovePhotoClick} className={styles['remove-existing-btn']}>
                        Remove existing photo
                    </button>}
                    {isRemovePhoto &&
                        <div className={styles['remove-actions']}>
                            <FontAwesomeIcon onClick={onRemovePhotoAccept} icon={faCheck} />
                            <FontAwesomeIcon onClick={onRemovePhotoCancel} icon={faXmark} />
                        </div>
                    }
                </div>
            )
            }
            {
                previewUrl && (
                    <div className={styles['image-div']}>
                        <img src={previewUrl} alt="" />
                        {(
                            <button type='none' onClick={onFileClear} className={styles['remove-existing-btn']}>
                                Remove selected photo
                            </button>
                        )}
                    </div>
                )
            }
            {
                !isEditing && (
                    <div className={styles.actions}>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={onFileInputChange}
                            style={{ display: 'none' }}
                        />
                        {!isRemovePhoto && <>
                        {<button onClick={() => fileInputRef.current.click()} className={styles['edit-upload-btn']}>
                            {post.image || previewUrl ? 'Change Photo' : 'Upload photo'}
                        </button>}
                        <div className={styles['save-cancel-btn']}>
                            <button onClick={onCancel} className={styles['clear-btn']}>
                                Cancel
                            </button>
                            <button onClick={() => formRef.current.requestSubmit()} type='submit' className={styles['edit-save-btn']}>
                                Save
                            </button>
                        </div>
                        </>}
                    </div>
                )
            }
        </div >
    );
};