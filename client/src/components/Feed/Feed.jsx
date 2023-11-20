import { useContext, useEffect, useState } from "react";
import { CreatePost } from "./CreatePost/CreatePost";
import styles from './feed.module.css';
import { getAllPosts } from "../../services/postService";
import { PostList } from "./PostList/PostList";
import { UserContext } from "../../contexts/AuthContext";

export const Feed = () =>{

    const {isAuthenticated} = useContext(UserContext);

    const [posts,setPosts]=useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(()=>{
        setIsLoading(true);
        getAllPosts()
            .then((data)=>{
                setPosts(data);
                setIsLoading(false);
            }).catch((err)=>{
                setIsLoading(false);
            })
    },[]);
    return(
        <div className={styles['feed-main']}>
            {isAuthenticated && <CreatePost setPosts={setPosts}/>}
            <PostList posts={posts}/>
        </div>
    );
}