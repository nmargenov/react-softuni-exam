import { faCheck, faPen, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { decodeBuffer } from "../../../../utils/imageHelper"
import { isEdited, timeAgo } from "../../../../utils/postHelper"
import styles from "../commentList.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useState } from "react";
import { deleteComment } from "../../../../services/postService";
import { DetailsContext } from "../../../../contexts/DetailsContext";
import { SmallSpinner } from "../../../spinners/SmallSpinner";
import { UserContext } from "../../../../contexts/AuthContext";

export const CommentItem = ({ _id, owner, comment, createdAt, lastEditedAt }) => {

  const { post, setPost, isEditing, isDeleting, isCommenting, isDeletingComment: isDeletingGlobalComment, setIsDeletingComment: setIsDeletingGlobalComment } = useContext(DetailsContext);
  const { isAuthenticated, decodedUser } = useContext(UserContext);

  const [isDeletingComment, setIsDeletingComment] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  function onDeleteOpen() {
    setIsDeleteOpen(true);
  }

  function onDeleteClose() {
    setIsDeleteOpen(false);
  }

  function onDeleteAccept() {
    setIsDeletingComment(true);
    setIsDeletingGlobalComment(true);
    deleteComment(post._id, _id)
      .then((data) => {
        setPost(data);
        setIsDeletingComment(false);
        setIsDeletingGlobalComment(false);
      }).catch((err) => {
        setIsDeletingComment(false);
        setIsDeletingGlobalComment(false);
      })
  }

  function isOwner() {
    return owner._id === decodedUser._id;
  }

  return (
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
          {isAuthenticated && isOwner() && !isEditing && !isDeleting && !isCommenting && !isDeletingGlobalComment &&
            <div className={styles['comments-component-actions']}>
              {!isDeleteOpen && <><FontAwesomeIcon icon={faPen} />
                <FontAwesomeIcon onClick={onDeleteOpen} icon={faTrash} /></>}
              {isDeleteOpen && <>
                <FontAwesomeIcon onClick={onDeleteAccept} icon={faCheck} />
                <FontAwesomeIcon onClick={onDeleteClose} icon={faXmark} />
              </>}
            </div>}
          {isDeletingComment && <div className={styles['spinner-div']}>
            <SmallSpinner />
          </div>}
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