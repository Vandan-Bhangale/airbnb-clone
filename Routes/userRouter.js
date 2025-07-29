const express = require(`express`);
const userRoute = express.Router();
const homeController = require('../controllers/userController')

userRoute.get("/",homeController.getIndex);
userRoute.get("/bookings",homeController.bookings);
userRoute.get("/favourites",homeController.getFavourites);
userRoute.post("/favourites",homeController.addToFavourite);
userRoute.get("/homes",homeController.getHomes);
userRoute.get("/homes/:homeId",homeController.getHomeDetails); 
userRoute.post("/favourites/delete-home/:homeId",homeController.deleteHome);

exports.userRoute = userRoute;    