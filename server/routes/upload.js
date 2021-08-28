const router = require("express").Router();
const multer = require("multer");   // Package used to store uploaded images
const awsS3 = require("aws-sdk/clients/s3");
require("dotenv").config();

const region = process.env.AWS_Bucket_Region;
const s3BucketName = process.env.AWS_Bucket_Name;
const AccessKeyId = process.env.AWS_AccessKeyId;
const secretAccessKey = process.env.AWS_SecretAccessKey;

const s3 = new awsS3({
    accessKeyId: AccessKeyId,
    secretAccessKey: secretAccessKey
});

const storageConfig = multer.memoryStorage({
    destination: (req, file, callBackFunction) => {

        callBackFunction(null, '');
    }
});

const fileToUpload = multer({storage: storageConfig}).single('image');

// Sending uploaded photo to AWS S3 Bucket and saving the link in MongoDB
router.post("/", fileToUpload, (req, res) => {

    //Getting the name of file
    const fileName = req.file.originalname.split(".");

    //Getting the type of file
    const fileType = fileName[fileName.length - 1]; 

    //Creating json config for AWS S3 object upload
    const params = {
        Bucket: s3BucketName,
        Key: `${Date.now()}.${fileType}`,
        Body: req.file.buffer 
    }

    //Uploading image to S3 Bucket
    s3.upload(params, (error, data) => {

        if(error){
            return res.status(500).json(error);
        }else{
            return res.status(200).json(data.Location);
        }
    });    

   

});

module.exports = router;

/*
{
    "ETag": "\"51cac83bf6a27ded4846bad09a63b662\"",
    "Location": "https://myreactblogbucket.s3.us-east-2.amazonaws.com/1625258908529.jpg",
    "key": "1625258908529.jpg",
    "Key": "1625258908529.jpg",
    "Bucket": "myreactblogbucket"
}
*/