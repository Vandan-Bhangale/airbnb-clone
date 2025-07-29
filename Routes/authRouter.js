const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController')

authRouter.get('/login',authController.getLogin);
authRouter.post('/login',authController.getLoginPage);
authRouter.get('/logout',authController.logout);
authRouter.get('/signup',authController.getSignup);
authRouter.post('/signup',authController.postSignupPage);

module.exports = authRouter;