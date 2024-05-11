const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    price:{
        type:Number
    },
    stock:{
        type:Number
    },
    image:{
        type:String,
        required:true
    },
    region:{
        type:String,
        required:true
    },
    brand:[String],
    
    isDeleted:{
        type:Boolean,
        default:false
    },
    isAvailable:{
        type:Boolean,
        default:true
    }


},{timestamps:true})

module.exports= mongoose.model("product",productSchema)