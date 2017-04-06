// Route
import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// Route
Router.route('/people',{

	data:function(){
		
		if( !Meteor.user() ){
			Router.go('/');
		}
	},
	waitOn: function(){
		window.subscription_people_search = "";
		window.subscription_people = Meteor.subscribe('posts', 'people_all'); 		
	},
	template:'screen',
	yieldTemplates: {
		'people': {to: 'content'},
	}
	
});


// Render
Template.people.rendered = function() {

};


// Events
Template.people.events({
	
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
		
	}
	
});

// Events
Template.people.helpers({
	
	people() {
		return Meteor.users.find({ _id:{$ne:Meteor.userId()} }); // All users except ME
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
	}
	
});
