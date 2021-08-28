const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");

// User Signup process using POST Request 
router.post("/signup", async (req, res) => {

    try{   
        

        if(req.body.username && req.body.password){
            //Encrypting user password from server side 
            const saltValue = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(req.body.password, saltValue);

            const registeredUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: encryptedPassword,
                profilePicture: req.body.profilePicture
            });

            const userSaved = await registeredUser.save();

            // Giving Acknowledgement about success
            return res.status(200).json("User has been registered successfully!");
        }else{

            return res.status(500).json("Please enter your information in the mandatory fields");
        }
        
    }catch(error){

        return res.status(500).json(error);
    }

});

// User Login Authentication with POST Request (Start from here!)
router.post("/signin", async (req, res) => {

    try{

        // Finding the user if exists
        const foundUser = await User.findOne({

            username: req.body.username
        });

        if(!foundUser){

            return res.status(400).json("Wrong credentials! Please try again.");
             
        }

        // Matching passwords
        const isValidated = await bcrypt.compare(req.body.password, foundUser.password);

        // If passwords not matched
        if(!isValidated){

            return res.status(400).json("Wrong Password! Please try again.");
            
        }

        // If User Login is completely validated
        const {password, ...otherProperties} = foundUser._doc;  // Extracting other data except password using destructuring
        res.status(200).json(otherProperties);

    }catch(error){
       return res.status(500).json(error);
    }

});


module.exports = router;