import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Posts = new Mongo.Collection('posts');

// Publish
if (Meteor.isServer) {
	
	Meteor.publish('posts', function(action, userId, parent_id) {
		
		check(action, String);		
		//if(parent_id){ check(parent_id, String); }
		
		if(action == "notify"){
			return Posts.find({type:action, owner_id:userId}, {sort: { createdAt: -1 }, limit:20 });
		}
		
		// if(action == "all"){
			// return Posts.find({}, {sort: { createdAt: -1 }, limit:10 });
		// }
		
		if(action == "notes"){
			return Posts.find({type:action, owner_id:userId}, { sort: { createdAt: -1 }, limit:10  });			
		}
		
		// DESK
		// =======
		if(action == "desk_posts"){
			return Posts.find({type:action, owner_id:userId}, { sort: { createdAt: -1 }, limit:10 });
		}
		
		
		
		
		// RESUMES
		// =======
		if(action == "resume_owner"){
			return Meteor.users.find({"profile.username": userId}); //TODO Restrict by fields, lower data use // UserId is slug
		}
		
		if(action == "resume_skill"){
			return Posts.find({type:action, owner_username:userId},{ sort: { createdAt: 1 }, limit:10 }); //
		}
		
		if(action == "resume_education"){
			return Posts.find({type:action, owner_username:userId},{ sort: { createdAt: 1 }, limit:10 }); //
		}
		
		if(action == "resume_experience"){
			return Posts.find({type:action, owner_username:userId},{ sort: { createdAt: 1 }, limit:10 }); //
		}
		
		
		
		// PEOPLE
		// =======
		if(action == "people_desk_posts"){
			
			var user = Meteor.users.findOne({"profile.username":userId}); 
			// We can add view permissions here :)
			return Posts.find({type:"desk_posts", owner_id:user._id}, { sort: { createdAt: -1 }, limit:10 });
		}
		
		if(action == "people_all"){
			return Meteor.users.find({},{limit:50}); //TODO Restrict by fields, lower data use
		}
		
		if(action == "people_search"){
			
			var search_type = 'name';
			var query_email = userId.split("@");
			var query_name  = userId.split(" ");
			
			console.log(query_email);
			console.log(query_name);
			
			if( query_email[1] ){ 
				search_type = "email"; 
			}
			
			if(search_type == "email"){
				console.log("SEARCHING FOR EMAIL: "+userId);
				return Meteor.users.find({"emails.address":userId}, {limit:6}); //TODO Restrict by fields, lower data use
			}
			
			if(search_type =="name"){
				
				if(query_name[1] == ""){
					console.log("SEARCHING FOR FIRST NAME: "+query_name[0]);
					return Meteor.users.find({"profile.name_first":{ $regex : new RegExp(query_name[0], "i") } }, {limit:6}); //TODO Restrict by fields, lower data use
				}
				if(query_name[1] != ""){
					console.log("SEARCHING FOR FIRST AND LAST NAME: "+query_name[0]+" "+query_name[1]);
					return Meteor.users.find({"profile.name_first":{ $regex : new RegExp(query_name[0], "i")}, "profile.name_last":{ $regex : new RegExp(query_name[1], "i")} }, {limit:6}); //TODO Restrict by fields, lower data use
				}
			}
		}	
		
		if(action == "people_desk"){
			return Meteor.users.find({"profile.username": userId}); //TODO Restrict by fields, lower data use // UserId is slug
		}
		
		// COLLEAGUES
		// =======
		if(action == "colleagues"){
			return Posts.find({type:action, owner_id: userId}, { sort: { createdAt: -1 } });			
		}
		
		// MEETINGS
		// =======
		if(action == "meetings"){
			return Posts.find({type:action, owner_id: userId}, { sort: { createdAt: -1 } });			
		}
		
		if(action == "meetings_by_url"){
			return Posts.find({type:"meetings", slug:userId}, { sort: { createdAt: -1 } }); // UserId is a slug in this exception... lazy...			
		}
		
		// GROUPS
		// =======
		if(action == "groups"){
			return Posts.find({type:action, _id: userId}, { sort: { createdAt: -1 } });			
		}
		if(action == "group_by_id"){
			return Posts.find({type:"groups", _id: userId}, { sort: { createdAt: -1 } });			
		}
		if(action == "group_by_slug"){
			return Posts.find({type:"groups", slug: userId}, { sort: { createdAt: -1 } });			
		}
		if(action == "groups_all"){
			return Posts.find({type:"groups", status:"publish"}, { sort: { createdAt: -1 } });			
		}
		if(action == "group_members_all_by_slug"){
			return Posts.find({type:"group_member", slug:userId}, { sort: { createdAt: -1 } });			
		}
		if(action == "group_member"){
			return Posts.find({type:"group_member", owner_id: userId}, { sort: { createdAt: -1 } });			
		}
		if(action == "group_member_user_profile"){
			return Meteor.users.find({_id: userId}); //TODO Restrict by fields, lower data use // UserId is slug
		}
		if(action == "group_member_by_group_id"){
			return Posts.find({type:"group_member", owner_id: userId, parent_id: parent_id}, { sort: { createdAt: -1 } });			
		}
		if(action == "group_member_all_by_group_id"){
			return Posts.find({type:"group_member", parent_id: userId}, { sort: { createdAt: -1 } });			
		}
		if(action == "group_member_role"){
			return Posts.find({type:"group_member_role", parent_id: userId}, { sort: { createdAt: -1 } });			
		}
		if(action == "group_member_role_by_user_id"){
			return Posts.find({type:"group_member_role", owner_id: userId}, { sort: { createdAt: -1 } });			
		}
		if(action == "group_desk"){
			return Posts.find({type:action, slug: userId}, { sort: { createdAt: -1 } });			
		}
		if(action == "group_search"){
			
			var search_query = userId; // Need to rename the parameters soon...
			
			console.log("SEARCHING FOR GROUP: "+search_query);
			
			return Posts.find({type:"groups","title":{ $regex : new RegExp(search_query, "i") } }, {limit:8}); //TODO Restrict by fields, lower data use
			
		}	
		
		if(action == "group_people_all"){
			return Meteor.users.find({},{limit:8}); //TODO Restrict by fields, lower data use
		}
		
		if(action == "group_people_search"){
			
			var search_type = 'name';
			var query_email = userId.split("@");
			var query_name  = userId.split(" ");
			
			console.log(query_email);
			console.log(query_name);
			
			if( query_email[1] ){ 
				search_type = "email"; 
			}
			
			if(search_type == "email"){
				console.log("SEARCHING FOR EMAIL: "+userId);
				return Meteor.users.find({"emails.address":userId}, {limit:6}); //TODO Restrict by fields, lower data use
			}
			
			if(search_type =="name"){
				
				if(query_name[1] == ""){
					console.log("SEARCHING FOR FIRST NAME: "+query_name[0]);
					return Meteor.users.find({"profile.name_first":{ $regex : new RegExp(query_name[0], "i") } }, {limit:6}); //TODO Restrict by fields, lower data use
				}
				if(query_name[1] != ""){
					console.log("SEARCHING FOR FIRST AND LAST NAME: "+query_name[0]+" "+query_name[1]);
					return Meteor.users.find({"profile.name_first":{ $regex : new RegExp(query_name[0], "i")}, "profile.name_last":{ $regex : new RegExp(query_name[1], "i")} }, {limit:6}); //TODO Restrict by fields, lower data use
				}
			}
		}	
		
		// ARTICLES
		// =======
		if(action == "articles_by_group_slug"){
			return Posts.find({type:"article", status:"publish"}, { sort: { createdAt: -1 } });			
		}
		if(action == "articles_by_slug"){
			return Posts.find({type:"article", slug:userId, status:"publish"}, { sort: { createdAt: -1 } });			
		}
		if(action == "articles_by_group_parent_id"){
			return Posts.find({type:"article", parent_id:userId, status:"publish"}, { sort: { createdAt: -1 } });			
		}
		if(action == "article_by_id"){
			return Posts.find({type:"article", _id:userId}, { sort: { createdAt: -1 } });			
		}
		if(action == "article_content_by_article_id"){
			return Posts.find({type:"article_content", parent_id:userId}, { sort: { createdAt: -1 } });			
		}
		if(action == "article_image_by_article_id"){
			return Posts.find({type:"article_image", parent_id:userId}, { sort: { createdAt: -1 } });			
		}
		
		
		// PROJECTS
		// =======
		if(action == "groups_project_category"){
			return Posts.find({type:action, status:"publish"}, { sort: { createdAt: -1 } });			
		}
		if(action == "groups_project_category_by_id"){
			return Posts.find({type:"groups_project_category", _id: userId}, { sort: { createdAt: -1 } });			
		}
		if(action == "groups_project_category_by_parent_id"){
			return Posts.find({type:"groups_project_category", parent_id: userId}, { sort: { createdAt: -1 } });			
		}
		
		if(action == "groups_project_by_id"){
			return Posts.find({type:"groups_project", _id:userId, status:"publish"}, { sort: { createdAt: -1 } });			
		}
		if(action == "groups_project_by_parent_id"){
			return Posts.find({type:"groups_project", parent_id:userId, status:"publish"}, { sort: { createdAt: -1 } });			
		}
		
		// PROJECT COMMENTS
		// =======
		if(action == "group_projects_comment_by_id"){
			return Posts.find({type:"group_projects_comment", parent_id:userId, status:"publish"}, { sort: { createdAt: -1 }, limit:8 });			
		}
		
		
		// WORKERS
		// =======
		if(action == "project_worker_by_parent_id"){
			return Posts.find({type:"project_worker", parent_id:userId, status:"publish"}, { sort: { createdAt: -1 } });			
		}
		if(action == "project_worker_user_profile"){
			return Meteor.users.find({_id: userId}); //TODO Restrict by fields, lower data use // UserId is slug
		}
		
		// TASK LIST
		// =======
		if(action == "groups_task_list_by_id"){
			return Posts.find({type:"groups_task_list", _id:userId, status:"publish"}, { sort: { createdAt: -1 } });			
		}
		if(action == "groups_task_list_by_parent_id"){
			return Posts.find({type:"groups_task_list", parent_id:userId, status:"publish"}, { sort: { createdAt: -1 } });			
		}
		
		// TASK LIST COMMENTS
		// =======
		if(action == "groups_task_list_comments_by_parent_id"){
			return Posts.find({type:"groups_task_list_comments", parent_id:userId, status:"publish"}, { sort: { createdAt: -1 }, limit:8 });			
		}
		
		// TASKS
		// =======
		if(action == "tasks_by_parent_id"){
			return Posts.find({type:"task", parent_id:userId, status:"publish"}, { sort: { createdAt: -1 }, limit:40 });			
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
				owner_username: Meteor.user().profile.username,
				owner_fullname: Meteor.user().profile.name_first +" "+Meteor.user().profile.name_last,
				owner_avatar: ""+Meteor.user().profile.avatar, 
				createdAt: Date.now(),
				updatedAt: Date.now(),
				timeAgo: new Date().toISOString(),
				menu_order: 0,
				slug: ToSeoUrl(title)+"-"+guid(),
				
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
	
	// CheckBoxes
	'posts.updateCheckbox'(update_id,isChecked){
		Posts.update(update_id,
			{$set: {
				updatedAt: Date.now(), 
				content:isChecked,
				}
			}
		);
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
	
	'posts.removeByParent'(postId) {
		check(postId, String);
		console.log("REMOVE BY PARENT: "+postId);
		Posts.remove({parent_id:postId});
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
	
	// GROUPS
	// ======
	'posts.leave_group'(groupId, userId) {
		check(groupId, String);
		check(userId, String);
		console.log("LEAVE GROUP: "+groupId);
		Posts.remove({type:"group_member", parent_id:groupId, owner_id:userId});
	},
	
	'posts.group_accept'(userId, group_parent_id) {
		
		Posts.update({owner_id:userId, parent_id:group_parent_id},
			{$set: {
				updatedAt: Date.now(), 
				status:"accepted",
				}
			}
		);
		
	},
	'posts.group_decline'(userId, group_parent_id) {
		
		Posts.remove({owner_id:userId, parent_id:group_parent_id});
		
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
