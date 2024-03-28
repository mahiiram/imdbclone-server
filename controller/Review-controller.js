const reviewmodel = require("../model/Review-model.js")
const Moviemodel = require("../model/Movie-model");
const usermodel = require("../model/user-model");
const mongoose = require("mongoose")

const review_router = require("express").Router();


//post
review_router.post('/create', async (req, res, next) => {  //localhost:5000/review/create
    const {
        movie,
        review,
        user
    } = req.body;

    let existingmovie;
    let existinguser;

    try {
        existingmovie = await Moviemodel.findById(movie);
        existinguser = await usermodel.findById(user)
    } catch (err) {
        return console.log(err)
    }
    if (!existingmovie) {
        return res.status(404).json({
            message: "Movie Not found with given Id"
        })
    }
    if (!existinguser) {
        return res.status(404).json({
            message: "User not found with given Id"
        })
    }

      let reviews;

    try {
         reviews = new reviewmodel({
            movie,
            review,
            user
        });
        const session =await mongoose.startSession();
        session.startTransaction()
        existinguser.reviews.push(reviews)
        existingmovie.reviews.push(reviews)
         await existingmovie.save({session:session});
         await existinguser.save({session:session});
         await reviews.save({session});
         session.commitTransaction();
    } catch (err) {
        return console.log(err)
    }

    if (!reviews) {
        return res.status(500).json({ message: "Unable to create review" })
    }
    return res.status(201).json({ reviews })
});

review_router.get("/:id",async(req,res,next)=>{

       let reviews;
       const id =req.params.id
       try{
         reviews =  await reviewmodel.findById({_id:id}).populate('user movie').lean();
       }catch(err){
        return console.log(err)
       }

       if(!reviews){
        return res.status(500).json({   
            message:"There is No reviews data"
        })
       }
       return res.status(200).json({reviews})
})
review_router.delete("/delete/:id",async (req,res,next)=>{
    const id = req.params.id;
     let review;
     try{
        review = await reviewmodel.findByIdAndRemove(id).populate('user movie');
        const session = await mongoose.startSession();
        session.startTransaction();
        await booking.user.bookings.pull(review); 
        await booking.movie.bookings.pull(review)
        await booking.movie.save({session});
        await booking.user.save({session});
        session.commitTransaction();
     }catch(err){
        return console.log(err)
     }
     if(!review){
        return res.status(500).json({
            message:"Unable to delete" 
        })
     }
      return res.status(201).json({
        message:"review Deleted"  
    })
})

module.exports = review_router