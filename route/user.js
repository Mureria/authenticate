const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user')



// Register User
router.post('/register', async(req, res) => {

    try {

         // Get User Input
        const {firstName, secondName, email, password} = req.body;

        // Validate User Input
        if(!(firstName && secondName && email && password)) {

        res.status(400).send('All input is required');
        }

        // Check and validate if user already exist in our database
        const existingUser = await User.findOne({email});

        if(existingUser) {
            return res.status(409).send('User Already Exists! Please Login');
        }

        // Encrypt user password using bcrypt
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            firstName,
            secondName,
            email: email.toLowerCase(),
            password: encryptedPassword
        });

        // Create user token
        const token = jwt.sign(
            {userId: user._id, email },
            process.env.SECRET,
            {expiresIn: '2h'}
        );

        // Save user token
        user.token = token;

        // Return new user
        res.status(201).json(user);

        
    } catch (err) {
        return res.status(400).json({message: err.message});
    }   
});



// Login
router.post('/login', async(req, res) => {

    try {

        // Get user input
        const { email, password } = req.body;
    
        // Validate user input
        if (!(email && password)) {
         return res.status(400).send("All input is required");
        }

        // Validate if user exist in our database
        const user = await User.findOne({ email });
    
        if (user && (await bcrypt.compare(password, user.password))) {

            // Create token
            const token = jwt.sign(
            { userId: user._id, email },
            process.env.SECRET,
            {expiresIn: '2h'}
          );

            // save user token
            user.token = token;

            // user
            return res.status(200).json('Successfully logged in');
        }

        return res.status(400).send("Invalid Credentials");
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});


module.exports = router