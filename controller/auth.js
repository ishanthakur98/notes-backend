const express = require('express');
const router = express.Router();
const User = require("../models/User");
const { body, validationResult, header } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validateUser = require('../middleware/validateUser');
require('dotenv').config();

// ROUTE - 1 Create a User using: POST "/api/auth/register"
router.post("/register", [
    body('name', "Enter a valid name").isLength({ min: 3 }),
    body('password', "Enter a valid password").isLength({ min: 5 }),
    body('email', "Enter a valid email").isEmail()
], async (req, res) => {

    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).json({ errors: result.array() });
    }
    try {


        let user = await User.findOne({ email: req.body.email });
        if (user) {
            res.status(400).json({ error: "User with this email already exist" });
        }
        const salt = await bcrypt.genSalt(10);
        let secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = await jwt.sign(data, process.env.JWT_SECRET);
        console.log(authToken);

        res.json({
            token: authToken
        });
        // .then(user => res.json(user)).catch(errors => res.json({ error: errors.message }))
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Something went wrong !!" })
    }
})


// ROUTE - 2 Login User using: POST "/api/auth/login"
router.post("/login", [
    header('token', "Please enter authorization header").exists()
], async (req, res) => {

    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).json({ errors: result.array() });
    }
    const { email, password } = req.body;
    var token = req.headers['token'];
    try {

        let user = await User.findOne({ email: email });
        if (!user) {
            res.status(400).json({ error: "No user with this email exist" });
        }
        const passCompare = bcrypt.compare(password, user.password);
        if (!passCompare) {
            res.status(400).json({ error: "Password is incorrect ." });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = await jwt.sign(data, process.env.JWT_SECRET);


        res.json({
            token: authToken
        });
        // .then(user => res.json(user)).catch(errors => res.json({ error: errors.message }))
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Something went wrong !!" })
    }
})

// ROUTE - 3 Get User using: POST "/api/auth/getUser" 
router.post("/getUser",validateUser, async (req, res) => {

    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).json({ errors: result.array() });
    }
   
    try {
        
        let user = await User.findById(req.userInfo.user.id).select("-password");
        if (!user) {
            res.status(400).json({ error: "Invalid User" });
        }
        res.json({
            user
        });
        // .then(user => res.json(user)).catch(errors => res.json({ error: errors.message }))
    } catch (error) {
        res.status(500).json({ error: "Something went wrong !!" })
    }
})

module.exports = router;
