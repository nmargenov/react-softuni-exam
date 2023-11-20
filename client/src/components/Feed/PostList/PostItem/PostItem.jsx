import { decodeBuffer } from '../../../../utils/imageHelper';
import { isEdited, timeAgo } from '../../../../utils/postHelper';
import styles from '../postList.module.css';

export const PostItem = ({ _id, description, image, likedBy,comments, owner, createdAt, lastEditedAt }) => {
    return (
        <div className={styles['item-container']}>
            <div className={styles['profile-image-div']}>
                <img className={styles['profile-image']} src={decodeBuffer(owner.profilePicture)} />
            </div>
            <div className={styles['main']}>
                <div className={styles['header']}>
                    <div className={styles['owner-name']}>
                        <p>{owner.firstName} {owner.lastName}</p>
                    </div>
                    <div className={styles['username-publish']}>
                        <div className={styles['owner-username']}>
                            <p>@{owner.username}</p>
                        </div>
                        <div className={styles['publish-time']}>
                            <p>{timeAgo(createdAt)}</p>
                        </div>
                    </div>
                    {isEdited(createdAt, lastEditedAt) && <div className={styles['edited']}>
                        <p>Edited</p>
                    </div>}
                </div>
                <div className={styles['content']}>
                    <p>{description}</p>
                    {image && <div className={styles['post-image']}>
                        <img className={styles['post-image']} src={decodeBuffer(image)} alt="" />
                    </div>}
                </div>
                <div className={styles['footer']}>
                    <div className={styles['likes']}>
                        <p>{likedBy.length} likes</p>
                    </div>
                    <div className={styles['comments']}>
                        <p>{comments.length} comments</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

/*/*<div *ngIf="posts!.length==0" class="no-posts">
    <h1>No posts yet. Please check again later!</h1>
</div>
<ng-container *ngIf="posts!.length>0">
    <div (click)="navigateToPost(post._id)" *ngFor="let post of posts" class="container">
        <div class="profile-image-div">
            <app-spinner *ngIf="isProfileImageLoading"/>
            <img [class.is-loading]="isProfileImageLoading" (load)="onProfileImageLoad()" (error)="onProfileImageLoad()" class="profile-image" [src]="decodeBuffer(post!.owner.profilePicture.data)" (click)="navigateToUserProfile(post.owner.username)">
        </div>
        <div class="main">
            <div class="header">
                <div (click)="navigateToUserProfile(post.owner.username)" class="owner-name">
                    <p>{{post.owner.firstName}} {{post.owner.lastName}}</p>
                </div>
                <div class="username-publish">
                    <div (click)="navigateToUserProfile(post.owner.username)"  class="owner-username">
                        <p>@{{post.owner.username}}</p>
                    </div>
                    <div class="publish-time">
                        <p>{{timeAgo(post.createdAt)}}</p>
                    </div>
                </div>
                <div *ngIf="isEdited(post!.createdAt,post!.lastEditedAt)" class="edited">
                    <p>Edited</p>
                    <i class="material-icons">edit</i>
                </div>
            </div>
            <div class="content">
                <p>{{post.description}}</p>
                <div *ngIf="post.image" class="post-image">
                    <app-spinner *ngIf="isLoadingImage"/>
                    <img [class.is-loading]="isLoadingImage" class="post-image" (error)="onImageLoad()"
                    (load)="onImageLoad()" [src]="decodeBuffer(post.image.data)">
                </div>
            </div>
            <div class="footer">
                <div class="likes">
                    <p>{{post.likedBy.length}} likes</p>
                </div>
                <div class="comments">
                    <p>{{post.comments.length}} comments</p>
                </div>
            </div>
        </div>
    </div>
</ng-container>*/