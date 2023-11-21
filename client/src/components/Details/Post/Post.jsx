import { useContext, useEffect, useState } from "react";
import { decodeBuffer } from "../../../utils/imageHelper"
import { timeAgo, isEdited } from "../../../utils/postHelper"
import styles from './post.module.css';
import { DetailsContext } from "../../../contexts/DetailsContext";
import { UserContext } from "../../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit, faHeart, faPen, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { deletePost, likePost } from "../../../services/postService";
import { SmallSpinner } from "../../spinners/SmallSpinner";
import { useNavigate } from "react-router";

export const Post = () => {

    const { post, setPost } = useContext(DetailsContext);
    const { isAuthenticated, decodedUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [isLiking, setIsLiking] = useState(false);
    const [isProfileImageLoading, setIsProfileImageLoading] = useState(true);
    const [isPostImageLoading, setIsPostImageLoading] = useState(true);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

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

    function onDeleteOpen() {
        setIsDeleteOpen(true);
    }

    function onDeleteCancel() {
        setIsDeleteOpen(false);
    }
    function onDeleteAccept() {
        setIsDeleting(true);
        deletePost(post._id)
            .then((data) => {
                setIsDeleting(false);
                setIsDeleteOpen(false);
                navigate('/feed');
            }).catch((err) => {
                setIsDeleting(false);
                setIsDeleteOpen(false);
            })
    }

    function onEditOpen() {
        setIsEditOpen(true);
    }

    function onEditCancel() {
        setIsEditOpen(false);
    }
    function onEditAccept() {
        setIsEditOpen(false);
        console.log('edited');
    }

    function isLiked() {
        return isAuthenticated && post.likedBy.includes(decodedUser._id);
    }

    const liked = isLiked();

    function onProfileImageLoad() {
        setIsProfileImageLoading(false);
    }

    function onPostImageLoad() {
        setIsPostImageLoading(false);
    }

    function navigateToUserProfile(username) {
        const targetUrl = `/profile/${username}`;

        if (location.pathname !== targetUrl) {
            navigate(targetUrl);
        }
    }

    function isOwner() {
        return isAuthenticated && decodedUser._id === post.owner._id;
    }

    return (
        <div className={styles.container}>
            <div onClick={() => navigateToUserProfile(post.owner.username)} className={styles['profile-image-div']}>
                {isProfileImageLoading &&
                    <div className={styles['profile-image-loading']}>
                        <SmallSpinner />
                    </div>}
                <img
                    onLoad={onProfileImageLoad}
                    onError={onProfileImageLoad}
                    className={isProfileImageLoading ? styles['is-loading'] : styles['profile-image']}
                    src={decodeBuffer(post?.owner.profilePicture)}
                />
            </div>
            <div className={styles.main}>
                <div className={styles.header}>
                    <div onClick={() => navigateToUserProfile(post.owner.username)} className={styles['owner-name']}>
                        <p>{post.owner.firstName} {post.owner.lastName}</p>
                    </div>
                    <div className={styles['username-publish']}>
                        <div onClick={() => navigateToUserProfile(post.owner.username)} className={styles['owner-username']}>
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
                    <div className={styles['actions']}>
                        {isOwner() && !isDeleting && <>
                            {!isDeleteOpen && !isEditOpen && <FontAwesomeIcon onClick={onEditOpen} icon={faPen} />}
                            {!isDeleteOpen && !isEditOpen && <FontAwesomeIcon onClick={onDeleteOpen} icon={faTrash} />}
                            {isDeleteOpen &&
                                <>
                                    <FontAwesomeIcon onClick={onDeleteAccept} icon={faCheck} />
                                    <FontAwesomeIcon onClick={onDeleteCancel} icon={faXmark} />
                                </>}
                        </>}
                        {isOwner && isDeleting &&
                            <div className={styles['delete-spinner']}>
                                <SmallSpinner />
                            </div>}
                    </div>
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
                            {isPostImageLoading &&
                                <div className={styles['post-image-loader']}>
                                    <SmallSpinner />
                                </div>
                            }
                            <img
                                onLoad={onPostImageLoad}
                                onError={onPostImageLoad}
                                className={isPostImageLoading ? styles['is-loading'] : styles['post-image']}
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
