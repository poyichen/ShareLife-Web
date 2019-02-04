var Photo = require("../models/photo");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.isCommentOwner = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found!");
                res.redirect("back");
            }
            else{
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }
                else{
                    req.flash("error", "You don't have enough permission to do that");
                    res.redirect("back");
                }
            }
        })
    }
    else{
        req.flash("error", "Please Login First!");
        res.redirect("back");
    }
}

middlewareObj.isPhotoOwner = function (req, res, next){
    if(req.isAuthenticated()){
        Photo.findById(req.params.id, function(err, foundPhoto){
            if(err || !foundPhoto){
                req.flash("error", "Photo not found!");
                res.redirect("back");
            }
            else{
                if(foundPhoto.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }
                else{
                    req.flash("error", "You don't have enough permission to do that");
                    res.redirect("back");
                }
            }
        })
    }
    else{
        req.flash("error", "Please Login First!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
}

module.exports = middlewareObj;