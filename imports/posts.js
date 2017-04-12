import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Posts = new Mongo.Collection('posts');

// Publish
if (Meteor.isServer) {
	
	Meteor.publish('posts', function(PARAM_1, PARAM_2, PARAM_3) {
		
		check(PARAM_1, String);		
		//if(PARAM_3){ check(PARAM_3, String); }
		
		if(PARAM_1 == "notify"){
			return Posts.find({type:PARAM_1, owner_id:PARAM_2}, {sort: { createdAt: -1 }, limit:20 });
		}
		
		// if(PARAM_1 == "all"){
			// return Posts.find({}, {sort: { createdAt: -1 }, limit:10 });
		// }
		
		if(PARAM_1 == "notes"){
			return Posts.find({type:PARAM_1, owner_id:PARAM_2}, { sort: { createdAt: -1 }, limit:10  });			
		}
		
		// DESK
		// =======
		if(PARAM_1 == "desk_posts"){
			return Posts.find({type:PARAM_1, owner_id:PARAM_2}, { sort: { createdAt: -1 }, limit:10 });
		}
		
		
		
		
		// RESUMES
		// =======
		if(PARAM_1 == "resume_owner"){
			return Meteor.users.find({"profile.username": PARAM_2}); //TODO Restrict by fields, lower data use // PARAM_2 is slug
		}
		
		if(PARAM_1 == "resume_skill"){
			return Posts.find({type:"resume_skill", owner_username:PARAM_2},{ sort: { createdAt: 1 }, limit:10 }); //
		}
		
		if(PARAM_1 == "resume_education"){
			return Posts.find({type:"resume_education", owner_username:PARAM_2},{ sort: { createdAt: 1 }, limit:10 }); //
		}
		
		if(PARAM_1 == "resume_experience"){
			return Posts.find({type:"resume_experience", owner_username:PARAM_2},{ sort: { createdAt: 1 }, limit:10 }); //
		}
		
		if(PARAM_1 == "resume_education_date1"){
			return Posts.find({type:"resume_education_date1", owner_username:PARAM_2},{ sort: { createdAt: 1 }, limit:10 }); //
		}		
		if(PARAM_1 == "resume_education_date2"){
			return Posts.find({type:"resume_education_date2", owner_username:PARAM_2},{ sort: { createdAt: 1 }, limit:10 }); //
		}		
		if(PARAM_1 == "resume_education_type"){
			return Posts.find({type:"resume_education_type", owner_username:PARAM_2},{ sort: { createdAt: 1 }, limit:10 }); //
		}
		
		if(PARAM_1 == "resume_experience_group"){
			return Posts.find({type:"resume_experience_group", owner_username:PARAM_2},{ sort: { createdAt: 1 }, limit:10 }); //
		}
		if(PARAM_1 == "resume_experience_date1"){
			return Posts.find({type:"resume_experience_date1", owner_username:PARAM_2},{ sort: { createdAt: 1 }, limit:10 }); //
		}		
		if(PARAM_1 == "resume_experience_date2"){
			return Posts.find({type:"resume_experience_date2", owner_username:PARAM_2},{ sort: { createdAt: 1 }, limit:10 }); //
		}	
		
		
		
		// PEOPLE
		// =======
		if(PARAM_1 == "people_desk_posts"){
			
			var user = Meteor.users.findOne({"profile.username":PARAM_2}); 
			// We can add view permissions here :)
			return Posts.find({type:"desk_posts", owner_id:user._id}, { sort: { createdAt: -1 }, limit:10 });
		}
		
		if(PARAM_1 == "people_all"){
			return Meteor.users.find({},{limit:50}); //TODO Restrict by fields, lower data use
		}
		
		if(PARAM_1 == "people_search"){
			
			var search_type = 'name';
			var query_email = PARAM_2.split("@");
			var query_name  = PARAM_2.split(" ");
			
			console.log(query_email);
			console.log(query_name);
			
			if( query_email[1] ){ 
				search_type = "email"; 
			}
			
			if(search_type == "email"){
				console.log("SEARCHING FOR EMAIL: "+PARAM_2);
				return Meteor.users.find({"emails.address":PARAM_2}, {limit:6}); //TODO Restrict by fields, lower data use
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
		
		if(PARAM_1 == "people_desk"){
			return Meteor.users.find({"profile.username": PARAM_2}); //TODO Restrict by fields, lower data use // PARAM_2 is slug
		}
		
		// COLLEAGUES
		// =======
		if(PARAM_1 == "colleagues"){
			return Posts.find({type:"colleagues", owner_id: PARAM_2}, { sort: { createdAt: -1 } });			
		}
		
		// MEETINGS
		// =======
		if(PARAM_1 == "meetings"){
			return Posts.find({type:"meetings", owner_id: PARAM_2}, { sort: { createdAt: -1 } });			
		}
		
		if(PARAM_1 == "meetings_by_url"){
			return Posts.find({type:"meetings", slug:PARAM_2}, { sort: { createdAt: -1 } }); // PARAM_2 is a slug in this exception... lazy...			
		}
		
		// GROUPS
		// =======
		
		if(PARAM_1 == "groups"){
			return Posts.find({type:"groups", _id: PARAM_2}, { sort: { createdAt: -1 } });			
		}
		if(PARAM_1 == "groups_all"){
			return Posts.find({type:"groups", status:"publish"}, { sort: { createdAt: -1 }, limit:4*4 });			
		}
		if(PARAM_1 == "group_by_id"){
			return Posts.find({type:"groups", _id: PARAM_2, status:"publish"}, { sort: { createdAt: -1 } });			
		}
		if(PARAM_1 == "group_by_slug"){
			return Posts.find({type:"groups", slug: PARAM_2}, { sort: { createdAt: -1 } });			
		}
		
		if(PARAM_1 == "group_member_by_group_id"){
			return Posts.find({type:"group_member", _id:PARAM_2}, { sort: { createdAt: -1 } });			
		}
		if(PARAM_1 == "group_member_role_by_group_id"){
			return Posts.find({type:"group_member_role", parent_id:PARAM_2}, { sort: { createdAt: -1 } });			
		}
		if(PARAM_1 == "group_listing_by_group_id"){
			return Posts.find({type:"group_listing", parent_id:PARAM_2}, { sort: { createdAt: -1 } });			
		}
		if(PARAM_1 == "group_image_by_group_id"){
			return Posts.find({type:"group_image", parent_id:PARAM_2}, { sort: { createdAt: -1 } });			
		}
		if(PARAM_1 == "group_image"){
			return Posts.find({type:"group_image"}, { sort: { createdAt: -1 } });			
		}
		
		if(PARAM_1 == "group_member_by_user_id"){
			return Posts.find({type:"group_member", owner_id:PARAM_2}, { sort: { createdAt: -1 } });			
		}
		if(PARAM_1 == "group_members_all_by_slug"){
			return Posts.find({type:"group_member", slug:PARAM_2}, { sort: { createdAt: -1 } });			
		}
		
		if(PARAM_1 == "group_member_user_profile"){
			return Meteor.users.find({_id: PARAM_2}); //TODO Restrict by fields, lower data use // PARAM_2 is slug
		}
		
		if(PARAM_1 == "group_member_all_by_group_id"){
			return Posts.find({type:"group_member", parent_id: PARAM_2}, { sort: { createdAt: -1 } });			
		}
		if(PARAM_1 == "group_member_role"){
			return Posts.find({type:"group_member_role", parent_id: PARAM_2}, { sort: { createdAt: -1 } });			
		}
		if(PARAM_1 == "group_member_role_by_user_id"){
			return Posts.find({type:"group_member_role", owner_id: PARAM_2}, { sort: { createdAt: -1 } });			
		}
		if(PARAM_1 == "group_desk"){
			return Posts.find({type:"group_desk", slug: PARAM_2}, { sort: { createdAt: -1 } });			
		}
		if(PARAM_1 == "group_search"){
			return Posts.find({type:"groups","title":{ $regex : new RegExp(PARAM_2, "i") }, limit:4 });
		}	
		
		if(PARAM_1 == "group_people_all"){
			return Meteor.users.find({},{limit:8}); //TODO Restrict by fields, lower data use
		}
		
		if(PARAM_1 == "group_people_search"){
			
			var search_type = 'name';
			var query_email = PARAM_2.split("@");
			var query_name  = PARAM_2.split(" ");
			
			console.log(query_email);
			console.log(query_name);
			
			if( query_email[1] ){ 
				search_type = "email"; 
			}
			
			if(search_type == "email"){
				console.log("SEARCHING FOR EMAIL: "+PARAM_2);
				return Meteor.users.find({"emails.address":PARAM_2}, {limit:6}); //TODO Restrict by fields, lower data use
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
		if(PARAM_1 == "articles_by_group_slug"){
			return Posts.find({type:"article", status:"publish"}, { sort: { createdAt: -1 } });			
		}
		if(PARAM_1 == "articles_by_slug"){
			return Posts.find({type:"article", slug:PARAM_2, status:"publish"}, { sort: { createdAt: -1 } });			
		}
		if(PARAM_1 == "articles_by_group_parent_id"){
			return Posts.find({type:"article", parent_id:PARAM_2, status:"publish"}, { sort: { createdAt: -1 } });			
		}
		if(PARAM_1 == "article_by_id"){
			return Posts.find({type:"article", _id:PARAM_2}, { sort: { createdAt: -1 } });			
		}
		if(PARAM_1 == "article_content_by_article_id"){
			return Posts.find({type:"article_content", parent_id:PARAM_2}, { sort: { createdAt: -1 } });			
		}
		if(PARAM_1 == "article_image_by_article_id"){
			return Posts.find({type:"article_image", parent_id:PARAM_2}, { sort: { createdAt: -1 } });			
		}
		
		
		// PROJECTS
		// =======
		if(PARAM_1 == "groups_project_category"){
			return Posts.find({type:"groups_project_category", status:"publish"}, { sort: { createdAt: -1 } });			
		}
		if(PARAM_1 == "groups_project_category_by_id"){
			return Posts.find({type:"groups_project_category", _id: PARAM_2}, { sort: { createdAt: -1 } });			
		}
		if(PARAM_1 == "groups_project_category_by_parent_id"){
			return Posts.find({type:"groups_project_category", parent_id: PARAM_2}, { sort: { createdAt: -1 } });			
		}
		
		if(PARAM_1 == "groups_project_by_id"){
			return Posts.find({type:"groups_project", _id:PARAM_2, status:"publish"}, { sort: { createdAt: -1 } });			
		}
		if(PARAM_1 == "groups_project_by_parent_id"){
			return Posts.find({type:"groups_project", parent_id:PARAM_2, status:"publish"}, { sort: { createdAt: -1 } });			
		}
		
		// PROJECT COMMENTS
		// =======
		if(PARAM_1 == "group_projects_comment_by_id"){
			return Posts.find({type:"group_projects_comment", parent_id:PARAM_2, status:"publish"}, { sort: { createdAt: -1 }, limit:8 });			
		}
		
		
		// WORKERS
		// =======
		if(PARAM_1 == "project_worker_by_parent_id"){
			return Posts.find({type:"project_worker", parent_id:PARAM_2, status:"publish"}, { sort: { createdAt: -1 } });			
		}
		if(PARAM_1 == "project_worker_user_profile"){
			return Meteor.users.find({_id: PARAM_2}); //TODO Restrict by fields, lower data use // PARAM_2 is slug
		}
		
		// TASK LIST
		// =======
		if(PARAM_1 == "groups_task_list_by_id"){
			return Posts.find({type:"groups_task_list", _id:PARAM_2, status:"publish"}, { sort: { createdAt: -1 } });			
		}
		if(PARAM_1 == "groups_task_list_by_parent_id"){
			return Posts.find({type:"groups_task_list", parent_id:PARAM_2, status:"publish"}, { sort: { createdAt: -1 } });			
		}
		
		// TASK LIST COMMENTS
		// =======
		if(PARAM_1 == "groups_task_list_comments_by_parent_id"){
			return Posts.find({type:"groups_task_list_comments", parent_id:PARAM_2, status:"publish"}, { sort: { createdAt: -1 }, limit:8 });			
		}
		
		// TASKS
		// =======
		if(PARAM_1 == "tasks_by_parent_id"){
			return Posts.find({type:"task", parent_id:PARAM_2, status:"publish"}, { sort: { createdAt: -1 }, limit:40 });			
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
		if(status === null){ status = "published"; }
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
	'posts.leave_group'(groupId, PARAM_2) {
		check(groupId, String);
		check(PARAM_2, String);
		console.log("LEAVE GROUP: "+groupId);
		Posts.remove({type:"group_member", parent_id:groupId, owner_id:PARAM_2});
	},
	
	'posts.group_accept'(PARAM_2, group_parent_id) {
		
		Posts.update({owner_id:PARAM_2, parent_id:group_parent_id},
			{$set: {
				updatedAt: Date.now(), 
				status:"accepted",
				}
			}
		);
		
	},
	'posts.group_decline'(PARAM_2, group_parent_id) {
		
		Posts.remove({owner_id:PARAM_2, parent_id:group_parent_id});
		
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
