const mongoose = require('mongoose');


const review_schema =new mongoose.Schema({
    movie:{
        type: mongoose.Schema.ObjectId,
        ref:"Movie",
        default:[]
        
    },
    review:{
        type: String,
        required: true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        default:[]    
    }
},{
    timestamps:true,
})

const reviewmodel = mongoose.model('review',review_schema);
module.exports = reviewmodel;