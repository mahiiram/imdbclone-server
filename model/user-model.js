const mongoose = require('mongoose');


const user_schema =new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true
    },
    reviews:[{
        type:mongoose.Types.ObjectId,
        ref:"review",
        required:true
    }]
})

const usermodel = mongoose.model('user',user_schema);
module.exports = usermodel;