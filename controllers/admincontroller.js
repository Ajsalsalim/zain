
const Admin = require("../Models/adminmodel");
const Category = require("../Models/categorymodel")
const Product = require("../Models/productmodel")
const {giveCurrentDateTime} = require("./helpers/userhelpers")
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage")
const storage = getStorage();


const adminlogin = async(req,res)=>{

    try{
        if(!req.session.adminlogged){
            if(req.session.loggedout){
                const message= "please login again"
                res.render("adminlogin",{message})
    
            }
            res.render("adminlogin")
            
        }

    } catch(error){
        console.log(error)
    }
    

   



}

const verifylogin = async(req,res)=>{
    try{
        const name = req.body.name;
        const password = req.body.password;
    
        const adminData = await Admin.findOne({name:name,password:password});
        if(adminData){
            req.session.admin_id= adminData._id;
            req.session.adminlogged = true; 
            res.redirect("/admin/showproduct")
        }else{
            res.render("adminlogin",{message:"Email or password is incorrect"})
    
        }

    }catch(error){
        console.log(error.message);
    }

   
    
    
}

const addcategorypage = async(req,res)=>{
    res.render("addcategory",{message:false,error:false})

}

const addcategory = async(req,res)=>{
    try{
        const {name,description} = req.body;
        const dateTime = giveCurrentDateTime();

        const storageRef = ref(storage, `files/${req.file.originalname + "       " + dateTime}`);
     
        const metadata = {
            contentType: req.file.mimetype,
        };

        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        const newcategory = new Category({
            name:name.toLowerCase(),
            description:description.toLowerCase(),
            image:downloadURL

        })

        await newcategory.save();
        res.render("addcategory",{message:true,error:false});





    }catch(err){
        res.render("addcategory",{message:false,error:true})
    }
}

const showcategorypage = async(req,res)=>{

    try{
    const item_per_page =5;
    const message = req.query.message||false
    let page = parseInt(req.query.page)|| 1;
  

    const totalitems = await Category.countDocuments({isDeleted:false});
    const totalpages = Math.ceil(totalitems / item_per_page);
    page = Math.max(1,page);
    let categories = await Category.find({isDeleted:false})
                       .skip((page-1)*item_per_page)
                       .limit(item_per_page)
    if(totalitems!==categories&&categories.length===0){
        page = Math.max(1,page-1);
         categories = await Category.find({isDeleted:false})
                       .skip((page-1)*item_per_page)
                       .limit(item_per_page)
       
    }
    
    res.render("showcategories",{categories:categories,message,currentpage:page,totalpages,item_per_page})

    }catch(err){
        console.log(err);
    }
    

}

const editcategory = async(req,res)=>{
    try{
        console.log("hello");
  const {categoryid,categoryname,description} = req.body;
  let page= parseInt(req.query.currentpage);
  console.log(page);
  const category = await Category.findOne({_id:categoryid});
  category.name = categoryname;
  category.description = description
 
  if(req.file){
    const dateTime = giveCurrentDateTime();

    const storageRef = ref(storage, `files/${req.file.originalname + "       " + dateTime}`);
 
    const metadata = {
        contentType: req.file.mimetype,
    };

    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    category.image=downloadURL


  }
  await category.save();

  const item_per_page =5;
  
  const totalitems = await Category.countDocuments({isDeleted:false});
  const totalpages = Math.ceil(totalitems / item_per_page);
  let categories = await Category.find({isDeleted:false})
                     .skip((page-1)*item_per_page)
                     .limit(item_per_page)
 
  console.log(page);


  res.render("showcategories",{categories:categories,message:true,currentpage:page,totalpages,item_per_page})
       

    }catch(err){
     console.log(err);
    }
}
const deletecategory = async(req,res)=>{
    try{
        const {categoryid} = req.query;
        let page=req.query.currentpage;

        const category = await Category.findOne({_id:categoryid});
        category.isDeleted=true;
        await category.save();

  res.redirect(`/admin/showcategory?message=deleted&&page=${page}`)


    }catch(err){
        console.log(err);
    }
}

const addproductpage = async(req,res)=>{
    try{
        const categories = await Category.find({isDeleted:false})
    res.render("addproducts",{categories:categories,error:false,message:false})

    }catch(err){
        console.log(err);
    }
    
}
const addproduct = async(req,res)=>{
    const categories = await Category.find({isDeleted:false})
    try{  
      
        console.log(req.body);
        const {name , description, category, region, brands} = req.body;
         let brandarray =brands.split(",");
       
        const dateTime = giveCurrentDateTime();

        const storageRef = ref(storage, `files/${req.file.originalname + "       " + dateTime}`);
     
        const metadata = {
            contentType: req.file.mimetype,
        };

        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);

       const newproduct = new Product({
        name:name.toLowerCase(),
        description:description.toLowerCase(),
        category:category,
        region:region,
        brand:brandarray,
        image:downloadURL

       });
       await newproduct.save()
       res.render("addproducts",{categories:categories,message:true,error:false})
       
        

    }catch(err){
        console.log(err);
        res.render("addproducts",{message:false,error:true,categories:categories})
    }
}



const showproductpage = async(req,res)=>{
     
    let totalpages;
    let products;
    let totalitems;
    let filtercategory;
    let nondeletedcategory
    const search = req.query.search||"";
    var searchterm = search.toLowerCase();
    const category = req.query.categoryfilter||"all";
    
    const item_per_page =8;
    let page = parseInt(req.query.page)|| 1;
    console.log(page);
    const message = req.query.message||false

    if(search!==""){
        filtercategory= await Category.find({isDeleted:false}).select('name');
        nondeletedcategory = filtercategory.map(category => category.name);
        totalitems = await Product.countDocuments({isDeleted:false,category:{$in:nondeletedcategory},name:{ $regex: `^${searchterm}`, $options: 'i' }});
        page = Math.max(1,page);
        totalpages = Math.ceil(totalitems / item_per_page);
        products = await Product.find({isDeleted:false, category:{$in:nondeletedcategory},name: { $regex: `^${searchterm}`, $options: 'i' }})
                    .skip((page-1)*item_per_page)
                    .limit(item_per_page);

                    if(totalitems!==products&&products.length===0){
                      
                        page = Math.max(1,page-1);
                     
                         products = await Product.find({isDeleted:false, category:{$in:nondeletedcategory},name: { $regex: `^${searchterm}`, $options: 'i' }})  
                                      .skip((page-1)*item_per_page)
                                       .limit(item_per_page);
                                       console.log(products);
                }            
        
    }else{
            filtercategory= await Category.find({isDeleted:false}).select('name');
            nondeletedcategory = filtercategory.map(category => category.name);
        if(category==="all"){   
            page = Math.max(1,page);  
            totalitems = await Product.countDocuments({isDeleted:false,category:{$in:nondeletedcategory}});
            totalpages = Math.ceil(totalitems / item_per_page);
             products = await Product.find({isDeleted:false,category:{$in:nondeletedcategory}})
                              .skip((page-1)*item_per_page)
                              .limit(item_per_page)
           if(totalitems!==products&&products.length===0){
            page = Math.max(1,page-1);
                products = await Product.find({isDeleted:false,category:{$in:nondeletedcategory}})
                              .skip((page-1)*item_per_page)
                              .limit(item_per_page)
           }
       
            }
                else{  
               totalitems= await Product.countDocuments({isDeleted:false,category:category});
          
               if(totalitems===0){
                products = await Product.find({isDeleted:false,category:category})
               }else{
                totalpages = Math.ceil(totalitems / item_per_page);
                products = await Product.find({isDeleted:false,category:category})
                              .skip((page-1)*item_per_page)
                              .limit(item_per_page)
       
                              if(totalitems!==products&&products.length===0){
                               page=page-1;
                                products = await Product.find({isDeleted:false})
                                              .skip((page-1)*item_per_page)
                                              .limit(item_per_page)
                           }    

               }
               
            
            }

    }
    


   
    const categories = await Category.find({isDeleted:false})
    res.render("showproducts",{products:products,categories:categories,message,currentpage:page,totalpages,item_per_page,category,searchterm})
}

const editproduct = async(req,res)=>{
    try{
        console.log(req.body);
        const {productname , description, category, region,productid,brands} = req.body;
        const brandarray = brands.split(",")
        
        const page= req.query.currentpage;
        const categoryfilter= req.query.categoryfilter;
        const search = req.query.search||""
        console.log("hello"+search);
        console.log("hi"+categoryfilter);

        const products = await Product.findOne({_id:productid});
        const productbrands= products.brand
        const uniquebrandset = new Set([...productbrands,...brandarray]);
        const uniquebrandarray = Array.from(uniquebrandset)
        

        
        products.name = productname;
        products.description= description;
        products.category = category;
        products.region = region;
        products.brand= uniquebrandarray;


        if(req.file){
            const dateTime = giveCurrentDateTime();
        
            const storageRef = ref(storage, `files/${req.file.originalname + "       " + dateTime}`);
         
            const metadata = {
                contentType: req.file.mimetype,
            };
        
            const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
            const downloadURL = await getDownloadURL(snapshot.ref);
            products.image=downloadURL
        
        
          }

          
        await products.save();

        

        res.redirect(`/admin/showproduct?message=true&&page=${page}&&categoryfilter=${categoryfilter}&&search=${search}`)



    }catch(err){
        console.log(err);
    }
}
const deleteproduct = async(req,res)=>{
    try{
        const {productid,categoryfilter,currentpage,search} = req.query;
       

        const product = await Product.findOne({_id:productid});
        product.isDeleted=true;
        await product.save();
     
        res.redirect(`/admin/showproduct?message=deleted&&categoryfilter=${categoryfilter}&&page=${currentpage}&&search=${search}`)


    }catch(err){
        console.log(err);
    }
}


const adminlogout = async(req,res)=>{
    try{
        req.session.admin_id= null;
        req.session.adminlogged = false;
        req.session.loggedout = true // just for declare to give a message
        res.render("adminlogin")
    }catch(err){
        console.log(err);

    }
   
}

  

module.exports={
    adminlogin,
    addproductpage,
    addproduct,
    addcategorypage,
    addcategory,
    editcategory,
    deletecategory,
    showcategorypage,
    showproductpage,
    editproduct,
    deleteproduct,
    verifylogin,
    adminlogout
}