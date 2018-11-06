const jwt=require('jsonwebtoken');
require('dotenv').config();

exports.authorise=function(req,res,next){
    if(req.cookies['Authorization']==undefined){
        console.log('No cookie')
        res.status(401).send({code:'Unauthorised'});
    } else{
        jwt.verify(req.cookies['Authorization'],process.env.SECRET,function(err,decoded){
            if(err){
                console.log(err);
                res.status(401).send({code:'Unauthorised'});
            } else{
                req.body.name=decoded.name;
                next();
            }
        })
    }
}