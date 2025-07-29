const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   FirstName : {
    type: String,
    required: [true,"First name is required"]
   },
   LastName : String,
   Email : {
    type: String,
    requried: [true,"Email is required"],
    unique: true
   },
   Password: {
    type: String,
    required: [true, "Password is required"]
   },
   userType: {
    type: String,
    enum: ['guest','host'],
    default: 'guest'
   },
   favourites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home'
  }]
});

module.exports = mongoose.model("User",userSchema);