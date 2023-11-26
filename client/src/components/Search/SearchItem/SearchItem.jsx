import { useNavigate } from 'react-router';
import { decodeBuffer } from '../../../utils/imageHelper';
import styles from './searchItem.module.css';
import { useState } from 'react';
import { SmallSpinner } from '../../spinners/SmallSpinner';

export const SearchItem = ({ userPosts, profilePicture, username, firstName, lastName, following, followers }) => {
    const [isProfilePictureLoading, setIsProfilePictureLoading] = useState(true);
    
    const navigate = useNavigate();

    function navigateToUserProfile(username) {
        navigate(`/profile/${username}`);
    }

    function onLoadPicture(){
        setIsProfilePictureLoading(false);
    }

    return (
        <div onClick={() => navigateToUserProfile(username)} className={styles["search-item"]}>
            <div className={styles['left-div']}>
                {isProfilePictureLoading && <div className={styles['spinner-div']}><SmallSpinner/></div>}
                <img onLoad={onLoadPicture} onError={onLoadPicture} className={isProfilePictureLoading ? styles['is-loading'] :styles['image']} src={decodeBuffer(profilePicture)} />
            </div>
            <div className={styles['right-div']}>
                <div className={styles['user-info']}>
                    <p>{firstName} {lastName}</p>
                    <p>@{username}</p>
                    <p>{userPosts.length} posts</p>
                </div>
                <div className={styles['follow-info']}>
                    <p>Followers: {followers.length}</p>
                    <p>Following: {following.length}</p>
                </div>
            </div>
        </div>
    )
}