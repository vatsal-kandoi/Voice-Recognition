const express=require('express');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const multiparty = require('connect-multiparty');

const jwt=require('jsonwebtoken');
const ejs=require('ejs')

const spawn=require('child_process').spawn;


require('dotenv').config();

const app=express();

const {authorise}=require('./authorise.js')
const fs=require('fs');
const {sendSignup}=require('./routes/routes-1.js')
const {getDash,addMemo,getMemo,editMemo,deleteMemo}=require('./routes/routes-2.js')

var multer  = require('multer')
var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./upload/")
    },
    filename:function (req,file,cb) {
        cb( null, req.query.name+".wav");
    }
})
var upload=multer({storage:storage});
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static('upload'));

app.get('/',function(req,res){
    console.log(req.cookies)
    if(req.cookies['Authorization']!=undefined){
        res.redirect('/dash')
    } else{
        res.sendFile(__dirname+'/views/index.html');
    }
    
});

//ADD VOICE
app.post('/signup',upload.single('input'),function(req,res){
    if(req.query.name==undefined){
        res.status(400).send({code:"Enter all details"});
    } else{
        var x='trainDataset '+req.query.name+'; exit;';
        getData=spawn('matlab',['-nodisplay', '-nosplash','-nojvm','-r',x]);
        getData.stdout.on('data',function(d){
            console.log(d.toString('utf-8'));
        });
        getData.on('close',function(d){
            sendSignup(req,res);
        })
    }
});

//VOICE
app.post('/login',upload.single('input'),function(req,res){
    getData=spawn('matlab',['-nodisplay', '-nosplash','-nojvm','-r', 'testset(); exit;']);
    getData.stdout.on('data',function(d){
        console.log(d.toString('utf-8'));
    });
    getData.stdout.on('close',function(d){
        var x=fs.readFileSync('./exp.txt');
        if(x=="NOMATCH"){
            res.status(404).send({code:"Error"});
        } else{
            jwt.sign(x,process.env.SECRET,function(err,token){
                res.cookie("Authorization",token,{httpOnly:true});
                res.status(200).send({code:"OK",name:x});
            })
        }
    });
    getData.stderr.on('error',function(d){
        console.log(d.toString('utf-8'));
        res.status(500).send({code:"Error"});
    })
});

app.get('/dash',authorise,function(req,res){
    res.sendFile(__dirname+'/views/dashboard.html');
})

//DONE
app.get('/dashboard',authorise,function(req,res){
    if(req.body.name==undefined){
        res.status(401).send({code:"Unauthorised"});
    } else{
        getDash(req,res);
    }
});

//DONE
app.post('/getmemo',authorise,function(req,res){
    if(req.body.name==undefined || req.body.memoname==undefined){
        res.status(400).send({code:'ERROR'});
    } else{
        getMemo(req,res);
    }
});

//DONE
app.post('/addmemo',authorise,function(req,res){
    if(req.body.memoname==undefined || req.body.memodata==undefined){
        res.status(400).send({code:'ERROR'});
    } else {
        addMemo(req,res)
    }
});

//DONE
app.post('/editmemo',authorise,function(req,res){
    if(req.body.memo.name==undefined || req.body.data=="" || req.body.memo.data==undefined || req.body.name==undefined){
        res.status(400).send({code:'ENTER'});
    } else {
        editMemo(req,res);
    }
});

//DONE
app.post('/deletememo',authorise,function(req,res){
    if(req.body.name==undefined || req.body.memoname==undefined){
        res.status(400).send({code:'ENTER'});
    } else {
        deleteMemo(req,res);
    }
});

app.get('/logout',authorise,function(req,res){
    console.log("logging out")
    res.clearCookie("Authorization");
    res.status(200).send({code:"OK"})
})

app.listen(3000);