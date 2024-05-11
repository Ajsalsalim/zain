const express = require("express");
const multer = require("multer");
const {initializeApp} = require("firebase/app");
const config= require("../config/firebase.config")
const adminroute = express();
const session = require("express-session");

initializeApp(config.firebaseConfig);


const upload = multer({ storage: multer.memoryStorage() });

const admincontroller=require("../controllers/admincontroller");
const adminloginauth = require("../middlewares/loginauth")



adminroute.use(session({
    secret:process.env.ADMIN_SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60*24*7
    }
}))

adminroute.set("view engine","ejs");
adminroute.set("views","./views/admin");

adminroute.get("/",adminloginauth.isadminlogout,admincontroller.adminlogin);
adminroute.post("/", admincontroller.verifylogin);
adminroute.get("/addcategory",adminloginauth.isadminlogin,admincontroller.addcategorypage);
adminroute.post("/addcategory", adminloginauth.isadminlogin,upload.single("categorypic"), admincontroller.addcategory);
adminroute.get("/showcategory",adminloginauth.isadminlogin,admincontroller.showcategorypage)
adminroute.post("/editcategory",adminloginauth.isadminlogin,upload.single("categorypic"),admincontroller.editcategory);
adminroute.get("/deletecategory",adminloginauth.isadminlogin,admincontroller.deletecategory);
adminroute.get("/addproduct", adminloginauth.isadminlogin,admincontroller.addproductpage);
adminroute.post("/addproduct", adminloginauth.isadminlogin,upload.single("productpic"), admincontroller.addproduct)
adminroute.get("/showproduct",adminloginauth.isadminlogin,admincontroller.showproductpage)
adminroute.post("/editproduct",adminloginauth.isadminlogin,upload.single("productpic"),admincontroller.editproduct);
adminroute.get("/deleteproduct",adminloginauth.isadminlogin,admincontroller.deleteproduct);
adminroute.get("/logout",adminloginauth.isadminlogin,admincontroller.adminlogout)

adminroute.get('*',(req,res)=>{
    res.redirect('/admin');
});


module.exports=adminroute