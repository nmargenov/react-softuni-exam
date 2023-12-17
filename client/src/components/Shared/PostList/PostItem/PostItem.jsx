import { useState } from 'react';
import { decodeBuffer } from '../../../../utils/imageHelper';
import { isEdited, timeAgo } from '../../../../utils/postHelper';
import styles from '../postList.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { SmallSpinner } from '../../../Spinners/SmallSpinner';


export const PostItem = ({ _id, description, image, likedBy, comments, owner, createdAt, lastEditedAt }) => {

    const navigate = useNavigate();
    const location = useLocation(); 
    const [isPostImageLoading, setIsPostImageLoading] = useState(true);
    const [isProfileImageLoading, setIsProfileImageLoading] = useState(true);

    function navigateToUserProfile(username) {
        const targetUrl = `/profile/${username}`;
        
        if (location.pathname !== targetUrl) {
          navigate(targetUrl);
        }
      }

    function navigateToPost(postID) {
        navigate('/post/' + postID);
    }

    function onPostImageLoad() {
        setIsPostImageLoading(false);
    }

    function onProfileImageLoad(){
        setIsProfileImageLoading(false);
    }

    return (
        <div onClick={() => navigateToPost(_id)} className={styles['item-container']}>
            <div className={styles['profile-image-div']}>
                {isProfileImageLoading && <div className={styles['profile-image-loading']}><SmallSpinner/></div>}
                <img onClick={(e) => { e.stopPropagation(); navigateToUserProfile(owner.username) }} onLoad={onProfileImageLoad} onError={onProfileImageLoad}  className={isProfileImageLoading ? styles['is-loading'] : styles['profile-image']} src={decodeBuffer(owner.profilePicture)} />
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
                        <img className={isPostImageLoading ? styles['is-loading'] : styles['post-image']} onLoad={onPostImageLoad} onError={onPostImageLoad} src={decodeBuffer(image)} alt="" />
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
