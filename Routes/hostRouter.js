const path = require('path');
const express = require("express");
const rootDir = require('../utils/pathUtility');

//creatin the route of this model
const hostRoute = express.Router();


const homeController = require('../controllers/hostController');

hostRoute.get("/add-home",homeController.addHomes);
hostRoute.get("/host/add-home",homeController.addHome);
hostRoute.post("/add-home",homeController.postHomes);
hostRoute.get("/host/host-home-list",homeController.getHostHomeList);
hostRoute.post("/host/edit-home",homeController.editHome);
hostRoute.get("/host/edit-home/:homeId",homeController.getHome);
hostRoute.post("/host/delete-home/:homeId",homeController.deleteHome);

exports.hostRoute = hostRoute;