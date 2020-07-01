var	Campground		= require("../models/campground"),
	Comment			= require("../models/comment"),
	User			= require("../models/user");
	// All the middleware goes here!
var	middlewareObj	= {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {	
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err || !foundCampground){
				req.flash("error", "Campground not found")
				res.redirect("back")
			} else {
				// does the user own the campground?
				if(foundCampground.author.id.equals(req.user._id)) {
					next()
				} else {
					req.flash("error", "You don't have permission to do that")
					res.redirect("back")
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that")
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {	
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment){
				req.flash("error", "Comment not found")
				res.redirect("back")
			} else {
				// does the user own the comment?
				if(foundComment.author.id.equals(req.user._id)) {
					next()
				} else {
					req.flash("error", "You don't have permission to do that")
					res.redirect("back")
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that")
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	if(req['headers']['content-type'] === 'application/json'){
		return res.send({ error: "Login required" });
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
}

middlewareObj.isPaid = function(req, res, next) {
	if(req.user.isPaid) return next();
	
	req.flash("error", "Please pay registration fee to continue");
	res.redirect("/checkout");
}

module.exports = middlewareObj;