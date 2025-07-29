const Home = require('../models/home');

exports.addHomes = (req,res,next) => {
    res.render('host/addHome',{
        pageTitle: "Add Home to airbnb",
        currentPage: "addHome",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user
      });
}

exports.addHome = (req,res,next) => {
    res.render('host/addHome',{
        pageTitle: "Add Home to airbnb",
        currentPage: "addHome",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user
      });
}

exports.postHomes = (req,res,next) => {
    const { houseName,Price,Rating,Location,photoUrl,description } = req.body;
    const home = new Home({houseName,Price,Rating,Location,photoUrl,description});
    home.save().then(() => {
        console.log("Home saved successfully!");
    });
    res.redirect("/host/host-home-list");
}

exports.getHostHomeList = (req,res,next) => {
    Home.find().then(registerdHouse => {
    //    console.log(registerdHouse);
       res.render('host/host-home-list',{
        registerdHouse: registerdHouse,
           pageTitle: 'Host home list',
           currentPage: 'host-homes',
           isLoggedIn: req.isLoggedIn,
        user: req.session.user});
    });
}

exports.getHome = (req,res,next) => {
    const id = req.params.homeId;
    // const editing = req.query.editing;

    Home.findById(id).then(home => {

        if(!home) {
            console.log("Home not found for editing.");
            return res.redirect('/host/host-home-list');
        }
        // console.log(id,editing);
        console.log("Inside the home editor.");
        console.log(home.houseName);
            res.render('host/edit-home',{
            home: home,
            pageTitle: "Home editor",
            currentPage: "host-homes",
            isLoggedIn: req.isLoggedIn,
            editing : true,
        user: req.session.user
        });
    });
}

exports.editHome = (req,res,next) => {
    const { houseName,Price,Rating,Location,photoUrl,description,id } = req.body;
    Home.findById(id).then(home => {
        home.houseName = houseName,
        home.Price = Price,
        home.Rating = Rating,
        home.Location = Location,
        home.photoUrl = photoUrl,
        home.description = description
        home.save().then(result => {
            console.log("Home updated successfully",result);
        }); 
    res.redirect('/host/host-home-list');
    }).catch(err => {
        console.log("Error while updating home data: ",err);
    });
}

exports.deleteHome = (req,res,next) => {
    const homeId = req.params.homeId;
    console.log('Trying to delete: ',homeId);
    Home.findOneAndDelete({_id:homeId}).then(result => {
        if(result) {
            console.log("Home deleted successfully.",result);
        }
        res.redirect('/host/host-home-list');
    }).catch(err=> {
        console.log("Error while deleting the hosue: ",err);
    })
    return Favourite.deleteMany({ houseId: homeId });
} 

