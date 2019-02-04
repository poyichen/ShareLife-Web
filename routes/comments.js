var express = require("express");
var router = express.Router({mergeParams: true});
var Photo = require("../models/photo");
var Comment = require("../models/comment");
var middleware = require("../middleware/index");

//Comment New
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Photo.findById(req.params.id, function(err, photo){
        if(err && !photo) {
            console.log(err);
        }
        else {
            res.render("comments/new", {photo: photo});        
        }
    });
});

// Comment Create
router.post("/", middleware.isLoggedIn, function(req, res){
    Photo.findById(req.params.id, function(err, photo) {
        if(err) {
            console.log(err);
        }
        else {
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    console.log(err)
                }
                else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    photo.comments.push(comment);
                    photo.save();
                    req.flash("Added comment successfully!");
                    res.redirect("/photos/" + photo._id);
                };
            });
        };
    });
});

// EDIT comment route
router.get("/:comment_id/edit", middleware.isCommentOwner, function(req, res){
    Photo.findById(req.params.id, function(err, foundPhoto) {
        if(err || !foundPhoto){
            req.flash("error", "Photo not found!");
            return res.redirect("back");
        }   
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back")
            }
            else{
                res.render("comments/edit", {photo_id: req.params.id, comment: foundComment}); // this id is showpage id (type in app.js, not comment_id)
            }
        })
    })
})

//UPDATE comment route
router.put("/:comment_id", middleware.isCommentOwner, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/photos/" + req.params.id);
        }
    })  
})

//DELETE comment route
router.delete("/:comment_id", middleware.isCommentOwner, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back")
       }
       else{
           req.flash("success", "Deleted comment successfully!");
           res.redirect("/photos/"+ req.params.id);
       }
    });
})




module.exports = router;