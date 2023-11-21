import { useContext, useState } from "react";
import { decodeBuffer } from "../../../utils/imageHelper"
import { timeAgo, isEdited } from "../../../utils/postHelper"
import styles from './post.module.css';
import { DetailsContext } from "../../../contexts/DetailsContext";
import { UserContext } from "../../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { likePost } from "../../../services/postService";
import { SmallSpinner } from "../../spinners/SmallSpinner";

export const Post = () => {

    const { post, setPost } = useContext(DetailsContext);
    const { isAuthenticated, decodedUser } = useContext(UserContext);

    const [isLiking, setIsLiking] = useState(false);

    function onLikeClick() {
        setIsLiking(true);
        likePost(post._id, decodedUser._id)
            .then((data) => {
                setPost(data);
                setIsLiking(false);
            }).catch((err) => {
                setIsLiking(false);
            })
    }

    function isLiked() {
        return post.likedBy.includes(decodedUser._id);
    }

    const liked = isLiked();

    return (
        <div className={styles.container}>
            <div className={styles['profile-image-div']}>
                <img
                    className={styles['profile-image']}
                    src={decodeBuffer(post?.owner.profilePicture)}
                />
            </div>
            <div className={styles.main}>
                <div className={styles.header}>
                    <div className={styles['owner-name']}>
                        <p>{post.owner.firstName} {post.owner.lastName}</p>
                    </div>
                    <div className={styles['username-publish']}>
                        <div className={styles['owner-username']}>
                            <p>@{post.owner.username}</p>
                        </div>
                        <div className={styles['publish-time']}>
                            <p>{timeAgo(post.createdAt)}</p>
                        </div>
                    </div>
                    {isEdited(post?.createdAt, post?.lastEditedAt) && (
                        <div className={styles['edited']}>
                            <p>Edited</p>
                        </div>
                    )}
                    {/* {(
                        <div className={styles['actions']}>
                            {<i onClick={onEdit} className="material-icons">edit</i>}
                            {!editPost && (
                                <>
                                    {!deletePost && <i onClick={onDelete} className="material-icons">delete</i>}
                                    {deletePost && <i onClick={onDeleteCancel} className="material-icons">cancel</i>}
                                    {deletePost && <i onClick={onDeleteAccept} className="material-icons">done</i>}
                                </>
                            )}
                        </div>
                    )} */}
                </div>
                <div className={styles['content']}>
                    <p className={styles['description']}>{post.description}</p>
                    {post.image && (
                        <div className={styles['post-image']}>
                            <img
                                className={styles['post-image']}
                                src={decodeBuffer(post.image)}
                            />
                        </div>
                    )}
                </div>
                <div className={styles['footer']}>
                    {isAuthenticated && (
                        <div className={styles['like']}>
                            {isLiking &&
                                <div className={styles['like-spinner']}>
                                    <SmallSpinner />
                                </div>}
                            {!isLiking && <FontAwesomeIcon onClick={onLikeClick} className={liked ? styles['isLiked'] : styles['isNotLiked']} icon={faHeart} />}
                        </div>
                    )}
                    <div className={styles['likes']}>
                        <p>{post.likedBy.length} likes</p>
                    </div>
                    <div className={styles['comments']}>
                        <p>{post.comments.length} comments</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
