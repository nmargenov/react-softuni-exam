import { useNavigate, useParams } from "react-router";
import { decodeBuffer } from "../../utils/imageHelper"
import styles from "./profile.module.css";
import { useEffect, useState } from "react";
import { getUser } from "../../services/userService";
import { SmallSpinner } from "../spinners/SmallSpinner";

export const Profile = () => {

    const navigate = useNavigate();
    const { username } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowingLoading, setIsFollowingLoading] = useState(false);
    const [isLikedFetching, setIsLikedFetching] = useState(false);
    const [posts, setPosts] = useState([]);
    const [isImageLoading, setIsImageLoading] = useState(true);

    useEffect(() => {
        getUser(username)
            .then((data) => {
                setUser(data)
                setIsLoading(false);
            }).catch((err) => {
                console.log(err);
                setIsLoading(false);
            })
    }, [username]);

    const onFollow = async () => {
        // Implement your logic to handle follow/unfollow actions
        // Use setIsFollowing, setIsFollowingLoading, and any other necessary state updates
    };

    const onImageLoad = () => {
        setIsImageLoading(false);
    };


    return (
        <>
        {!isLoading && <div className={styles["main"]}>
            <div className={styles["profile"]}>
                <div className={styles["profile-image"]}>
                    {isImageLoading && <SmallSpinner />}
                    <img
                        className={isImageLoading ? styles["is-loading"] : ""}
                        onError={onImageLoad}
                        onLoad={onImageLoad}
                        src={decodeBuffer(user.profilePicture)}
                        alt=""
                    />
                </div>
                <div className={styles["profile-info"]}>
                    <div className={styles["profile-username"]}>
                        <h1>{user.username}</h1>
                        {isOwner && (
                            <>
                                <button onClick={() => navigate('/account/settings')} className={styles["edit-btn"]}>
                                    Edit Profile
                                </button>
                                <i onClick={() => navigate('/account/settings')} className={styles["material-icons settings"]}>
                                    settings
                                </i>
                            </>
                        )}
                        {!isOwner && isLoggedIn && (
                            <>
                                <button
                                    disabled={isFollowingLoading}
                                    onClick={onFollow}
                                    className={styles["follow-btn"]}
                                >
                                    {isFollowing ? 'Unfollow' : 'Follow'}
                                </button>
                            </>
                        )}
                    </div>
                    <div className={styles["profile-stats"]} >
                        <ul>
                            <li>
                                <span className={styles["profile-stat-count"]}>{user.userPosts?.length || 0} posts</span>
                            </li>
                            <li>
                                <span className={styles["profile-stat-count"]}>{user.followers.length} followers</span>
                            </li>
                            <li>
                                <span className={styles["profile-stat-count"]}>{user.following.length} following</span>
                            </li>
                        </ul>
                    </div>
                    <div className={styles["profile-name"]}>
                        <p>
                            {user.firstName} {user.lastName}
                        </p>
                    </div>
                    <div className={styles["profile-bio"]}>
                        <p>{user.bio || 'No bio yet.'}</p>
                    </div>
                </div>
            </div>
            {/* /* <ChooseFeed ensureLoggedInAndOwner={ensureLoggedInAndOwner} feedChange={getFeed} />
            <ListPosts isLikedFetching={isLikedFetching} posts={posts} />
            {isLikedFetching && <Spinner />} */}
        </div>}
        </>
    )
}