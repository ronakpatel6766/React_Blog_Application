const router = require("express").Router();
//const userModel = require("../model/User");
const postModel = require("../model/Post");


// Get Post information when user is logged in using GET Request
router.get("/get/:id", async (req, res) => {

    try{

        const getPost = await postModel.findById(req.params.id);
        res.status(200).json(getPost);
    }catch(error){
        return res.status(500).json(error);
    }

});

// Get all the Posts of the user logged in filtered by username or blog category
/*
    For example it can be http://localhost:5000/api/post/all
    http://localhost:5000/api/post/all/?username=demo
    http://localhost:5000/api/post/all/?category=financial
*/
router.get("/all", async (req, res) => {

    const username = req.query.username;
    const category = req.query.category;
    try{

    var postsFetched;
    if(username){

        postsFetched = await postModel.find({username: username});  // This will return post filtered by username 
    }else if(category){
        
        postsFetched = await postModel.find({categories: {
            
            $in: [category] // This will check the category name in the array of categories stored in database
        }});
    }else{

        postsFetched = await postModel.find();    // This will return all the posts if no username or category is given
    }

    res.status(200).json(postsFetched);

    }catch(error){
        return res.status(500).json(error);
    }
});

// Create Post when user is logged in  
router.post("/new", async (req, res) => {

    const newPost = new postModel(req.body);

    try{

        const saveNewPost = await newPost.save();
        return res.status(200).json("Your post has been saved.");
        
    }catch(error){

        return res.status(500).json(error);
    }
});

// Update Post when user is logged in using PUT Request Method
router.put("/update/:id", async (req, res) => {

    try{

        // Fetching the post with post ID first
        const foundPost = await postModel.findById(req.params.id);

        // Checking if the user logged in is validated or not
            if(foundPost.username === req.body.username){

                try{

                    const updatePost = await postModel.findByIdAndUpdate(req.params.id,
                         {$set: req.body},  // Providing what data to update
                         {new: true}); // setting new to true so that server responds with the updated data
                    return res.status(200).json(updatePost);

                }catch(error){
                    return res.status(500).json(error);
                }

            }else{
                return res.status(401).json("You are only allowed to update posts published by you!");
            }
    }catch(error){

        return res.status(500).json(error);
    }
});

// Delete Post when user is logged in using DELETE Request Method
router.delete("/delete/:id", async (req, res) => {

    try{

        const postToDelete = await postModel.findById(req.params.id);

        // Checking if user logged in is valid or not
        if(postToDelete.username === req.body.username){

            try{
                // Will delete the post found
                await postToDelete.delete();
                return res.status(200).json("Your Post has been deleted!");

            }catch(error){
                return res.status(500).json(error);
            }
        }else{
           
            return res.status(401).json("You are only allowed to delete post published by you!");
        }
    }catch(error){
        return res.status(500).json(error);
    }
});

module.exports = router;