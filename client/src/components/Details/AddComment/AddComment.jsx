import { useContext, useState } from 'react';
import { useForm } from '../../../hooks/useForm';
import { writeComment } from '../../../services/postService';
import styles from './addComment.module.css';
import { useParams } from 'react-router';
import { UserContext } from '../../../contexts/AuthContext';
import { DetailsContext } from '../../../contexts/DetailsContext';
import { SmallSpinner } from '../../spinners/SmallSpinner';
import { isEdited } from '../../../utils/postHelper';

export const AddComment = () => {

    const { postId } = useParams(':postId');

    const { decodedUser } = useContext(UserContext);
    const { setPost, isCommenting,isDeleting, isEditing, isDeletingComment, setIsCommenting, isEditingComment } = useContext(DetailsContext);

    const [errorMsg, setErrorMsg] = useState('');

    const initialValues = {
        comment: ''
    }

    const { values,setValues, onSubmitHandler, onInputChange } = useForm(initialValues);

    function onSubmit(e) {
        onSubmitHandler(e);
        if(values.comment.length<2){
            setErrorMsg('Comment must at least 2 characters long!');
            return;
        }
        setIsCommenting(true);
        writeComment(postId, decodedUser._id, values.comment)
            .then((data) => {
                setIsCommenting(false);
                setPost(data);
                setErrorMsg('');
                setValues(initialValues);

            }).catch((err)=>{
                setErrorMsg(err.message);
                setIsCommenting(false);
            })
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {

            onSubmit(e);
        }
    };

    return (
        <div className={styles['add-comment-container']}>
            <form onKeyDown={handleKeyDown} onSubmit={onSubmit}>
                <div className={styles['error-div']}>
                    <span className={styles['errorMsg']}>{errorMsg}</span>
                </div>
                <div className={styles['comment']}>
                    <textarea
                        onChange={onInputChange}
                        disabled={isCommenting||isDeleting||isEditing||isDeletingComment||isEditingComment}
                        value={values.comment}
                        name='comment'
                        placeholder='Write your comment here...'></textarea>
                </div>
                {!isCommenting && <div className={styles['upload']}>
                    <button disabled={isCommenting||isDeleting||isEditing||isDeletingComment||isEditingComment} type='submit'>Comment</button>
                </div>}
                {isCommenting && <div className={styles['spinner-div']}>
                    <SmallSpinner/>
                </div>}
            </form>
        </div>
    );
}