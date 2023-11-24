import { useContext, useRef, useState } from 'react';
import styles from './editPost.module.css';
import { decodeBuffer } from '../../../utils/imageHelper';
import { DetailsContext } from '../../../contexts/DetailsContext';
import { useForm } from '../../../hooks/useForm';
import { editPost, removeExistingImage } from '../../../services/postService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { SmallSpinner } from '../../spinners/SmallSpinner';

export const EditPost = () => {

    const { post, setPost, isEditing, setIsEditing, isCommenting, isDeletingComment, setIsEditOpen, setIsPostImageLoading, isEditingComment } = useContext(DetailsContext);

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
        setIsEditing(true);
        editPost(post._id, formData)
            .then((data) => {
                setPost(data);
                setIsEditOpen(false);
                setIsEditing(false);
                setIsPostImageLoading(true);
                setErrorMsg('');
            }).catch((err) => {
                setIsEditing(false);
                setErrorMsg(err.message);
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
        setIsEditing(true);
        removeExistingImage(post._id)
            .then((data) => {
                setPost(data);
                setIsRemovePhoto(false);
                setIsEditing(false);
                setIsEditOpen(false);
            })
    }

    function onRemovePhotoClick() {
        setIsRemovePhoto(true);
    }

    function onRemovePhotoCancel() {
        setIsRemovePhoto(false);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (values.description.length > 0 && values.description.length < 5) {
                setErrorMsg('Description must be at least 5 characters long!');
                return;
            }
            onSubmit(e);
        }
    };

    return (
        <div className={styles.container}>
            <form onKeyDown={handleKeyDown} ref={formRef} onSubmit={onSubmit}>
                {errorMsg && (
                    <div className={styles['error-div']}>
                        <p className={styles.errorMsg}>{errorMsg}</p>
                    </div>
                )}
                <div className={styles['textarea-div']}>
                    <textarea
                        onChange={onInputChange}
                        value={values.description}
                        disabled={isEditing||isDeletingComment}
                        name="description"
                        placeholder="What's happening"
                    ></textarea>
                </div>
            </form>
            {post.image && !previewUrl && (
                <div className={styles['image-div']}>
                    <img src={decodeBuffer(post.image)} alt="" />
                    {!isRemovePhoto && !isCommenting && !isEditing && !isDeletingComment && !isEditingComment && <button onClick={onRemovePhotoClick} className={styles['remove-existing-btn']}>
                        Remove existing photo
                    </button>}
                    {isRemovePhoto && !isCommenting && !isEditing && !isDeletingComment && !isEditingComment &&
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
                        {(!isCommenting && !isDeletingComment && !isEditingComment &&
                            <button type='none' onClick={onFileClear} className={styles['remove-existing-btn']}>
                                Remove selected photo
                            </button>
                        )}
                    </div>
                )
            }
            {
                !isEditing && !isCommenting && !isDeletingComment && !isEditingComment &&(
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
            {isEditing && <div className={styles['editing-loader']}><SmallSpinner /></div>}
        </div >
    );
};