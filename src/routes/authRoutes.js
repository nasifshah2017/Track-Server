const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");

const router = express.Router();

router.post("/signup", async (req, res) => {
    
    // console.log(req.body);

    const {email, password} = req.body;                             // Extracting the user's password and email 

    try {

    const user = new User({email, password});                       // Registering a new user

    await user.save()                                               // Saving the user info in the database

    const token = jwt.sign({userId: user._id}, "MY_SECRET_KEY");    // Creating a JSON Web Token

    res.send({token: token});

    } catch (err) {
        return res.status(422).send(err.message);
    }
});

router.post("/signin", async (req, res) => {

    const {email, password} = req.body;

    if(!email || !password) {
        
        return res.status(422).send({error: "Must provide email and password"});

    }

    const user = await User.findOne({email: email});

    if(!user) {

        return res.status(422).send({error: "Email not found"});
    }

    try {
            await user.comparePassword(password);

            const token = jwt.sign({userId: user._id}, "MY_SECRET_KEY")

            res.send({token});

    }   catch(err) {

        return res.status(422).send({error: "Invalid password or email"});
    } 
});

module.exports = router;