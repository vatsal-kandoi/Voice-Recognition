const mongoose = require('mongoose');

var Schema=mongoose.Schema;
var userSchema=new Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    memos:[
        {
            memoname:{
                type:String
            },
            data:{
                type:String,
            }
        },
    ]
});
var user=mongoose.model('user',userSchema);

require('dotenv').config();

exports.config=function(){
    mongoose.connect(process.env.PRODURL || "mongodb://localhost:27017/SIG");
}

exports.db={
    handleEdit:function(name,data){
        return user.findOneAndUpdate({$and:[{name:name},{"memos.memoname":data.memoname}]},{$set:{"memos.$.data":data.data}});
    },
    handleAdd:function(name,data){
        return user.findOneAndUpdate({$and:[{name:name},{"memos.memoname":{$ne:data.memoname}}]},{$push:{memos:data}},{new:true});
    },
    handleDelete:function(name,memoname){
        return user.findOneAndUpdate({$and:[{name:name},{"memos.memoname":memoname}]},{$pull:{memos:{memoname:memoname}}},{new:true});
    },
    getData:function(name){
        return user.findOne({name:name});
    },
    getMemo:function(name,memo){
        return user.findOne({$and:[{name:name},{"memos.memoname":memo}]});    
    },
    handleSignup:function(name){
        return user.create({name:name,memos:[]});
    }  
}


