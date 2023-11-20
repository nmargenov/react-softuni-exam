import { useState } from 'react';
import { decodeBuffer } from '../../../../utils/imageHelper';
import { isEdited, timeAgo } from '../../../../utils/postHelper';
import styles from '../postList.module.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SmallSpinner } from '../../../spinners/SmallSpinner';


export const PostItem = ({ _id, description, image, likedBy, comments, owner, createdAt, lastEditedAt }) => {

    const navigate = useNavigate();
    const [isPostImageLoading, setIsPostImageLoading] = useState(true);

    function navigateToUserProfile(username) {
        navigate('/profile/' + username);
    }

    function navigateToPost(postID) {
        navigate('/post/' + postID);
    }

    function onLoad() {
        setIsPostImageLoading(false)
    }

    return (
        <div onClick={() => navigateToPost(_id)} className={styles['item-container']}>
            <div className={styles['profile-image-div']}>
                <img onClick={(e) => { e.stopPropagation(); navigateToUserProfile(owner.username) }} className={styles['profile-image']} src={decodeBuffer(owner.profilePicture)} />
            </div>
            <div className={styles['main']}>
                <div className={styles['header']}>
                    <div onClick={(e) => { e.stopPropagation(); navigateToUserProfile(owner.username) }} className={styles['owner-name']}>
                        <p>{owner.firstName} {owner.lastName}</p>
                    </div>
                    <div className={styles['username-publish']}>
                        <div onClick={(e) => { e.stopPropagation(); navigateToUserProfile(owner.username) }} className={styles['owner-username']}>
                            <p>@{owner.username}</p>
                        </div>
                        <div className={styles['publish-time']}>
                            <p>{timeAgo(createdAt)}</p>
                        </div>
                    </div>
                    {isEdited(createdAt, lastEditedAt) && <div className={styles['edited']}>
                        <p>Edited</p>
                    </div>}
                </div>
                <div className={styles['content']}>
                    <p>{description}</p>
                    {image && <div className={styles['post-image']}>
                        <img className={isPostImageLoading ? styles['is-loading'] : styles['post-image']} onLoad={onLoad} onError={onLoad} src={decodeBuffer(image)} alt="" />
                    </div>}
                    {image && isPostImageLoading &&
                        <div className={styles['post-image-loader']}>
                            <SmallSpinner />
                        </div>}
                </div>
                <div className={styles['footer']}>
                    <div className={styles['likes']}>
                        <p>{likedBy.length} likes</p>
                    </div>
                    <div className={styles['comments']}>
                        <p>{comments.length} comments</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
