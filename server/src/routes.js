const router = require('express').Router();

const userController = require('./controllers/userController');
const postController = require('./controllers/postController');

const paths = {
    users:'/api/users',
    posts:'/api/posts',
}

router.use(paths.users,userController);
router.use(paths.posts,postController);

router.all('*',(req,res)=>{
    res.status(404).json({message: "Path not found!"});
});


module.exports = router;