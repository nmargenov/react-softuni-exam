const { login, register, getUser, follow, removeExistingImage, editPublicProfileData, editPrivateProfileData, editPassword, searchUsers, jwtResetPassword, resetPassword } = require('../managers/userManager');
const { mustBeGuest, mustBeAuth } = require('../middlewares/authMiddlewares');
const { formatErrorMessage } = require('../utils/errorHandler');
const nodemailer = require('nodemailer');

const router = require('express').Router();

const paths = {
    register: '/register',
    login: '/login',
    user: '/:username',
    follow: '/follow',
    publicData: '/publicData/:userId',
    removeExistingImage: '/image/:userId',
    privateData: '/privateData/:userId',
    password: '/password/:userId',
    search: '/search/:search',
    forgotPassword: '/forgotPassword',
    resetPassword:'/resetPassword'
}

router.post(paths.register, mustBeGuest, async (req, res) => {
    try {
        const username = req.body.username?.trim();
        const lastName = req.body.lastName?.trim();
        const firstName = req.body.firstName?.trim();
        const password = req.body.password?.trim();
        const rePassword = req.body.rePassword?.trim();
        const email = req.body.email?.trim();
        const birthdate = req.body.birthdate?.trim();
        const token = await register(username, firstName, lastName, rePassword, password, email, birthdate);
        res.status(201).json(token);
    } catch (err) {
        const error = formatErrorMessage(err);
        res.status(400).send({ message: error });
    }
});

router.post(paths.login, mustBeGuest, async (req, res) => {
    try {
        const username = req.body.username?.trim();
        const password = req.body.password?.trim();
        const token = await login(username, password);
        res.status(200).json(token);
    } catch (err) {
        const error = formatErrorMessage(err);
        res.status(400).send({ message: error });
    }
});

router.get(paths.user, async (req, res) => {
    try {
        const username = req.params.username;
        const user = await getUser(username);
        if (!user) {
            throw new Error("Not Found!");
        }
        res.status(200).json(user);
    } catch (err) {
        const error = formatErrorMessage(err);
        res.status(404).send({ message: error });
    }
});

router.post(paths.follow, mustBeAuth, async (req, res) => {
    try {
        const userToFollow = req.body.userToFollow;
        const userId = req.body.userId;
        const user = await follow(userToFollow, userId);
        res.status(200).json(user);
    } catch (err) {
        const error = formatErrorMessage(err);
        res.status(400).send({ message: error });
    }
});

router.patch(paths.publicData, mustBeAuth, async (req, res) => {
    try {
        const userId = req.params.userId;
        const loggedInUser = req.user._id;
        if(userId!=loggedInUser){
            throw new Error("Unautorized!");
        }
        const token = await editPublicProfileData(req,res,userId);
        res.status(200).json(token);

    } catch (err) {
        const error = formatErrorMessage(err);
        res.status(400).send({ message: error });
    }
});

router.delete(paths.removeExistingImage,mustBeAuth,async(req,res)=>{
    try{
        const userId = req.params.userId;
        const loggedInUser = req.user._id;
        if(userId!=loggedInUser){
            throw new Error("Unautorized!");
        }
        const token = await removeExistingImage(userId);
        res.status(200).json(token);
    }catch(err){
        const error = formatErrorMessage(err);
        res.status(400).send({message:error})
    }
});

router.patch(paths.privateData,mustBeAuth,async(req,res)=>{
    try{
        const userId = req.params.userId;
        const loggedInUser = req.user._id;
        if(userId!=loggedInUser){
            throw new Error("Unautorized!");
        }
        const email = req.body.email?.trim();
        const birthdate = req.body.birthdate?.trim();
        const token = await editPrivateProfileData(email,birthdate,userId,loggedInUser);
        res.status(200).json(token);
    }catch(err){
        const error = formatErrorMessage(err);
        res.status(400).send({ message: error});
    }
});

router.patch(paths.password,mustBeAuth,async(req,res)=>{
    try{
        const userId = req.params.userId;
        const loggedInUser = req.user._id;
        if(userId!=loggedInUser){
            throw new Error("Unautorized!");
        }
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const newRePassword = req.body.newRePassword;
        const token = await editPassword(oldPassword,newPassword,newRePassword,userId);
        res.status(200).json(token);
    }catch(err){
        const error = formatErrorMessage(err);
        res.status(400).send({message:error})
    }
});

router.get(paths.search,async(req,res)=>{
    try{
        const search = req.params.search;
        if(!search){
            throw new Error("Search is required!");
        }
        const users = await searchUsers(search);
        res.status(200).json(users);
    }catch(err){
        const error = formatErrorMessage(err);
        res.status(400).send({message:error})
    }
});

router.post(paths.forgotPassword, mustBeGuest, async (req, res) => {
    try {
        const username = req.body.username?.trim();
        const birthdate = req.body.birthdate?.trim();
        const email = req.body.email?.trim();
        const token = await jwtResetPassword(username, email, birthdate);
        const mailOptions = {
            from: 'nikolay_margenov@abv.bg',
            to: email,
            subject: "Reset Password",
            text: `Your link for resseting password is http://10.0.0.157:5173/resetPassword?t=${token} and is valid for only 24 hours! If you want to reset the password after the time has passed you need to generate a new link.`
        }
        await transporter.sendMail(mailOptions);
        res.status(200).send({message:'ok'});
    } catch (err) {
        res.status(400).send({message:err.message});
    }
});


router.post(paths.resetPassword,mustBeGuest,async(req,res)=>{
    try{
        const token = req.body.token?.trim();
        const newPassword = req.body.newPassword?.trim();
        const reNewPassword = req.body.reNewPassword?.trim();
        await resetPassword(token,newPassword,reNewPassword);
        res.status(201).send({message:'ok'})
    }catch(err){
        res.status(400).send({message:err.message})
    }
});

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,   
    auth: {
        user: 'niki.margenov@gmail.com',
        pass: 'iypw ujxh dvcn wqhs'
    }
});
module.exports = router;