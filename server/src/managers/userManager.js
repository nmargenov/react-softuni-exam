const User = require("../models/User");
const fs = require('fs');

const bcrypt = require('bcrypt');
const { sign, verify } = require("../utils/jwt");
const { editPublicProfileData, deleteImage } = require("./pictureManager");

const SECRET = process.env.SECRET;
const RESET_SECRET = process.env.RESET_SECRET;


exports.register = async (username, firstName, lastName, password, rePassword, email, birthdate) => {
    if (!password) {
        throw new Error("Password is required!");
    }
    if (password != rePassword) {
        throw new Error("Passwords don't match!");
    }

    if (password?.length < 6 || password?.length > 20) {
        throw new Error("Password must be at between 6 and 20 characters long!");
    }

    const year = birthdate?.split('-')[0];
    const isValidBirthdate = Number(year) >= 1900 && Number(year) <= 2023;

    if (!isValidBirthdate) {
        throw new Error('Birthdate must be between year 1900 and 2023!');
    }

    const existingUsername = await User.findOne({ username: username.toLowerCase() });

    if (existingUsername) {
        throw new Error("Username is already in use!");
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });

    if (existingEmail) {
        throw new Error("Email is already in use!");
    }

    const bcryptPass = await bcrypt.hash(password, 10);

    const user = {
        username: username.toLowerCase(),
        firstName,
        lastName,
        password: bcryptPass,
        email: email.toLowerCase(),
        birthdate,
        bio: '',
        profilePicture: {
            data: `https://storage.googleapis.com/my-app-photos-bucket/profilePictures/defaultUser.png`,
            contentType: 'image/png'
        }
    };

    const newUser = await User.create(user);

    const token = returnToken(newUser);
    return token;
}

exports.login = async (username, password) => {
    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
        throw new Error('Username or password don\'t match!');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new Error('Username or password don\'t match!');
    }

    const token = returnToken(user);
    return token;
};

exports.getUser = async (username) => {
    const user = await User.findOne({ username }).select('-password').populate('userPosts').populate({ path: 'userPosts', populate: { path: 'owner', select: '-password' } });
    const userObject = user.toObject();
    userObject.userPosts = user.userPosts;
    userObject.profilePicture = user.profilePicture;
    return userObject;
};

exports.follow = async (userToFollow, userId) => {
    const user = await User.findOne({ username: userToFollow });
    const userToFollowId = user._id;

    isFollowing = false;
    if (checkIfUserIsFollowing(user, userId)) {
        isFollowing = true;
    }

    let result;
    if (!isFollowing) {
        result = await Promise.all([
            User.findByIdAndUpdate(userToFollowId, { $push: { followers: userId } }, { new: true }).select('-password').populate('userPosts').populate({ path: 'userPosts', populate: { path: 'owner', select: '-password' } }),
            User.findByIdAndUpdate(userId, { $push: { following: userToFollowId } }, { new: true }).select('-password')
        ]);
    }
    if (isFollowing) {
        result = await Promise.all([
            User.findByIdAndUpdate(userToFollowId, { $pull: { followers: userId } }, { new: true }).select('-password').populate('userPosts').populate({ path: 'userPosts', populate: { path: 'owner', select: '-password' } }),
            User.findByIdAndUpdate(userId, { $pull: { following: userToFollowId } }, { new: true }).select('-password')
        ]);
    }
    const userObject = result[0].toObject();
    userObject.userPosts = result[0].userPosts;
    userObject.profilePicture = result[0].profilePicture;
    return userObject;
};

exports.editPublicProfileData = async (req, res, userId) => {
    const { image, bio, firstName, lastName, username } = await editPublicProfileData(req, res);
    const existingUsername = await User.findOne({ username: username.toLowerCase() });
    if (existingUsername && existingUsername._id != userId) {
        throw new Error("Username is already in use!");
    }
    const user = await User.findById(userId);
    const newData = {};
    if (image) {
        newData.profilePicture = {
            data: image,
            contentType: 'image/png'
        }
        if (user.profilePicture) {
            const oldPicturePath = user.profilePicture.data.toString().replace(/\\/g, '/');
            if (oldPicturePath !== 'https://storage.googleapis.com/my-app-photos-bucket/profilePictures/defaultUser.png') {
                const objectPath = extractObjectPathFromUrl(user.profilePicture.data.toString());
                await deleteImage(objectPath);
            }
        }
    }
    if (!bio) {
        newData.bio = "";
    } else {
        newData.bio = bio
    }
    newData.username = username.toLowerCase();
    newData.firstName = firstName;
    newData.lastName = lastName;

    const updatedUser = await User.findByIdAndUpdate(userId, newData, { runValidators: true, new: true }).select('-password');

    const token = returnToken(updatedUser);
    return token;
};

exports.removeExistingImage = async (userId) => {
    const user = await User.findById(userId);
    const oldPicturePath = user.profilePicture.data.toString().replace(/\\/g, '/');
    if (oldPicturePath !== 'https://storage.googleapis.com/my-app-photos-bucket/profilePictures/defaultUser.png') {
        const objectPath = extractObjectPathFromUrl(user.profilePicture.data.toString());
        await deleteImage(objectPath);
    }
    const updatedUser = await User.findByIdAndUpdate(userId, {
        profilePicture: {
            data: `https://storage.googleapis.com/my-app-photos-bucket/profilePictures/defaultUser.png`,
            contentType: 'image/png'
        }
    }, { runValidators: true, new: true });
    const token = returnToken(updatedUser);
    return token;
};

exports.editPrivateProfileData = async (email, birthdate, userId, loggedInUser) => {
    const existingEmail = await User.findOne({ email: email.toLowerCase() });

    if (existingEmail && existingEmail._id != loggedInUser) {
        throw new Error("Email is in use already!");
    }

    const year = birthdate?.split('-')[0];
    const isValidBirthdate = Number(year) >= 1900 && Number(year) <= 2023;

    if (!isValidBirthdate) {
        throw new Error('Birthdate must be between year 1900 and 2023!');
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { email: email.toLowerCase(), birthdate }, { runValidators: true, new: true }).select('-password');

    const token = returnToken(updatedUser);
    return token;
};

exports.editPassword = async (oldPassword, newPassword, newRepassword, userId) => {
    if (!newPassword) {
        throw new Error("New password is required!");
    }

    if (newPassword !== newRepassword) {
        throw new Error("New passwords do not match!");
    }

    if (newPassword?.length < 6 || newPassword?.length > 20) {
        throw new Error("Password must be at between 6 and 20 characters long!");
    }
    const user = await User.findById(userId);

    const isValid = await bcrypt.compare(oldPassword, user.password);

    if (!isValid) {
        throw new Error("Old password do not match!");
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findByIdAndUpdate(userId, { password: newHashedPassword });

    const token = returnToken(updatedUser);
    return token;
};

exports.searchUsers = async (search) => {
    const regex = new RegExp(`^${search}`, 'i');

    const users = await User.find({
        $or: [
            { username: { $regex: regex } },
            { firstName: { $regex: regex } },
            { lastName: { $regex: regex } },
        ],
    }).select('-password').populate('userPosts');
    const objects = [];
    users.forEach(user => {
        const userObject = user.toObject();
        userObject.userPosts = user.userPosts;
        userObject.profilePicture = user.profilePicture;
        objects.push(userObject);
    });
    return objects;
}

exports.jwtResetPassword = async (username, email, birthdate) => {
    const user = await User.findOne({ username:username.toLowerCase() });

    if (!user || user.email !== email.toLowerCase() || user.birthdate !== birthdate) {
        throw new Error("Invalid data");
    }

    const token = await sign({ username }, RESET_SECRET, { expiresIn: '24h' });
    return token;
}

exports.resetPassword = async (token, newPassword, rePassword) => {
    try {
        if (newPassword !== rePassword) {
            throw new Error("Passwords do not match")
        }
        if (newPassword.length < 6) {
            throw new Error("Password must be at least 6 characters long!");
        }
        const verifiedToken = await verify(token, RESET_SECRET);
        const username = verifiedToken.username;

        const bcryptPass = await bcrypt.hash(newPassword, 10);
        await User.findOneAndUpdate({ username }, { password: bcryptPass });

        return null;
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new Error('The link has expired or is invalid! Please generate a new link and try again!');
        } else {
            throw err;
        }
    }
}
function extractObjectPathFromUrl(url) {
    const baseUrl = 'https://my-app-photos-bucket.storage.googleapis.com/';
    return url.replace(baseUrl, '');
}
async function returnToken(updatedUser) {
    const payload = {
        _id: updatedUser._id,
        username: updatedUser.username,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        birthdate: updatedUser.birthdate,
        bio: updatedUser.bio,
        profilePicture: updatedUser.profilePicture
    };
    const token = await sign(payload, SECRET, { expiresIn: '1h' });
    return token;
};



function checkIfUserIsFollowing(user, userId) {
    return user.followers?.map(u => u.toString()).includes(userId);
};
