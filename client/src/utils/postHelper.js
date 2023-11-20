export function timeAgo(date) {
    const now = new Date();
    const timestamp = new Date(date);
    const diff = Math.abs(now.getTime() - timestamp.getTime());
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) {
        return 'Just now';
    } else if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (minutes < 1440) {
        const hours = Math.floor(minutes / 60);
        return `${hours} hours ago`;
    } else {
        const days = Math.floor(minutes / 1440);
        return `${days} days ago`;
    }
}

export function isEdited(createdAt, lastEditedAt) {
    const createdDate = new Date(createdAt);
    const editedDate = new Date(lastEditedAt);

    return createdDate.getTime() !== editedDate.getTime();
}
