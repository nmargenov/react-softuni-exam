import { useContext, useEffect, useState } from "react";
import { CreatePost } from "./CreatePost/CreatePost";
import styles from './feed.module.css';
import { getAllPosts, getFollowingPosts } from "../../services/postService";
import { PostList } from "./PostList/PostList";
import { UserContext } from "../../contexts/AuthContext";
import { GlobalSpinner } from "../Spinners/GlobalSpinner/GlobalSpinner";
import { ChooseFeed } from "./ChooseFeed/ChooseFeed";

export const Feed = () => {

    const { isAuthenticated } = useContext(UserContext);

    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [feed, setFeed] = useState('explore');
    const [hasError, setHasError] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        if(feed=="explore"){
            getAllPosts()
                .then((data) => {
                    setPosts(data);
                    setIsLoading(false);
                    setHasError(false);
                }).catch((err) => {
                    setIsLoading(false);
                    setHasError(true);
                });
        }
        if(feed=="following"){
            getFollowingPosts()
                .then((data)=>{
                    setPosts(data);
                    setIsLoading(false);
                    setHasError(false);
                }).catch((err)=>{
                    setIsLoading(false);
                    setHasError(true);
                })
        }
    }, [feed]);
    return (
        <div className={styles['feed-main']}>
            {isAuthenticated &&
                <div className={styles['create-post-component']} >
                    <CreatePost hasError={hasError} isPostsLoading={isLoading} setPosts={setPosts} />
                </div>}
            <div className={styles['choose-feed-component']}>
                <ChooseFeed isLoading={isLoading} feed={feed} setFeed={setFeed} />
            </div>
            {!isLoading && <div className={styles['post-list-component']}>
                <PostList hasError={hasError} posts={posts} />
            </div>}
            {isLoading && <><div className={styles[['loader-div']]}>
                <GlobalSpinner />
            </div></>}
        </div>
    );
}