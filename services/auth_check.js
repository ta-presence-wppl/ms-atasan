var jwt = require('jsonwebtoken');
const {query, body, param,validationResult, header} = require('express-validator');

exports.checkAuth = (req, res, next)=>{
    var headers = req.headers;
    if(typeof headers['authorization']!=='undefined'){
        if(headers['authorization']){
            jwt.verify(headers['authorization'].split(";")[0], process.env.JWT_CONF_TOKEN, (err, decoded)=>{
                if(!err){
                    req.user_data=decoded;
                    return next();
                }else{
                    res.status(403).send({message:'Not Authorized'})
                }
            });
        }else{
            res.status(400).send({message:'Auth detected, but no token detected'})
        }
    }else{
        res.status(401).send({
            message:"Token Required"
        })
    }
}

exports.generateToken = (data)=>{
    return jwt.sign(data, process.env.JWT_CONF_TOKEN);
}