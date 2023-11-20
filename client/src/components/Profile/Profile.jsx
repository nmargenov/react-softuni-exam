import { useNavigate, useParams } from "react-router";
import { decodeBuffer } from "../../utils/imageHelper"
import styles from "./profile.module.css";
import { useContext, useEffect, useState } from "react";
import { follow, getUser } from "../../services/userService";
import { SmallSpinner } from "../spinners/SmallSpinner";
import { UserContext } from "../../contexts/AuthContext";
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GlobalSpinner } from "../Spinners/GlobalSpinner/GlobalSpinner";

export const Profile = () => {

    const navigate = useNavigate();
    const { username } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowingLoading, setIsFollowingLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);

    const { decodedUser, isAuthenticated } = useContext(UserContext);


    useEffect(() => {
        ;
        getUser(username)
            .then((data) => {
                setUser(data);
                data.followers.includes(decodedUser._id) ? setIsFollowing(true) : setIsFollowing(false);
                if (decodedUser) {
                    data._id === decodedUser._id ? setIsOwner(true) : setIsOwner(false);
                }
                setIsLoading(false);
            }).catch((err) => {
                setIsLoading(false);
            })
    }, [username]);

    const onFollow = async () => {
        const userId = decodedUser?._id;
        if (!userId) {
            return;
        }
        setIsFollowingLoading(true);
        follow(username, userId)
            .then((data) => {
                setIsFollowingLoading(false);
                data.followers.includes(decodedUser._id) ? setIsFollowing(true) : setIsFollowing(false);
                setUser(data);
            }).catch((err) => {
                setIsFollowingLoading(false);
            })
    };

    const onImageLoad = () => {
        setIsImageLoading(false);
    };


    return (
        <>
            {isLoading &&
                <div className={styles["loader"]}>
                    <GlobalSpinner />
                </div>}
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
                                    <FontAwesomeIcon className={styles['settings']} icon={faGear} />
                                </>
                            )}
                            {!isOwner && isAuthenticated && (
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