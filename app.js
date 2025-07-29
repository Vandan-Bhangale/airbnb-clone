const path = require('path');

//Express
const express = require('express');
const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);
const PATH = "mongodb+srv://root:vandan@airbnb.t3wolhz.mongodb.net/airbnb?retryWrites=true&w=majority&appName=airbnbz";

//Local modules
const {userRoute} = require(`./Routes/userRouter`);
const {hostRoute} = require(`./Routes/hostRouter`);
const authRouter = require('./Routes/authRouter');
const errorController = require('./controllers/pageNotFound');

const rootDir = require('./utils/pathUtility');
const { default: mongoose } = require('mongoose');


//Running the express server
const app = express();

app.set('view engine','ejs');

const store = new mongoDbStore({
    uri: PATH,
    collection: 'session'
});

app.use(express.urlencoded({extended: true})); 

//Using session
app.use(session({
    secret: "My secret",
    resave: false,
    saveUninitialized: true,
    store: store
}));

//Reading cookie  
//firstly this was cookie middleware but after the use of seesion.isloggedin it is working as session
//now we don't have to change everywhere from res.isloggedin to req.session.isloggedin because of this middleware
app.use((req,res,next) => {
    // console.log("Cookie check middleware",req.get('Cookie'));
    req.isLoggedIn = req.session.isLoggedIn;
    next();
});

app.use(express.static(path.join(rootDir,'public')));
app.use(express.json());

app.use(userRoute);
app.use('/host',(req,res,next) => {
    if(req.isLoggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
});
app.use(hostRoute);
app.use(authRouter);

app.use(errorController.pageNotFound);

const PORT = 3001;
mongoose.connect(PATH).then(() => {
    console.log("Connected successflly.");
    app.listen(PORT,() => {
        console.log("Server is live now on http://localhost:3001"); 
    })
}).catch(err => {
    console.log("Error while connecting to the server.",err);
});