const port = 5000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer"); //used for storing imgs
const path = require("path");//use backend directory using react
const cors = require("cors");
const { type } = require("os");

app.use(express.json())//whatever we request we get from resp will automatically passed by json
app.use(cors());//using this react prj will conn to 4000 port

//DB connection wih mongoDB
mongoose.connect("mongodb+srv://ifatkhan:dbkhan@cluster0.oivatcv.mongodb.net/e-commerce")

//API creation

app.get("/" , (req,res)=>{
    res.send("Express App is Running")
})

//img storage 
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

//creating api for image upload
app.use('/images', express.static('upload/images'));
app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});
  
//Schema,structure for creating products
const Product = mongoose.model("Product",{
    id:{
        type: Number,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    new_price:{
        type:Number,
        required: true,
    },
    old_price:{
        type:Number,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now,
    },
    available:{
        type: Boolean,
        default: true,
    },
})

app.post('/addproduct',async(req,res)=>{
    const product = new Product({
        id:req.body.id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
        date:req.body.date,
    });
    console.log(product);
    await product.save();
    console.log("Product Added Successfully");
    res.json({
        success: true,
        name: req.body.name,
    });
})

app.listen(port, (error) => {
    if (error) {
        console.log("Error: " + error);
    } else {
        console.log("Server Running on Port " + port);
    }
});