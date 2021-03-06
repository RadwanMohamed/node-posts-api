const jwt = require('jsonwebtoken');
module.exports = (req,res,next)=>{
    const authToken = req.get('Authorization');
    if(!authToken)
    {
        const error = new Error('unauthorized');
        error.statusCode = 401;
        throw error;
    }
    const token = authToken.split(' ')[1];
    let decodedToken = '';
    try{
        decodedToken = jwt.verify(token,'somesupersecertkeywordtoencrybtthistoken');
    }catch(err){
        err.statusCode = 500;
        throw err;
    }
    if(!decodedToken)
    {
        const error = new Error('unauthorized');
        error.statusCode = 401;
        throw error;   
    }
    req.userId = decodedToken.userId;
    next();
};