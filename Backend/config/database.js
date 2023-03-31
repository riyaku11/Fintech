const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const connectDatabase=  ()=>{
    mongoose.connect("mongodb://127.0.0.1:27017/fintech",{useNewUrlParser:true, useUnifiedTopology:true}).then((data)=>{
        console.log("connected to mongodb successfully !");
        console.log(`mongodb connected with server : ${data.connection.host}`);
    })
    
} 


module.exports = connectDatabase;