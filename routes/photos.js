var express = require("express");
var router = express.Router();
var Photo = require("../models/photo");
var middleware = require("../middleware/index");

//INDEX - show all photos
router.get("/", function(req, res){
    var noMatch = null;
    if(req.query.search){
        var regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Photo.find({title: regex},function(err, allPhotos){
            if(err) {
                console.log(err);
            }
            else {
                if(allPhotos.length < 1) {
                    noMatch = "No photos match the search, please try again!"
                }
                res.render("photos/index", {photos: allPhotos, noMatch: noMatch});
            }
        });
    }
    else{
        //Get all photos from DB
        Photo.find({},function(err, allPhotos){
            if(err) {
                console.log(err);
            }
            else {
                res.render("photos/index", {photos: allPhotos , noMatch: noMatch});
            }
        });
    }
});

//NEW - show form to create new photo
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("photos/new");
})

//CREATE - add new photo to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    var title = req.body.title;
    var image = req.body.image;
    var descri = req.body.description;
    var date = req.body.date;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var new_photo = {title: title, image: image, description: descri, date: date, author: author};
    Photo.create(new_photo, function(err, newlyCreated){
        if(err) {
            console.log(err)
        }
        else {
            res.redirect("/photos"); 
        }
    });
  
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res) {
    Photo.findById(req.params.id).populate("comments").exec(function(err, foundPhoto){
        if(err || !foundPhoto) {
            req.flash("error", "Photo not found!");
            return res.redirect("back");
        }
        else {
            res.render("photos/show", {photo: foundPhoto})
        }
    });
});

// EDIT photo route
router.get("/:id/edit", middleware.isPhotoOwner, function(req, res) {
    Photo.findById(req.params.id, function(err, foundPhoto){
        if(err || !foundPhoto){
            return req.flash("error", "Photo not found!");
        }
        res.render("photos/edit", {photo: foundPhoto});
    });
});

// UPDATE photo route
router.put("/:id", middleware.isPhotoOwner, function(req, res) {
    Photo.findByIdAndUpdate(req.params.id, req.body.photo, function(err, updatedPhoto){
        if(err){
            res.redirect("/photos");
        }
        else {
            res.redirect("/photos/" + req.params.id);
        }
    })
})

//DELETE router
router.delete("/:id", middleware.isPhotoOwner, function(req, res){
    Photo.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect("/photos");
        }
        else {
            res.redirect("/photos");
        }
    });
})



function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;