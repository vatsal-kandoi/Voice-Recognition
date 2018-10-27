const jwt=require('jsonwebtoken');
require('dotenv').config();

const {config,db}=require('../db/database.js');
config();

exports.sendSignup=function(req,res){
    console.log(req.query.name)
    db.handleSignup(req.query.name).then(function(docs){
        jwt.sign({name:docs.name,timestamp:Date.now()},process.env.SECRET,function(err,token){
            if(err){
                res.status(500).send({code:"Error"});
            } else {
                res.cookie('Authorization',token,{httpOnly:true});
                console.log(token);
                res.status(200).send({code:"OK"});
            }
        });
    }).catch(function(err){
        console.log(err);
        if(err.code==11000){res.status(401).send({code:"Exists"});}
        else{res.status(500).send({code:"Error"});}
    });
}
    