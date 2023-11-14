# Explanation
The REST API is made by me using express. I'm using mongoose for database, bcrypt for hashing the password, jsonwebtoken for authorization, multer for storing the pictures.

# Database
You need mongoDB installed on the machine that runs the application. If you want ot use another URI you can change it in the config.js file. There is a DATABASE_NAME that is 'angular-softuni-exam' by default. You can change it there aswell.

# JWT
The back-end returns a JWT on login and register. The JWT contains the user's _id, username, first name, last name, email, birthdate, bio and profilePicture(profile picture aswell as the posts pictures are explain below). There is no password by any form(hashed or pure) in the JWT for safety reasons.

# Multer
I'm using multer for storing the pictures. Profile pictures will be stored in the src/profilePictures and the post images will be stored in the src/postImages. Make sure both folders exist or the rest API wont work! Be creating a new user(registration) you have a default profile picture that is defaultUser.png. You can change your profile picture later in the application. If you change your profile picture the old one will be removed from the profilePictures folder. The code will check if the old picture is the defaultUser.png and if so it will not remove it from the folder! The post image change will also remove the old photo from the folder.

# How are pictures saved in the database
Im saving it as a buffer that contains the link to the existing photo. For example the buffer will be 'src/profilePicture/defaultUser.png'. Then by decoding it in the front-end i can make a request to the image and get it.