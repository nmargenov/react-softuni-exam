import { useContext, useRef, useState } from 'react';
import { useForm } from '../../../hooks/useForm';
import styles from './createPost.module.css';
import { SmallSpinner } from '../../Spinners/SmallSpinner';
import { createPost } from '../../../services/postService';
import { UserContext } from '../../../contexts/AuthContext';

export const CreatePost = ({ hasError, isPostsLoading, setPosts }) => {
    const initialValues = {
        description: ""
    }
    const { decodedUser } = useContext(UserContext);
    const { values, setValues, onSubmitHandler, onInputChange, errorMsg, setErrorMsg, isLoading, setIsLoading } = useForm(initialValues);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const formRef = useRef();
    const fileInputRef = useRef();

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

    function onSubmit(e) {
        onSubmitHandler(e);

        if (values.description.length < 5) {
            setErrorMsg('Description must be at least 5 characters long!');
            return;
        }

        const formData = new FormData();
        formData.append('owner', decodedUser._id);
        formData.append('description', values.description.trim());
        formData.append('postImage', selectedFile);

        setIsLoading(true);

        createPost(formData)
            .then((data) => {
                setIsLoading(false);
                setPosts(state => [data, ...state]);
                setValues(initialValues);
                setSelectedFile(null);
                setPreviewUrl(null);
                setErrorMsg('');

            }).catch((err) => {
                setIsLoading(false);
                setValues(initialValues);
                setSelectedFile(null);
                setPreviewUrl(null)
                setErrorMsg(err.message);
            })
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            if (values.description.length > 0 && values.description.length < 5) {
                setErrorMsg('Description must be at least 5 characters long!');
                return;
            }
            onSubmit(e);
        }
    };
    return (
        <div className={styles['create-post-container']}>
            {errorMsg && <div className={styles['errorDiv']}>
                <span className={styles['errorMsg']}>{errorMsg}</span>
            </div>}
            <form onKeyDown={handleKeyDown} ref={formRef} onSubmit={onSubmit}>
                <div className={styles['post-content']}>
                    <textarea disabled={isLoading || isPostsLoading || hasError} value={values.description} onChange={onInputChange} name="description" id="" placeholder="What's happening?"></textarea>
                    <input onChange={onFileInputChange} ref={fileInputRef} type='file' accept='image/*'></input>
                </div>
            </form>
            {previewUrl && <div className={styles['image-div']}>
                <img src={previewUrl} />
                {!isLoading && <button disabled={isLoading || isPostsLoading || hasError} onClick={onClearPreview} className={styles['clear-btn']}>Clear images</button>}
            </div>}
            <div className={styles['post-actions']}>
                {!isLoading && <>
                    <button disabled={isLoading || isPostsLoading || hasError} onClick={() => fileInputRef.current.click()} className={styles['upload-btn']}>{previewUrl ? "Change Image" : "Upload Image"}</button>
                    <button disabled={isLoading || isPostsLoading || hasError} onClick={() => formRef.current.requestSubmit()} className={styles['post-btn']}>Post</button>
                </>}
                {isLoading && <div className={styles['loader']}>
                    <SmallSpinner />
                </div>}
            </div>
        </div>
    )
}
