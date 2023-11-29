# Explanation of the front-end
The project is a simple social media based application. Every user can make an account. Each user can have their own profile picture and profile information(biography). Once a user is registered, they can write posts and comments on each post. The post can be only text(description) or include a photo. Each comment includes only text(description). If the user is not logged-in they can only read posts/comments and view user's profiles.

# Pages explanation 
There are Feed - Login - Register - Logout - Profile - Post details - Account settings pages - Reset password - Searchbar.

# Feed Page
## Logged-out users
Logged out users will only see the explore functionality. There will be all posts written on the site. If there are no posts it will show that there are no posts yet.
## logged-in users
Logged in users will see the options to write a post and to change the feed from Explore to Following. Write post is simple - The user can write a text post only or attach a photo as well. The explore functionality is the same as the logged-out explore functionality. The Following state will show only posts from users that the logged-in user is following. If there are no posts it will show that there are no posts yet.

# Profile Page
## logged-out users
The user will only be able to see the profile's profile picture, username, total posts, total followers, total following, full name, biography and a list of profile's owner posts.
## Logged-in and not owner of the account
The user will be able to see all of the above, but now there is a option to follow/unfollow.
## Logged-in and owner of the account
The user will be able to see all of the above, but now instead of follow/unfollow functionality, there is a edit profile button that will redirect to the settings page. There is also a liked state that will change the posts from my posts to the liked posts.

# Login - Register and Logout pages
They simply implements the auth logic.

# Post details
You will see the post and all the comments. You can also like/unlike a post.
## Comments and like (for logged-in users)
If you are logged-in user you can write a comment and like/unlike(if already liked) the post. You can comment and like every post, regardless if it's the post is made by you or not.
## Edit/delete post and comment (for logged-in users and owner of the post/comment)
You can edit or delete the post or the comment if it's yours.

# Account settings
You can change all of your information there. Also changing the profile picture happens there.

# Reset password
## Forgot password
You will be asked for username email and birthdate, if the 3 match an account you will recieve an email with a link to reset the password, valid for the next 24h.
## Reset password
You can type the new password twice and if the link is valid you will change the password.

# Searchbar
Each search will list all of the users whose username, first name or last name start with the searched string.
