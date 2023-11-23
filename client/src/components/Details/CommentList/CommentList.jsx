import { useContext } from "react"
import { CommentItem } from "./CommentItem/CommentItem"
import { DetailsContext } from "../../../contexts/DetailsContext"
import styles from './commentList.module.css'


export const CommentList = () => {

    const { post } = useContext(DetailsContext);
    return (
        <>
            {post.comments.length > 0 && <div className={styles['comments-component']}>
                {post.comments.map(c => <CommentItem key={c._id} {...c} />)}
            </div>}
            {post.comments.length === 0 &&
            <div>
                <h1>There are no comments yet.</h1>
            </div>}
        </>)
}