import { useContext, useEffect } from "react";
import { Post } from "./Post/Post";
import { useParams } from 'react-router'
import { getPostById } from "../../services/postService";
import { DetailsContext } from "../../contexts/DetailsContext";
import { GlobalSpinner } from "../Spinners/GlobalSpinner/GlobalSpinner";
import styles from './details.module.css';
import { Error } from "../Error/Error";

export const Details = () => {
    const { postId } = useParams(':postId');

    const { setPost, setIsPostLoading, isPostLoading, setHasPostLoadingError, hasPostLoadingError } = useContext(DetailsContext);

    useEffect(() => {
        setIsPostLoading(true);
        getPostById(postId)
            .then((data) => {
                setPost(data);
                setIsPostLoading(false);
                setHasPostLoadingError(false);
            }).catch((err) => {
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
                    <Post />
                </div>}
        </>
    );
}