import { useContext, useState } from 'react';
import { useForm } from '../../../hooks/useForm';
import { editComment } from '../../../services/postService';
import styles from './editComment.module.css';
import { DetailsContext } from '../../../contexts/DetailsContext';
import { SmallSpinner } from '../../spinners/SmallSpinner';

export const EditComment = ({ _id, comment, setIsOpen }) => {

    const { post, setPost, isEditingComment, setIsEditingComment } = useContext(DetailsContext);

    const [isEditing, setIsEditing] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const initialValues = {
        comment
    }

    const { values, onSubmitHandler, onInputChange } = useForm(initialValues);

    function onCancel(e) {
        onSubmitHandler(e);
        setIsOpen(false);
    }

    function onSubmit(e) {
        onSubmitHandler(e);
        if(values.comment.length<2){
            setErrorMsg('Comment must at least 2 characters long!');
            return;
        }
        setIsEditing(true);
        setIsEditingComment(true);
        editComment(post._id, _id, values.comment)
            .then((data) => {
                setPost(data);
                setErrorMsg('');
                setIsOpen(false);
                setIsEditing(false);
                setIsEditingComment(false);
            }).catch((err) => {
                setErrorMsg(err.message);
                setIsEditing(false);
                setIsEditingComment(false);
            });
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {

            onSubmit(e);
        }
    };
    return (
        <div className={styles['container']}>
            {errorMsg && <div className={styles['error-div']}>
                <p className={styles['errorMsg']}>{errorMsg}</p>
            </div>}
            <form onKeyDown={handleKeyDown} onSubmit={onSubmit}>
                <div className={styles['textarea-div']}>
                    <textarea disabled={isEditing || isEditingComment} value={values.comment} onChange={onInputChange} name="comment" placeholder="What's happening"></textarea>
                </div>
                {!isEditing && !isEditingComment && <div className={styles['actions']}>
                    <button onClick={onCancel} className={styles['cancel-btn']}>
                        Cancel
                    </button>
                    <button className={styles['save-btn']}>
                        Save
                    </button>
                </div>}
                {isEditing && <div className={styles['spinner-div']}><SmallSpinner /></div>}
            </form>
        </div>
    );
}