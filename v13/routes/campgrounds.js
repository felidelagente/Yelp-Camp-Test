var express		= require("express"),
	router		= express.Router(),
	Campground	= require("../models/campground"),
	Comment 	= require("../models/comment");

let	{checkCampgroundOwnership, isLoggedIn, isPaid}	= require("../middleware");
router.use(isLoggedIn,isPaid);
// INDEX - Show all campgrounds 
router.get("/", function(req, res){	
	if(req.query.paid) res.locals.success = "Payment succeded, welcome to YelpCamp!"
	// 	get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
		}
	});	
});
// CREATE - Add new campground to DB
router.post("/", function(req, res){
	// 	Get Data from form and add to campgrounds array
	var	name	= req.body.name,
		price	= req.body.price,
		image	= req.body.image,
		desc	= req.body.description,
		author	= {
			id: req.user._id,
			username: req.user.username
		}
		newCampground = {name: name, price:price, image: image, description: desc, author: author}
	// create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else{
			console.log(newlyCreated)
			req.flash("success", "You created a campground")
			res.redirect("/campgrounds");
		}
	});	
})
// NEW Show form to create campground 
router.get("/new", (req, res) =>{
	res.render("campgrounds/new")
});

// SHOW show info about one campground  in particular
router.get("/:id", function(req, res){
	// 	find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
		req.flash("error", "Campground not found!")
		res.redirect("back");
		console.log(err)
		} else {
		console.log(foundCampground);
	// 	render show template with that campground
		res.render('campgrounds/show', {campground: foundCampground});
		}
	});
});


// EDIT ROUTE
router.get("/:id/edit", checkCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
})
// UPDATE CAMPGROUND ROUTE

router.put("/:id", checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Campground updated")
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		Comment.deleteMany({
			"_id": {
				$in: campground.comments
			}
		}, function(err) {
			if(err) return next(err);
			campground.remove();
			req.flash("success", "Campground deleted")
			res.redirect("/campgrounds");
		});	
	});
});
module.exports = router;
