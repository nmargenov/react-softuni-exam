import { useContext, useEffect } from "react";
import { Post } from "./Post/Post";
import { useParams } from 'react-router'
import { getPostById } from "../../services/postService";
import { DetailsContext } from "../../contexts/DetailsContext";
import { GlobalSpinner } from "../Spinners/GlobalSpinner/GlobalSpinner";
import styles from './details.module.css';
import { Error } from "../Error/Error";
import { AddComment } from "./AddComment/AddComment";
import { UserContext } from "../../contexts/AuthContext";
import { CommentList } from "./CommentList/CommentList";

export const Details = () => {
    const { postId } = useParams(':postId');

    const {isAuthenticated} = useContext(UserContext);

    const { setPost, setIsPostLoading, isPostLoading, setHasPostLoadingError, hasPostLoadingError } = useContext(DetailsContext);

    useEffect(() => {
        setIsPostLoading(true);
        getPostById(postId)
            .then((data) => {
                setPost(data);
        document.title=`${data.owner.username}'s post`;
                setIsPostLoading(false);
                setHasPostLoadingError(false);
            }).catch((err) => {
        document.title=`Post`;
                setIsPostLoading(false);
                setHasPostLoadingError(true);
            });
    }, [])
    return (
        <>
            {isPostLoading && <div className={styles['loader']}><GlobalSpinner /></div>}
            {!isPostLoading && hasPostLoadingError && <Error />}
            {!isPostLoading && !hasPostLoadingError &&
                <div className={styles['main-container']}>
                    <div className={styles['post-component']}>
                        <Post />
                    </div>
                    {isAuthenticated && <div className={styles['add-comment-component']}>
                        <AddComment />
                    </div>}
                    <CommentList/>
                </div>}
        </>
    );
}