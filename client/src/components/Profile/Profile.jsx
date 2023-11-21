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
import { Error } from "../Error/Error";
import { ChooseFeed } from "../Shared/ChooseFeed/ChooseFeed";
import { PostList } from "../Shared/PostList/PostList";
import { getLikedPosts } from "../../services/postService";

export const Profile = () => {

    const navigate = useNavigate();
    const { username } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowingLoading, setIsFollowingLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [hasError, setHasError] = useState(true);
    const [posts, setPosts] = useState([]);
    const [isPostsLoading, setIsPostsLoading] = useState(false);


    const { decodedUser, isAuthenticated } = useContext(UserContext);

    const [feed, setFeed] = useState('myPosts');

    useEffect(() => {
        getUser(username)
            .then((data) => {
                setUser(data);
                setPosts(data.userPosts)
                isAuthenticated && data.followers.includes(decodedUser._id) ? setIsFollowing(true) : setIsFollowing(false);
                if (decodedUser) {
                    data._id === decodedUser._id ? setIsOwner(true) : setIsOwner(false);
                }
                setIsLoading(false);
                setHasError(false);
                document.title=`${data.firstName} ${data.lastName}`;
            }).catch((err) => {
                setIsLoading(false);
                document.title="Profile";
                setHasError(true);
            })
    }, [username]);

    useEffect(() => {
        if (feed === 'liked') {
            setIsPostsLoading(true);
            getLikedPosts(decodedUser._id)
                .then((data) => {
                    setPosts(data);
                    setIsPostsLoading(false);
                }).catch((err) => {
                    setIsPostsLoading(false);
                })
        } else if (feed === "myPosts") {
            setPosts(user?.userPosts);
        }
    }, [feed])

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
            {!isLoading && hasError && <Error />}
            {!isLoading && !hasError && <div className={styles["main"]}>
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
                                    <FontAwesomeIcon  onClick={() => navigate('/account/settings')} className={styles['settings']} icon={faGear} />
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
                <div className={styles['choose-feed-component']}>
                    <ChooseFeed checkOwner={true} ownerId={user._id} isLoading={isPostsLoading} feed={feed} setFeed={setFeed} valueOne={decodedUser?._id === user._id ? "My Posts" : `${user.username}'s Posts`} valueTwo={'Liked'} stateOne={'myPosts'} stateTwo={'liked'} />
                </div>
                {!isPostsLoading && <div className={styles['post-list-component']}>
                    <PostList posts={posts} />
                </div>}
                {isPostsLoading && <><div className={styles[['loader-div']]}>
                    <GlobalSpinner />
                </div></>}

            </div>}
        </>
    )
}