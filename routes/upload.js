const express = require('express');


const router = express.Router();

router.post('/upload',upload.single("profileImage"),(req,res) => {
    console.log(req.body);
    console.log(req.file);

    return res.render("/");
});


app.post("/upload",upload.fields([{name: 'profileimg'},{name: 'coverimg'}]),(req,res) => {
    console.log(req.body);  
   console.log(req.file);
})