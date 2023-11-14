const { MongooseError, default: mongoose } = require('mongoose');

exports.formatErrorMessage=(err)=> {
    let error = "";
    if (err instanceof MongooseError) {
        if(!err.errors || err.errors.length==0){
            error='Unknown error!';
        }
        else{
            error = Object.values(err.errors)[0].message;
        }
    } else {
        error = err.message;
    }
    return error;
}