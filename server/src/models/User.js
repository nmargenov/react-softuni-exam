const mongoose = require('mongoose');

const emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
        minLength: [3, 'Username must be between 3 and 20 characters!'],
        maxLegnth: [20, 'Username must be between 3 and 20 characters!'],
    },
    firstName: {
        type: String,
        required: [true, 'First name is required!'],
        minLength: [2, 'First name must be between 2 and 30 characters!'],
        maxLegnth: [30, 'First Name must be between 2 and 30 characters!'],
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required!'],
        minLength: [2, 'Last name must be between 2 and 30 characters!'],
        maxLegnth: [30, 'Last name must be between 2 and 30 characters!'],
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        minLength: [3, 'Email must be between 3 and 50 characters!'],
        maxLegnth: [50, 'Email must be between 3 and 50 characters!'],
        validate: {
            validator: (value) => emailRegex.test(value),
            message: 'Invalid email format!',
        },
    },
    bio:{
        type:String,
        maxLegnth:[100,'Bio must not exceed 100 characters!'],
    },
    birthdate: {
        type: String,
        required: [true, 'Birthdate is required!'],
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
    },
    followers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    }],
    following:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    }],
    profilePicture: {
        data: {
            type: Buffer,
            required: [true, 'Profile picture data is required!'],
        },
        contentType: {
            type: String,
            required: [true, 'Profile picture content type is required!'],
        },
    }
});

userSchema.virtual('userPosts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'owner',
    options: {
        sort: { createdAt: -1 }
    }
  });
  

const User = mongoose.model('User', userSchema);

module.exports = User;