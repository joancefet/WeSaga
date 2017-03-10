import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Posts = new Mongo.Collection('posts');

// Publish
if (Meteor.isServer) {
	
	Meteor.publish('posts', function(action, userId, parent_id) {
		
		check(action, String);		
		if(parent_id){ check(parent_id, String); }
		
		if(action == "notify"){
			return Posts.find({type:action, owner_id:userId}, {sort: { createdAt: -1 }, limit:20 });
		}
		
		if(action == "all"){
			return Posts.find({}, {sort: { createdAt: -1 }, limit:10 });
		}
		
		if(action == "desk_posts"){
			return Posts.find({type:action, owner_id:userId}, { sort: { createdAt: -1 }, limit:10 });
		}
		
		if(action == "people_desk_posts"){
			
			var user = Meteor.users.findOne({"profile.username":userId}); 
			// We can add view permissions here :)
			return Posts.find({type:"desk_posts", owner_id:user._id}, { sort: { createdAt: -1 }, limit:10 });
		}
		
		if(action == "notes"){
			return Posts.find({type:action, owner_id:userId}, { sort: { createdAt: -1 }, limit:10  });			
		}
		
		if(action == "skyrooms"){
			return Posts.find({type:action}, { sort: { createdAt: -1 }, limit:10 });			
		}
		
		if(action == "people_all"){
			return Meteor.users.find({}); //TODO Restrict by fields, lower data use
		}
		
		if(action == "people_desk"){
			return Meteor.users.find({"profile.username": userId}); //TODO Restrict by fields, lower data use // UserId is slug
		}
		
		if(action == "colleagues"){
			return Posts.find({type:action, owner_id: userId}, { sort: { createdAt: -1 } });			
		}
		
		if(action == "meetings"){
			return Posts.find({type:action, owner_id: userId}, { sort: { createdAt: -1 } });			
		}
		
		if(action == "meetings_by_url"){
			return Posts.find({type:"meetings", slug:userId}, { sort: { createdAt: -1 } }); // UserId is a slug in this exception... lazy...			
		}
		
		
		
		
	});
	
}

// Collection Helpers
Posts.helpers({
	comments() {
		return Postsmeta.find({});
	}
});

// Security Stuff
Meteor.methods({
	
	'posts.update'(update_id, author, title, content, type, parent_id, status){
		
		if(author == "me") { author = Meteor.userId(); }
		if(parent_id === null){ parent_id = "not_set"; }
		if(status === null){ parent_id = "published"; }
		// console.log("POST UPDATE, LOOKING FOR: "+update_id);
		// var exists = Posts.find({_id:update_id});
		// console.log("EXISTS: "+exists);
		// console.log(exists);
		
		if( update_id == "new") {
			
			// NEW POST
			var post_id = Posts.insert({
				owner_id: author,
				owner_username: Meteor.user().username,
				owner_fullname: Meteor.user().profile.name_first +" "+Meteor.user().profile.name_last,
				owner_avatar: "/profileImages/"+Meteor.user().profile.avatar, 
				createdAt: Date.now(),
				updatedAt: Date.now(),
				timeAgo: new Date().toISOString(),
				menu_order: 0,
				slug: ToSeoUrl(title),
				
				title: title,
				content: content,
				type: type,
				parent_id: parent_id,
				status:status,
			});
			// assert(Posts.find().count() === 1); // // Changes are visible immediately -- no waiting for a round trip to the server.
			console.log("--------- NEW POST: "+post_id);
			
			return post_id;
			
		} else {
			
			// UPDATE EXISTING POST
			Posts.update(update_id,
				{$set: {
					updatedAt: Date.now(), 
					title:title,
					content:content,
					status:status,
					}
				}
			);
			
			return update_id;
			
		}
	  
	},
	
	// Colleagues
	'posts.updateColleagueStatusActor'(update_id,status){
		Posts.update(update_id,
			{$set: {
				updatedAt: Date.now(), 
				status:status,
				}
			}
		);
	},
	'posts.updateColleagueStatusOwner'(parent_id,status){
		Posts.update({parent_id:parent_id},
			{$set: {
				updatedAt: Date.now(), 
				status:status,
				}
			}
		);
	},
	
	'posts.trash'(postId){
		Posts.update({_id:postId},
			{$set: {
				updatedAt: Date.now(),
				status:"trash",
				}
			}
		);
	},

	'posts.remove'(postId) {
		check(postId, String);
		console.log("REMOVE POST: "+postId);
		Posts.remove({_id:postId});
	},
	
	'posts.removeByTitle'(post_title) {
		check(post_title, String);
		console.log("REMOVE BY TITLE: "+post_title);
		Posts.remove({title:post_title});

	},
	
	// Notifications
	'posts.updateNotificationsRead'(owner_id){
		console.log("SETTING ALL READ FOR "+owner_id);
		Posts.update({owner_id:owner_id, type:"notify"},
			{$set: {
				updatedAt: Date.now(), 
				status:"read",
				}
			}, {multi: true}
		);
	},
	
	

});




// SEO URL
function ToSeoUrl(url) { 
	var encodedUrl = url.toString().toLowerCase(); 
	
	// Trim to 20 characters
	encodedUrl = encodedUrl.substring(0, 40);

	// replace & with and           
	encodedUrl = encodedUrl.split(/\&+/).join("-and-")

	// remove invalid characters 
	encodedUrl = encodedUrl.split(/[^a-z0-9]/).join("-");       

	// remove duplicates 
	encodedUrl = encodedUrl.split(/-+/).join("-");

	// trim leading & trailing characters 
	encodedUrl = encodedUrl.trim('-'); 
	
	return encodedUrl; 
}

// GUID
function guid() {
  function s4() {
	return Math.floor((1 + Math.random()) * 0x10000)
	  .toString(16)
	  .substring(1);
  }
  return s4() + s4();
}
