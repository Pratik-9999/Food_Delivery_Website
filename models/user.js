const mongoose = require("mongoose"); //required mongoose module

//Schema 
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email :{
        type: String,
        required: true,
        
    },
   password: {
    type: String,
    required: true,
   },
   createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',

   }

});

//Created the model for schema.
const User = mongoose.model("user",userSchema);

module.exports = User;