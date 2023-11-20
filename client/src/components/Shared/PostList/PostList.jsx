import { Error } from "../../Error/Error";
import { PostItem } from "./PostItem/PostItem";
import styles from './postList.module.css';

export const PostList = ({ hasError, posts }) => {
    return (
        <>
            {hasError && <Error />}
            {!hasError && <>
                {posts.length == 0 && <div className={styles['no-posts']}>
                    <h1>No posts yet. Please check again later!</h1>
                </div>}
                {posts.length > 0 && posts.map((p) => <PostItem key={p._id} {...p} />)}
            </>}
        </>
    );
}

