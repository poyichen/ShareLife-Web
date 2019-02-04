var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route
router.get("/", function(req, res){
    res.render("home");
})


// Show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

// Handle sign up 
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    if(req.body.adminCode === "admin_sharelife2019v") {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to join us - " + user.username);
            res.redirect("/photos");
        });
    });
});

// Show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

// Handle login 
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/photos",
        failureRedirect: "/login",
        successFlash: "Welcome back!"
    }), function(req, res){
});

// Handle logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logout successfully!");
    res.redirect("/photos");
})

module.exports = router;