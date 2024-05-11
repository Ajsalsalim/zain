const express = require("express");
const userroute= express();

const usercontroller = require("../controllers/usercontroller")

userroute.set("view engine","ejs");
userroute.set("views","./views/user");



userroute.get("/",usercontroller.homepageload)
userroute.get("/products",usercontroller.productpageload);
userroute.get("/productbrands",usercontroller.productbrands)
userroute.get("/whatsapp-link",usercontroller.whatsapplink);
userroute.post("/send-gmail",usercontroller.sendgmail);
userroute.get("/about",usercontroller.aboutpageload)
userroute.get("/contact",usercontroller.contactpageload)





module.exports= userroute
