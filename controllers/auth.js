const {validationResult} = require('express-validator/check');
const bcrybt = require('bcryptjs');
const jwt  = require('jsonwebtoken');
const User = require('../models/user');


exports.signup = (req , res , next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        const error = new Error('validation failed!');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email    = req.body.email;
    const name     = req.body.name;
    const password = req.body.password; 
    bcrybt.hash(password,bcrybt.genSaltSync(12))
    .then(hashedPW => {
        const user = new User({
            email : email,
            name : name,
            password : hashedPW
        });
        return user.save();
    }).then(result => {
        res.status(201).json({message:'created!',userId:result._id});
    })
    .catch(err => {
        if(!err.statusCode)
        {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.login = (req,res,next)=>{
const email = req.body.email;
const password = req.body.email;
User
.findOne({email : email})
.then(user => {
    if(!user)
    {
        const error = new Error('A user with this email couldnt be found.');
        error.statusCode = 401;
        throw error;
    }
    loadedUser = user;
    return bcrybt.compare(password,loadedUser.password);
})
.then(isEqual => {
    console.log(isEqual);
    if(isEqual)
    {
        const error = new Error('invalid username or a password');
        error.statusCode = 401;
        throw error;
    }
    const token = jwt.sign({
        email : loadedUser.email,
        userId : loadedUser._id.toString()
    },
    'somesupersecertkeywordtoencrybtthistoken',
    {expiresIn : '1h'}
    );
    res.status(200).json({token:token,user:loadedUser});
})
.catch(err => {
    if(!err.statusCode)
    {
        err.statusCode = 500;
    }
    next(err);
});

};