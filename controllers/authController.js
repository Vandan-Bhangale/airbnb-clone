const { check, validationResult } = require("express-validator");
let User = require("../models/userModel");
const bcrypt = require('bcryptjs');

exports.getLogin = (req,res,next) => {
    res.render('auth/login',{
        pageTitle: "Login",
        currentPage: "Login",
        isLoggedIn: false,
        errors: [],
        user: {}
    });
}

exports.getLoginPage =async (req,res,next) => {
    const {Email,Password} = req.body;
    const user = await User.findOne({Email});
    if(!user) {
        return res.status(422).render('auth/login',{
            pageTitle: "Login",
            currentPage: "Login",
            isLoggedIn: false,
            errors: ['User does not exist.'],
            oldInput: {Email},
            user: {}
        });
    }

    const isMatch = await bcrypt.compare(Password,user.Password);
    if(!isMatch) {
       return res.status(422).render('auth/login',{
            pageTitle: "Login",
            currentPage: "Login",
            isLoggedIn: false,
            errors: ['Incorrect Password'],
            oldInput: {Email},
            user: {}
        })
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    await req.session.save(); 
    console.log("Session saved successfully.");
    res.redirect('/');
}

exports.logout = (req,res,next) => {
    // res.cookie("isLoggedIn",false);
    req.session.destroy(() =>{
        res.redirect('/login');
    })
}

exports.getSignup = (req,res,next) => {
    res.render('auth/signup',{
        pageTitle: "Signup",
        currentPage: "signup",
        isLoggedIn: false,
        errors: [],
        oldInput: {FirstName:"",LastName:"",Email:"",Password:"",userType:""},
        user: {}
    });
}
 
exports.postSignupPage = [
    check("FirstName")
    .trim()
    .isLength({min: 2})
    .withMessage("First name should contain at least 2 characters")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("First Name should contain only alphabets"),

    check('LastName')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Last Name should contain only alphabets"),
    
    check('Email')
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

    check('Password')
    .isLength({min: 8})
    .withMessage("Password should be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password should contain one uppercase")
    .matches(/[a-z]/)
    .withMessage("Password should contain one lowercase")
    .matches(/[0-9]/)
    .withMessage("Password should contain one number")
    .matches(/[!@#$%]/)
    .withMessage("Password should contain one special character"),

    check('confirmPassword')
    .trim()
    .custom((value,{req}) => {
        if(value !== req.body.Password) {
            throw new Error("Password do not match");
        }
        return true;
    }),

    check('userType')
    .notEmpty()
    .withMessage("Usert type can not be empty")
    .isIn(['guest','host'])
    .withMessage("Invalid user type"),

    check('terms')
    .notEmpty()
    .withMessage("Please accept the terms and conditions")
    .custom((value,{req}) => {
        if(value !== 'on') {
            throw new Error("Please accept the terms and conditions");
        }
        return true;
    }),
    
    (req,res,next) => {
   console.log(req.body);
   const {FirstName,LastName,Email,Password,userType} = req.body;
   const errors = validationResult(req);
   console.log(errors.array())
   if(!errors.isEmpty()) {
    return res.status(422).render('auth/signup',{
        pageTitle: 'Signup',
        currentPage: 'signup',
        isLoggedIn: false,
        errors: errors.array(),
        oldInput: {
            FirstName,
            LastName,
            Email,
            Password,
            userType
        },
        user: {}
    });
   }

   bcrypt.hash(Password,12).then(hashedPassword => {
     let user = new User({FirstName,LastName,Email,Password:hashedPassword,userType});
        return user.save()
   })
   .then(()=> {
    console.log("User saved successfully.");
    res.redirect('/login');
   }).catch(err=> {
    console.log("Error while saving user.",err);
    res.redirect('/signup')
   });
   
}]