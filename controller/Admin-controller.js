const Adminmodel = require('../model/Admin-model');
const bcrypt = require('bcrypt')
const admin_router = require('express').Router();
const jwt = require('jsonwebtoken');

//post
admin_router.post('/signup', async (req, res, next) => {  //localhost:5000/admin/signup
    const { email, password} = req.body;

    try {
        let user = await Adminmodel.findOne({ email });

        if (user) {
            return res.status(400).json({
                Message: "User email already exist"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        user = new Adminmodel({
            email,
            password: hashedPassword,
        })

        await user.save()

        return res.status(201).json({
            message: "user Register successfully"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Something went wrong" 
        })
    }
});


admin_router.post('/login', async(req, res, next) => {    //localhost:5000/admin/login
    const { email, password } = req.body;

    try {
        let admin = await Adminmodel.findOne({ email }).select('+password');

        if (!admin) {
            return res.status(400).json({
                message: "Invalid Email"
            })
        }

        const isPasswordCorrect =await bcrypt.compare(password,admin.password)

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid Password"
            })
        }
        const token = jwt.sign({ userId: admin._id}, process.env.SECRET_KEY, {
            expiresIn: "1d"
        })

        return res.status(201).json({
            message: "Login Sucessfully",
            token,
            id:admin._id
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
})


admin_router.get('/:id',async (req,res,next)=>{
    const id = req.params.id;
    let movies;
    try{
        movies = await Adminmodel.findById(id).populate('Addedmovies')
    }catch(err){
        return console.log(err)
    }
    if(!movies){
        return res.status(404).json({  
            message:"Invalid movie ID"
        })
    }
    return res.status(200).json({movies})
})


//get all admins

admin_router.get('/getadmin',async (req,res,next)=>{
       let admins;
       try{
        admins = await Adminmodel.find()
       }catch(err){
        return console.log(err)
       }

       if(!admins){
        return res.status(500).json({
            message:"Internal Server Error"
        })
       }
       return res.status(200).json({admins,
        message:"successfully get the data"
       })

})


module.exports = admin_router;