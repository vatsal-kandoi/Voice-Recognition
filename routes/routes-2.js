const {db}=require('../db/database.js');

exports.getDash=function(req,res){
    db.getData(req.body.name).then(function(docs){
        var send=[];
        for(var i=0;i<docs.memos.length;i++){
            send.push(docs.memos[i].memoname)
        }
        res.status(200).send({code:"OK",resp:send});
    }).catch(function(err){
        res.status(500).send({code:500,resp:"Error"});
    });
}
exports.addMemo=function(req,res){
    db.handleAdd(req.body.name,{memoname:req.body.memoname,data:req.body.memodata}).then(function(result){
        if(result!=null){
            res.status(200).send({code:"OK"});
        } else{
            return db.handleEdit(req.body.name,{memoname:req.body.memoname,data:req.body.memodata})
        }
    }).then(function(docs){
        if(docs==null){
            res.status(500).send({code:"Error"});    
        } else{
            if(docs.n==0){
                res.status(404).send({code:"Not found"});    
            } else if(docs.nModified==0){
                res.status(500).send({code:"Error"});
            } else{
                res.status(200).send({code:"OK"});
            }
        }
    }).catch(function(err){
        console.log(err);
        res.status(500).send({code:"Error"});
    });
}
exports.getMemo=function(req,res){
    db.getMemo(req.body.name,req.body.memoname).then(function(docs){
        if(docs==null){
            res.status(404).send({code:"Not found"});
        }else{
            console.log(docs);
            if(docs==null){
                res.status(404).send({code:"Not found"});
            } else{
                res.status(200).send({code:"OK",memo:docs});
            }
        }
    }).catch(function(err){
        console.log(err);
        res.status(500).send({code:"Error"});
    })

}

exports.deleteMemo=function(req,res){
    db.handleDelete(req.body.name,req.body.memoname).then(function(docs){
        if(docs==null){
            res.status(404).send({code:"Not found"});
        } else{
            res.status(200).send({code:"OK"});
        }
    }).catch(function(err){
        res.status(500).send({code:"Error"});
    })
}