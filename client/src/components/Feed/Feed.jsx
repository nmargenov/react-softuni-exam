import { CreatePost } from "./CreatePost/CreatePost";
import styles from './feed.module.css';

export const Feed = () =>{
    return(
        <div className={styles['feed-main']}>
            <CreatePost/>
        </div>
    );
}