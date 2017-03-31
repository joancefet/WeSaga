import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// ROUTER
//=========
Router.route('/group/:group_slug/people',{
	data:function(){
		
	},
	waitOn: function(){
		Meteor.subscribe('posts', 'group_by_slug',  ToSeoUrl(Router.current().params.group_slug) );
		window.subscription_group_people_search = "";
		//window.subscription_group_people = Meteor.subscribe('posts', 'group_people_all', Router.current().params.group_slug);
	},
	template:'screen',
	yieldTemplates: {
		'group_people': {to: 'content'},
	}
	
});

Template.group_people.rendered = function() {

};


// Events
Template.group_people.events({
	
	// SEARCH
	// ------
	'submit .search_start'(event) {
		
		event.preventDefault();
		
		$(".search_container").hide(); 
		$(".show_loader").show();
		$(".search_container_message").html("");
		
		window.subscription_people.stop();
		
		if(window.subscription_people_search){ 
			window.subscription_people_search.stop(); 
		}
		window.subscription_people_search = Meteor.subscribe('posts', 'people_search', $(".search_value").val());
		
		setTimeout(function(){
			$(".search_container").show();
			$(".show_loader").hide();
			$(".search_container_message").html("We found the following People");
		},2000);
		
	},
	
	// ADD / CANCEL / REMOVE
	// ---------------------
	'submit'(event) {
		event.preventDefault();
		
		const target = event.target;
		
		// ---------------
		// Add Colleague
		// ---------------
		if(target.action.value == "add"){
			
			swal({
				title: "Colleague Request Sent!",
				text: "",
				type: "success",
				showCancelButton: false,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Close",
				
			});
			
			// Add Notification and Meta data		
			Meteor.call('posts.update',
				"new",
				target.user_id.value,
				"Colleague Request from "+Meteor.user().profile.username,
				"",
				"notify",
				"",
				"new",
				function(error, return_post_id){
					
					// Colleague Request as a POST to ME
					Meteor.call('posts.update',
						"new",
						Meteor.userId(),
						target.user_id.value,
						"",
						"colleagues",
						return_post_id,
						"waiting"
					);
					
					// Colleague Request as a POST to YOU
					Meteor.call('posts.update',
						"new",
						target.user_id.value,
						Meteor.userId(),
						"",
						"colleagues",
						return_post_id,
						"request"
					);
					
				}
			);
		} // Add
		
		
		// ---------------
		// Cancel
		// ---------------
		if(target.action.value == "cancel"){
			swal({
				title: "Colleague Request Cancelled",
				text: "",
				type: "warning",
				showCancelButton: false,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Close",
				
			});
			
			// 1-OWNER) owner_id:, type:colleague, status:"waiting"
			// 2-ACTOR) 
			// 	noitifcation) PARENT ID
			// 	post)         TITLE
			
			// Remove Owner Colleague Post
			Meteor.call('posts.remove',
				target.post_id.value,
			);
			
			// Remove all requests, in this case 2 posts are removed
			Meteor.call('posts.remove',
				target.parent_id.value,
			);
			// The notify owner is stored in the title of the post
			Meteor.call('posts.removeByTitle',
				target.owner_id.value,
			);
			
		}
		
		// ---------------
		// Accept
		// ---------------
		if(target.action.value == "accept"){
			swal({
				title: "You are now Colleagues!",
				text: "",
				type: "success",
				showCancelButton: false,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Close",
				
			});
			
			// Update to accepted for Owner
			Meteor.call('posts.updateColleagueStatusActor',
				target.post_id.value,
				"accepted"
			);
			
			// Update to accepted for Owner
			Meteor.call('posts.updateColleagueStatusOwner',
				target.parent_id.value,
				"accepted"
			);

			// Notify the requesting user about the new colleague
			Meteor.call('posts.update',
				"new",
				target.title.value,
				"Colleague Accepted",
				"",
				"notify",
				"",
				"new"
			);
			
		}
		
		// ---------------
		// Remove
		// ---------------
		if(target.action.value == "remove"){
			
			swal({
				title: "Really remove this Colleague?",
				text: "",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Confirm",
				
			},
				function(){
					
					swal.close();
					
					// Remove to accepted for Me
					Meteor.call('posts.remove',
						target.post_id.value,
						"accepted"
					);
					
					// Remove to accepted for Colleague
					Meteor.call('posts.removeByTitle',
						target.owner_id.value,
						"accepted"
					);
				
					setTimeout(function(){
					
						swal({
							title: "You no longer Colleagues",
							text: "",
							type: "danger",
							confirmButtonColor: "#DD6B55",
							confirmButtonText: "Close",
						});
					
					},100);
						
				}
					
				
			);

			
		}
		
		// ---------------
		// Remove From Group
		// ---------------
		if(target.action.value == "remove_from_group"){
			
			swal({
				title: "Remove from Group?",
				text: "",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Confirm",
			},
				function(){
					
					swal.close();
					
					// Remove to accepted for Me
					// Meteor.call('posts.remove',
						// target.post_id.value,
						// "accepted"
					// );
					
					// // Remove to accepted for Colleague
					// Meteor.call('posts.removeByTitle',
						// target.owner_id.value,
						// "accepted"
					// );
				
					setTimeout(function(){
					
						swal({
							title: "Removed from Group",
							text: "",
							type: "danger",
							confirmButtonColor: "#DD6B55",
							confirmButtonText: "Close",
						});
					
					},100);
						
				}
					
				
			);

			
		} 
		
	}
	
});

// Events
Template.group_people.helpers({
	
	group_slug(){
		return Router.current().params.group_slug; 
	},
	slug(title){
		return ToSeoUrl(title); 
	},
	
	people() {
		
		// Fetch the group
		var group = Posts.findOne({type:"groups"});
		
		// Fetch Group Members post
		Meteor.subscribe('posts', 'group_member_all_by_group_id', group._id );
		
		// Subscribe to those users
		var members = Posts.find({type:"group_member", status:"accepted"});
		members.forEach(function(member){
			Meteor.subscribe('posts', 'group_member_user_profile', member.owner_id );
			Meteor.subscribe('posts', 'group_member_role', member.owner_id);
		});
		
		return Meteor.users.find({ _id:{$ne:Meteor.userId()} }); // All users except ME
		
		
		// if( window.subscription_group_people_search == "" ){
			
			// // Find all members, retreive their profile
			// var members = Posts.find({});
			
		// }else{
			
		// }
	},
	
	noColleagueStatus(){
		var posts = Posts.findOne({title:this._id });
		if(posts){
		}else{
			return "notFound";
			
		}
	},	
	colleagueStatus(userId) {	
		
		return Posts.find({title:this._id}); 
		
	},
	checkStatus(status){
		var posts = Posts.findOne({_id:this._id, type:"colleagues" });
		if(posts.status == status){
			return true;
		}else{
			return false;
		}
	},
	groupAdmin(){
		var admin = Posts.findOne({slug:ToSeoUrl(Router.current().params.group_slug), type:"group_member_role", "status":"admin", owner_id:Meteor.userId() });
		if(admin){
			return true;
		}else{
			return false;
		}
	}
	
});

