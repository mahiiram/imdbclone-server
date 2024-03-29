const mongoose = require('mongoose');



const Movie_schema =new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    actors:[{
        name:{
        type:String,
        },
        actorimage:{
            type:String,
        }
    }],
    producers:[{
        name:{
        type:String,
        },
        producerimage:{
            type:String,
        }
    }],
    director:[{
        name:{
        type:String,
        },
        directorimage:{
            type:String,
        }
    }],
    description:{
        type: String,
        required: true
    },
    releasedate:{
        type: Date,
        required: true
    },
    posterurl:{
        type: String,
        required: true
    },
    genre:{
        type:String,
        required:true
    },
    featured:{
        type: Boolean,
    },
    reviews:[{
        type: mongoose.Types.ObjectId,
        ref:"review",
    }],
    admin:[{
        type:mongoose.Types.ObjectId,
        ref: "Admin",   
     }]
})

const Moviemodel = mongoose.model('Movie',Movie_schema);
module.exports = Moviemodel;