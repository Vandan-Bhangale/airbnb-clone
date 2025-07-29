// const favourite = require('../models/favourite_home');
const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
    houseName: {type: String, required: true},
    Price: {type: Number, required:true},
    Rating: {type:Number,required:true},
    Location: {type: String,required:true},
    photoUrl:String,
    description:String
});

// homeSchema.pre('findOneAndDelete',async function(next) {
//     const homeId = this.getQuery()._id;
//     await favourite.deleteMany({houseId:homeId});
//     next();
// });
module.exports = mongoose.model("Home",homeSchema);

















/**
 *   this.houseName = houseName;
        this.Price = price;
        this.Rating = rating;
        this.Location = location;
        this.photoUrl = photoUrl;
        this.description = description;

        save()
        find()
        fetchById(homeId)
        deleteById(homeId)
 */


