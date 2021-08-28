const router = require("express").Router();
const categoryModel = require("../model/Category");

// Add new Category using POST Request. URL would be http://localhost:5000/api/categories/addCategory
router.post("/addCategory", async (req, res) => {

    const categoryToAdd = new categoryModel(req.body);

    try{

        const saveCategory = await categoryToAdd.save();
        res.status(200).json(saveCategory);
    }catch(error){
        res.status(500).json(error);
    }
});

// Get Categories using GET Request http://localhost:5000/api/categories/getCategories
router.get("/getCategories", async (req, res) => {

    try{

        const categoriesReceived = await categoryModel.find();
        res.status(200).json(categoriesReceived);
    }catch(error){
        res.status(500).json(error);
    }
});

module.exports = router;