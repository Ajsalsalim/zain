const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.DB_LOCAL_URL)
  .then(() => {
    console.log('Mongodb atlas database is connected');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const userroute = require("./routes/userrouter");
const adminroute= require("./routes/adminrouter")

const port =3000;

app.set("view engine","ejs");
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.use((req, res, next) => {
     res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
   
    next();
  });

app.use("/",userroute); 
app.use("/admin",adminroute)

app.listen(port,()=>{
    console.log(`server is running in ${port}`);
})
