import styles from './addComment.module.css';

export const AddComment = () => {
    return (
        <div className={styles['add-comment-container']}>
            <div className={styles['comment']}>
                <textarea placeholder='Write your comment here...'></textarea>
            </div>
            <div className={styles['uoload']}>
                <button>Comment</button>                
            </div>
        </div>
    );
}

/*<div class="container">
    <div *ngIf="isCreating" class="loader">
        <app-spinner/>
    </div>
    <ng-container *ngIf="!isCreating">
        <div *ngIf="errorMsg" class="error-div">
            <span class="errorMsg">{{errorMsg}}</span>
          </div>
        <div class="comment">
            <textarea (keyup.enter)="onSubmit()" [(ngModel)]="comment" placeholder="Write your comment here..." name="comment" id="" cols="30"
                rows="10"></textarea>
        </div>
        <div class="upload">
            <button (click)="onSubmit()">Comment</button>
        </div>
    </ng-container>
</div>*/