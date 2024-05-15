const category = require("../Models/categorymodel");
const product = require("../Models/productmodel");
const nodemailer = require('nodemailer');
const {generateWhatsAppLink} = require("./helpers/userhelpers");
const homepageload = async(req,res)=>{
   
    const categories = await category.find({isDeleted:false});

    
    res.render("Home",{categories:categories})


} 
const productpageload = async(req,res)=>{
    
    const categoryname = req.query.categoryname|| false;
    const categories = await category.find({isDeleted:false});
   
    
      const  products = await product.find({isDeleted:false});
      const  productbrands = await product.find({isDeleted:false}).distinct('brand').sort();
   
      console.log(productbrands);
      

      
        res.render("Product",{currentpage:"product",categories:categories,products:products,categoryname,productbrands}) 
   
}  
const productbrands = async(req,res)=>{
    try{
       const productname = req.query.productName;
       console.log(productname);
       const products = await product.findOne({name:productname})
       console.log("rgdgd"+products);
       if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(products);

    

    }
    catch(err){
        console.log(err);

    }
}

const whatsapplink =async(req,res)=>{
    try{
    const yourPhoneNumber = process.env.MY_PHONE_NUMBER; 
  
    const whatsappLink = generateWhatsAppLink(yourPhoneNumber);
    res.redirect(whatsappLink);

    }catch(err){
       console.log(err);
    }
}

const sendgmail = async(req,res)=>{
    try{
        let user_email = req.body.email;
        
        let user_message = req.body.message;

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL,
                pass: process.env.GMAIL_PASS
            }
        })

        let mailOptions = {
            from: user_email,
            to: process.env.GMAIL,
            replyTo: user_email,
            subject: 'New message from user',
            text: `Email: ${user_email}\nMessage: ${user_message}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.send('error');
            } else {
                console.log('Email sent: ' + info.response);
                res.render("Contact",{currentpage:"contact",success:true});
            }
        });






    }catch(err){
        console.log(err);
    }
}

const aboutpageload = async(req,res)=>{
   
    res.render("About",{currentpage:"about"})
}

const contactpageload = async(req,res)=>{
   
    res.render("Contact",{currentpage:"contact",success:false})
}
module.exports={
    homepageload,
    productpageload,
    productbrands,
    whatsapplink,
    sendgmail,
    aboutpageload,
    contactpageload
}
