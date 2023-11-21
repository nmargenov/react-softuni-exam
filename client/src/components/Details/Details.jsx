import { useContext, useEffect } from "react";
import { Post } from "./Post/Post";
import { useParams } from 'react-router'
import { getPostById } from "../../services/postService";
import { DetailsContext } from "../../contexts/DetailsContext";

export const Details = () => {
    const { postId } = useParams(':postId');

    const { setPost, setIsPostLoading, isPostLoading } = useContext(DetailsContext);

    useEffect(() => {
        setIsPostLoading(true);
        getPostById(postId)
            .then((data) => {
                setPost(data);
                setIsPostLoading(false);
            }).catch((err) => {
                setIsPostLoading(false);
            });
    }, [])
    return (
        <>
            {!isPostLoading && <Post />}
        </>
    );
}