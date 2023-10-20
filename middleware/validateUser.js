const jwt = require('jsonwebtoken');
const { body, validationResult, header } = require('express-validator');

function validateUser(req , res , next){
    
    let token = req.headers['token'];
    if(!token){
        res.status(400).json({error:"Please provide authorization token"});
    }
    try {
        const data =  jwt.verify(token, process.env.JWT_SECRET);
        req.userInfo = data;
    } catch (error) {
        console.log(error);
    } 
    next();
}

module.exports = validateUser;