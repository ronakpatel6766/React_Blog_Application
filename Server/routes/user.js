const router = require("express").Router();
const userModel = require("../model/User");
const postModel = require("../model/Post");
const bcrypt = require("bcrypt");

// Get User's information using GET Request http://localhost:5000/api/user/:id
router.get("/:id", async (req, res) => {

    try{

        const gotUser = await userModel.findById(req.params.id);
        // Fetching all the properties except password for security reasons with the help of destructuring!

        const {password, ...otherProps} = gotUser._doc;
        return res.status(200).json(otherProps);

    }catch(error){
        //return res.status(500).json(error);
        return res.status(500).json("Unable to find the user! Please try again.");
    }
});

// Update user Password

router.put("/:id", async (req, res) => {

    if(req.body.id === req.params.id){

        if(req.body.password){
            const saltValue = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, saltValue);
        }else{
            return res.status(400).json("Password field cannot be empty.");
        }
        try{

            const userToUpdate = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            };
            if(req.body.profilePicture){
                userToUpdate.profilePicture = req.body.profilePicture;
            }

            

            // Updating user's password in Database
            const updatedUserInfo = await userModel.findByIdAndUpdate(req.params.id, {
                $set: userToUpdate  //Method used to set updated user information
            }, {new: true /*To see new updated values in MongoDB */});
            return res.status(200).json(updatedUserInfo);
        }catch(error){
            return res.status(500).json(error);
        }
    }else{
        // Checking if user entered another user's id by mistake! 
        return res.status(401).json("Sorry! You can only update your information.");
    }
});


// Delete user account
router.delete("/:id", async (req, res) => {

    if(req.body.id === req.params.id){

        //To delete all posts written by the user
        try{

            const userFound = await userModel.findById(req.params.id)
                try{
                 
                // Deleting user's posts with condition inside as to only delete posts belonging to the specified user   
                await postModel.deleteMany({username: userFound.username});    
                // Deleting user's information in Database
                await userModel.findByIdAndDelete(req.params.id);
                return res.status(200).json("User deleted successfully!");
                }catch(error){
                    return res.status(500).json(error);
                }
        }catch(error){
            return res.status(404).json("User dont exists!");
        }
    }else{
        // Checking if user entered another user's id by mistake! 
        return res.status(401).json("Sorry! You are only allowed to delete your account.");
    }
});




module.exports = router;