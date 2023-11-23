import { decodeBuffer } from "../../../../utils/imageHelper"
import { isEdited, timeAgo } from "../../../../utils/postHelper"
import styles from "../commentList.module.css"

export const CommentItem = ({owner,comment,createdAt,lastEditedAt}) =>{
    return(
        <div className={styles['comments-component-container']}>
            <div className={styles['image-div']}>
              <img
                className={styles.image}
                src={decodeBuffer(owner?.profilePicture)}
                alt="profile"
                // onClick={() => navigateToUserProfile(comment.owner.username)}
              />
            </div>
            <div className={styles['comments-component-main']}>
              <div className={styles['comments-component-author-div']}>
                <div
                  className={styles['comments-component-author-name']}
                //   onClick={() => navigateToUserProfile(comment.owner.username)}
                >
                  <p>{`${owner.firstName} ${owner.lastName}`}</p>
                </div>
                <div
                  className={styles['comments-component-author-username']}
                //   onClick={() => navigateToUserProfile(comment.owner.username)}
                >
                  <p>@{owner.username}</p>
                </div>
                <div className={styles['comments-component-publish-time']}>
                  <p>{timeAgo(createdAt)}</p>
                </div>
                {isEdited(createdAt, lastEditedAt) && (
                  <div className={styles.edited}>
                    <p>Edited</p>
                    <i className={`material-icons ${styles.materialIcons}`}>edit</i>
                  </div>
                )}
                {/* {isOwner(comment._id) && !isDeleting[comment._id] && !editState[comment._id] && (
                  <div className={styles.actions}>
                    {!deleteState[comment._id] && (
                      <i onClick={() => onEdit(comment._id)} className={`material-icons ${styles.materialIcons}`}>edit</i>
                    )}
                    {!deleteState[comment._id] && (
                      <i onClick={() => onDelete(comment._id)} className={`material-icons ${styles.materialIcons}`}>delete</i>
                    )}
                    {deleteState[comment._id] && (
                      <>
                        <i onClick={() => onDeleteCancel(comment._id)} className={`material-icons ${styles.materialIcons}`}>cancel</i>
                        <i onClick={() => onDeleteAccept(comment._id)} className={`material-icons ${styles.materialIcons}`}>done</i>
                      </>
                    )}
                  </div>
                )} */}
              </div>
              <div className={styles['comment']}>
                <p>{comment}</p>
              </div>
            </div>
          </div>
    )
}