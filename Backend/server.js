const app = require("./app")

//connecting Database
const connectDatabase = require("./config/database");
connectDatabase();

const server = app.listen(4400,()=>{
    console.log(`server is working on http://localhost:4400`);
})
