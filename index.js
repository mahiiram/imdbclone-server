const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const mongoose = require('mongoose');
const app_server = require("./app-routes.js");
const dotenv = require("dotenv")
const cors = require('cors');
const morgan = require('morgan');

const env = dotenv.config()


app.use(express.json())
app.use(cors({origin:true,credentials:true}))

app.use(morgan('tiny'))
app.disable('x-powered-by')

app.get("/",(req,res)=>{
    console.log("Home Request Server Running Perfectly")
})

app.use('/',app_server)

const port=5000
app.listen(port,()=>{
    console.log(`Server Connected to ${port}`)
})


mongoose.set('strictQuery',false);
mongoose.connect(process.env.mongodb_url).then(()=>{
    console.log("DB Connected")
}).catch((err)=>{
    console.log(err)
})