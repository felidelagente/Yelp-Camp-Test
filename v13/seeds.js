const	mongoose 	= require("mongoose"),
 		Campground 	= require("./models/campground"),
		Comment		= require("./models/comment")

var seeds =[
	{
		name: "CLoud's Rest",
		image: "https://images.unsplash.com/photo-1488790881751-9068aa742b9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=889&q=80",
		description: "With Indiana RV resorts located throughout the Hoosier State, there are ample opportunities to enjoy Midwest hospitality and accommodations. RVontheGO offers a variety of rental communities, camping resorts, and RV campgrounds in Indiana. From the northern boundaries of the state to the south and central regions, our RV campgrounds are in prime Indiana territory. With RV resorts situated near major interstates, it’s easy to stop by on your way through town or hook up with us for a more dedicated stay.",
		author:{
            id : "588c2e092403d111454fff76",
            username: "Jack"
        }
	},	
	{
		name: "Icy Point",
		image: "https://images.unsplash.com/photo-1455496231601-e6195da1f841?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=795&q=80",
		description: "With Indiana RV resorts located throughout the Hoosier State, there are ample opportunities to enjoy Midwest hospitality and accommodations. RVontheGO offers a variety of rental communities, camping resorts, and RV campgrounds in Indiana. From the northern boundaries of the state to the south and central regions, our RV campgrounds are in prime Indiana territory. With RV resorts situated near major interstates, it’s easy to stop by on your way through town or hook up with us for a more dedicated stay.",
		author:{
            id : "588c2e092403d111454fff77",
            username: "Jill"
        }
	},
	{
		name: "Canyon Floor",
		image: "https://images.unsplash.com/photo-1564577160324-112d603f750f?ixlib=rb-1.2.1&auto=format&fit=crop&w=751&q=80",
		description: "With Indiana RV resorts located throughout the Hoosier State, there are ample opportunities to enjoy Midwest hospitality and accommodations. RVontheGO offers a variety of rental communities, camping resorts, and RV campgrounds in Indiana. From the northern boundaries of the state to the south and central regions, our RV campgrounds are in prime Indiana territory. With RV resorts situated near major interstates, it’s easy to stop by on your way through town or hook up with us for a more dedicated stay.",
		author:{
            id : "588c2e092403d111454fff78",
            username: "Jane"
        }
	}
	
];

async function seedDB() {
	try {
		await Campground.deleteMany({});
		console.log('Campgrounds removed');
		await Comment.deleteMany({});
		console.log('Comments removed');
		
		for(const seed of seeds) {
			let campground = await Campground.create(seed);
			console.log('Campground created');
			let comment = await Comment.create(
				{
					text: 'this place is great, but I wish there was internet',
					author: 'Homer'
				}
			)
			console.log('Comment created');
			campground.comments.push(comment);
			campground.save();
			console.log('Comment added to campground');
		}
	} catch(err) {
		console.log(err);
	}
}
module.exports = seedDB;