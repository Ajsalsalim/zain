const isadminlogin = async(req,res,next)=>{
    try{
        if(req.session.adminlogged){
            next();
        }else{
            res.redirect("/admin")

        }

    }catch(error){

    }

}

const isadminlogout = async(req,res,next)=>{
    try{
        if(req.session.adminlogged){

            res.redirect("/admin/showproduct")
        }else{
           
            next();
        }
    }  catch(error){
        console.log(error);
    }
}

module.exports={
    isadminlogin,
    isadminlogout
}
