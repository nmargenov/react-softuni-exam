const { verify } = require("../utils/jwt");

const SECRET = process.env.SECRET;
const AUTH_COOKIE = process.env.AUTH_COOKIE;

exports.auth = async (req, res, next) => {
    const token = req.headers[AUTH_COOKIE];
    if (token) {
        try {
            const decodedToken = await verify(token, SECRET);

            req.user=decodedToken;
            res.isLogged = true;
            res.locals.isLogged = true;
            res.locals.user = decodedToken;
            
            next();
        } catch (err) {
            res.status(409).send({ message: "Invalid authorization token!" });
        }

    } else {
        next();
    }
};

exports.mustBeAuth = (req,res,next)=>{
    try{
        if(!req.user){
            throw new Error('Unauthorized!');
        }else{
            next();
        }
    }catch(err){
        res.status(401).send({message:err.message});
    }
}

exports.mustBeGuest = (req,res,next)=>{
    try{
        if(req.user){
            throw new Error('Forbidden!');
        }else{
            next();
        }
    }catch(err){
        res.status(403).send({message:err.message});
    }
}