import { useContext, useRef, useState } from 'react';
import styles from './editPost.module.css';
import { decodeBuffer } from '../../../utils/imageHelper';
import { DetailsContext } from '../../../contexts/DetailsContext';
import { useForm } from '../../../hooks/useForm';
import { editPost } from '../../../services/postService';

export const EditPost = () => {

    const { post,setPost, isEditing, setIsEditing, setIsEditOpen } = useContext(DetailsContext);

    const fileInputRef = useRef();

    const [previewUrl, setPreviewUrl] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const initialValues = {
        description: post.description
    }

    const { values, setValues, onSubmitHandler, onInputChange } = useForm(initialValues);

    function onImageRemove() {

    }

    function onCancel() {
        setIsEditOpen(false);
    }
    function onSave() {
        const formData = new FormData();
        formData.append('description', values.description.trim());
        formData.append('postImage', selectedFile);

        editPost(post._id,formData)
            .then((data)=>{
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

    function onFileClear(){
        setSelectedFile(null);
        setPreviewUrl(null);
    }

    return (
        <div className={styles.container}>
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
            {post.image && !previewUrl && (
                <div className={styles['image-div']}>
                    <img src={decodeBuffer(post.image)} alt="" />
                    {/* {!isEditing && (
                        <div className={styles.buttons}>
                            {imageRemove && (
                                <i onClick={onImageRemoveCancel} className="material-icons">
                                    cancel
                                </i>
                            )}
                            {imageRemove && (
                                <i onClick={onImageRemoveAccept} className="material-icons">
                                    done
                                </i>
                            )}
                        </div>
                    )} */}
                    <button onClick={onImageRemove} className={styles['clear-btn']}>
                        Remove existing photo
                    </button>
                </div>
            )}
            {previewUrl && (
                <div className={styles['image-div']}>
                    <img src={previewUrl} alt="" />
                    {(
                        <button onClick={onFileClear} className={styles['clear-btn']}>
                            Remove selected photo
                        </button>
                    )}
                </div>
            )}
            {!isEditing && (
                <div className={styles.actions}>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={onFileInputChange}
                        style={{ display: 'none' }}
                    />
                    <button onClick={() => fileInputRef.current.click()} className={styles['upload-btn']}>
                        {previewUrl ? 'Change Photo' : 'Upload photo'}
                    </button>
                    <div className={styles['save-cancel-btn']}>
                        <button onClick={onCancel} className={styles['clear-btn']}>
                            Cancel
                        </button>
                        <button onClick={onSave} className={styles['save-btn']}>
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};