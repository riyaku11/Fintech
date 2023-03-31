const mongoose = require("mongoose");
const User = require("./userModel");

const GoldSchema = new mongoose.Schema({
    userId:{type: mongoose.Schema.ObjectId,
               required: true,
            ref:"User"},
    // entityUser:{type:mongoose.Schema.ObjectId,
    //             required: true,
    //          ref:"User"},
    quantity:{type:Number,
                required: true}, 
    amount:{type:Number,
               required: true}, 
    type:{type:String,
               required: true,
            enum:['CREDIT','DEBIT']}, 
    status:{type:String,
                  required:true,
                  enum:['FAILED','SUCCESS','WAITING','CANCELLED','PENDING']
    },  
    runningBalance:{type:Number,
        required:true
}, 
createdAt:{type:Date,
    required:true
}, 
updatedAt:{type:Date,
    required:true
}, 
                                  
})

module.exports = mongoose.model("GoldTransc", GoldSchema);