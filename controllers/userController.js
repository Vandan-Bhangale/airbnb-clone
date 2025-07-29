const Home = require('../models/home');
const User = require('../models/userModel');

exports.getIndex = (req,res,next) => {
    console.log("Session value: ",req.session)
    Home.find().then(registerdHouse => {
           res.render('store/home-list',{
           registerdHouse: registerdHouse,
           pageTitle: 'airbnb Home',
           currentPage: 'Home',
           isLoggedIn: req.isLoggedIn,
        user: req.session.user
       })
   });
}

    exports.getHomes = (req,res,next) => {
         Home.find().then(registerdHouse => {
                res.render('store/home-list',{
                registerdHouse: registerdHouse,
                pageTitle: 'airbnb Home',
                currentPage: 'Home',
               isLoggedIn: req.isLoggedIn,
        user: req.session.user})
        });
    }

    exports.bookings = (req,res,next) => {
            res.render('store/bookings',{
                pageTitle: 'My bookings',
                currentPage: 'bookings',
                isLoggedIn: req.isLoggedIn,
        user: req.session.user});
    }

    exports.getFavourites = async (req,res,next) => {
        const userId = req.session.user._id;
        const user = await User.findById(userId).populate('favourites');
        console.log("User: ",user);
        res.render("store/favourite_list",{
            favouriteHomes: user.favourites,
            pageTitle: "Favourites",
            currentPage: "Favourites",
            isLoggedIn: req.isLoggedIn,
            user: req.session.user
        })
}

exports.addToFavourite = async (req,res,next) => {
    const id = req.body.id;             //request is post type that's why req.body.id is used to get house id

    // console.log("Came to add to favourite",req.body);

    const userId = req.session.user._id;
    const user = await User.findById(userId);
    if(!user.favourites.includes(id)) {
        user.favourites.push(id);
        await user.save();
    }
        res.redirect('/favourites');      
}

exports.getHomeList = (req,res,next) => {
    Home.find().then(registerdHouse => {
        console.log(registerdHouse);
        res.render('store/home-list',{registerdHouse: registerdHouse,
            pageTitle: 'Home List',
            currentPage: 'Home',
            isLoggedIn: req.isLoggedIn,
        user: req.session.user});
    });
}

exports.getHomeDetails = (req,res,next) => {
    const homeId = req.params.homeId;               //request is get type that's why req.params.homeI d is used to get id
    console.log("At the home details page: ",homeId);

    Home.findById(homeId).then(home => {
        if(!home) {
            res.redirect('/homes')
        } else {
            console.log("Home found",home);
        res.render('store/home-detail',{
            home: home,
            pageTitle: "Home details",
            currentPage: "Home",
            isLoggedIn: req.isLoggedIn,
        user: req.session.user
            });
        }
    });
}

//delete home from favourites
exports.deleteHome = async (req,res,next) => {

    const userId = req.session.user._id;
    const user = await User.findById(userId);
    const homeId = req.params.homeId;

    if(user.favourites.includes(homeId)) {
        user.favourites = user.favourites.filter(fav => fav != homeId);
        await user.save();
    }
        res.redirect('/favourites');
}