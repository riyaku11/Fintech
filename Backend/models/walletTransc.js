const mongoose = require("mongoose");
// const User = require("./userModel");
// const GoldTransc = require("./goldTransc")

const walletSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.ObjectId,
               required: true,
            ref:"User"},
    amount:{type:Number,
               required: true}, 
    type:{type:String,
               required: true,
            enum:['CREDIT','DEBIT']}, 
    status:{type:String,
                  required:true, 
                  enum:['FAILED','SUCCESS','PROCESSING']
    },  
    runningBalance:{type:Number,
        required:true
}, 
    transaction:{type:mongoose.Schema.ObjectId,
    ref:"GoldTransc",
}, 
createdAt:{type:Date,
    required:true
}, 
updatedAt:{type:Date,
    required:true
}, 
                                  
})

module.exports = mongoose.model("WalletTransc", walletSchema);