const express = require("express");
const app = express();

const User = require("./models/userModel")
const GoldTransc = require("./models/goldTransc")
const WalletTransc = require("./models/walletTransc")

app.use(express.json());

const gain=(prevPrice, currPrice)=>{
    let profit = currPrice-prevPrice;
    return profit;
}

//create a user
app.post("/registerUser",async (req,res,next)=>{
    const {firstName,lastName ,password,mobileNumber,country,email,runningBalance} = req.body;
    const user = await User.create({
        firstName,lastName ,password,mobileNumber,country,email,runningBalance
    })
    res.status(200).json({
        message: "User created successfuly",
        user
    })
})

//change gold price
app.put("/:uid/GoldPrice/:price",async(req,res,next)=>{

    try {
        const price = req.params.price;

        const user = await User.findById(req.params.uid);
        const gold = await GoldTransc.findOne({userId:req.params.uid})
        const change = gain(user.runningBalance.goldPrice, price)

        const perc = (change/user.runningBalance.goldPrice)*100

        const growth = user.runningBalance.gold * change;
        await User.findOneAndUpdate(
            {_id: req.params.uid},{ $set: {"runningBalance.goldPrice":price}}
        );
        res.status(200).json({
            "Net Funds Added":growth,
            "Current Fund":user.runningBalance.wallet,
            "Net growth/loss in gold":change,
            "gain/loss percent":perc
        })
    } catch (error) {
        console.log(error)
    }


   

})


// user buys gold
app.post("/:uid/buyGold",async(req,res,next)=>{
    const quantity = req.body.quantity;
    const user = await User.findById(req.params.uid);

    let fund = JSON.parse(user.runningBalance.wallet);
    let gold = JSON.parse(user.runningBalance.gold);
    let goldPrice = JSON.parse(user.runningBalance.goldPrice);
    let amount= quantity*goldPrice;
    

    if(fund >= amount){

        const goldTransc = await GoldTransc.create({
            userId: req.params.uid,
            quantity : quantity, 
            amount: amount,
            type:"CREDIT",
            status:"SUCCESS",
            runningBalance:gold+ quantity,
            createdAt: Date.now(),
            updatedAt:Date.now()
        })

        // console.log(goldTransc);
        const walletTransc = await WalletTransc.create({
            userId: req.params.uid,
            amount: amount,
            type:"DEBIT",
            status:"SUCCESS",
            runningBalance: fund-amount,
            transaction: goldTransc.id,
            createdAt: Date.now(),
            updatedAt:Date.now()
        })

        user.runningBalance.wallet -= amount;
        user.runningBalance.gold +=quantity;
        user.save();

        res.status(200).json({
            message:`${quantity} g gold bought`  
        })
    }
   else{
    res.json({
        message:"funds not available"
    })
   }
    
    

})


//user sells gold
app.post("/:uid/sellGold",async(req,res,next)=>{
    const quantity = req.body.quantity;
    const user = await User.findById(req.params.uid);

    let fund = JSON.parse(user.runningBalance.wallet);
    let gold = JSON.parse(user.runningBalance.gold);
    let goldPrice = JSON.parse(user.runningBalance.goldPrice);
    let amount= quantity*goldPrice;
    
    // req.body.User = req.params.uid;

    if(quantity <= gold){

        const goldTransc = await GoldTransc.create({
            userId: req.params.uid,
            quantity : quantity, 
            amount: amount,
            type:"DEBIT",
            status:"SUCCESS",
            runningBalance:gold- quantity,
            createdAt: Date.now(),
            updatedAt:Date.now()
        })
        // console.log(goldTransc);
        const walletTransc = await WalletTransc.create({
            userId: req.params.uid,
            amount: amount,
            type:"CREDIT",
            status:"SUCCESS",
            runningBalance: fund+amount,
            transaction: goldTransc.id,
            createdAt: Date.now(),
            updatedAt:Date.now()
        })

        user.runningBalance.wallet += amount;
        user.runningBalance.gold -=quantity;
        user.save();
        res.status(200).json({
            message:"done"
        })}

   else{
    res.json({
        message:"gold not available"
    })
   }
    
    

})



module.exports= app; 