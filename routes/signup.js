const express = require('express');
const User = require("../models/user");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require('path');


 router.get('/',(req,res) =>{
    res.render('signUp');
});



router.post("/submit", async(req,res) => {

    //const body = req.body;
    //console.log(body); 
    try{
        
        var hashPassword = await bcrypt.hash(req.body.password,saltRounds);
    
        await User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashPassword,
    });
    res.render("tempRedirect");
}

catch(e){
    return res.status(500).json({
        status: "failed",
        message: e.message
    })
}
    

});

module.exports=router;



