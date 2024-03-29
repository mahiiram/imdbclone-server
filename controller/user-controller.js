const reviewmodel = require("../model/Review-model.js")
const usermodel = require("../model/user-model");
const user_router = require("express").Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
//get
user_router.get('/getalluser', async (req, res, next) => {   //localhost:5000/user/getalluser
    
    let users;
    try {
        users = await usermodel.find()
    } catch (err) {
        return next(err)
    }
    if (!users) {
        return res.status(500).json({
            message: "unexpected error occured"
        })
    }
    return res.status(200).json({ users })
})


//post
user_router.post('/signup',async (req, res, next) => {  //localhost:5000/user/signup
    const { email, password, name} = req.body;

    try {
        let user = await usermodel.findOne({ email });

        if (user) {
            return res.status(400).json({
                Message: "User email already exist"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        user = new usermodel({
            email,
            password: hashedPassword,
            name,
        })

        await user.save()

        return res.status(201).json({
            message: "user Register successfully",
            id:user._id  
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
})

//update
user_router.put('/getuser/:id', async (req, res, next) => {     //localhost:5000/user//getuser/:id

    const id = req.params.id
    const {
        name,
        email,
        password
    } = req.body;
    if (!name && name.trim() === "" && !email && email.trim() === "" && !password && password.trim() === "") {
        return res.status(422).json({
            message: "Invalid inputs"
        })
    }
    const hashedPassword = bcrypt.hashSync(password)
    let user;
    try {
        user = await usermodel.findByIdAndUpdate(id, { name, email, password: hashedPassword })
    } catch (err) {
        return console.log(err)
    }
    if (!user) {
        res.status(500).json({
            message: "Something Went Wrong"
        })
    }
    return res.status(200).json({
        message: "Updated Successfully"
    })
})

//Delete the user

user_router.delete('/:id', async (req, res, next) => {   //localhost:5000/user/:id
    const id = req.params.id;
    let user;
    try {
        user = await usermodel.findByIdAndRemove(id)
    } catch (err) {
        return console.log(err)
    }
    if (!user) {
        res.status(500).json({
            message: "Something Went Wrong"
        })
    }
    return res.status(200).json({
        message: "Removed Successfully"
    })
})

user_router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;

    try {
        let user = await usermodel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "Invalid Email"
            })
        }

        const isPasswordCorrect =await bcrypt.compareSync(password, user.password)

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid Password"
            })
        }
        const token = jwt.sign({ userId: user._id}, process.env.SECRET_KEY, {
            expiresIn: "1d"
        })

        return res.status(201).json({
            message: "Login Sucessfully",
            token,
            id:user._id,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
})

user_router.get("/getusersreview/:id",async (req,res,next)=>{
     const id = req.params.id
     let reviews;
     try{
       reviews = await reviewmodel.find({user:id}).populate('user movie').lean()
     }catch(err){
        return console.log(err)
     }
     if(!reviews){
        return res.status(500).json({message:"unable to get review"})

     }
     return res.status(201).json({reviews})
})
user_router.get('/:id', async (req, res, next) => {   //localhost:5000/user/:id
    const id =req.params.id;
    let user;  
    try {
        user = await usermodel.findById(id)
    } catch (err) {
        return next(err)
    }
    if (!user) {
        return res.status(500).json({
            message: "unexpected error occured"
        })
    }
    return res.status(200).json({ user })
})

module.exports = user_router;