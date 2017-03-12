// Route
import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';


// Route
Router.route('/people/:user_slug',{

	data:function(){
		
	},
	waitOn: function(){
		Meteor.subscribe('posts', 'people_desk',  ToSeoUrl(Router.current().params.user_slug) );
		Meteor.subscribe('posts', "people_desk_posts", ToSeoUrl(Router.current().params.user_slug) ); 
	},
	template:'screen',
	yieldTemplates: {
		'people_desk': {to: 'content'},
	}
	
});

Template.people_desk.events({
	
	// Submit New Post
	'submit .new-post'(event) {
		
		event.preventDefault();
		const target = event.target;
		
		Meteor.call('posts.update',
			"new",
			target.owner_id.value,
			"",
			$(".new-post .form-control").val(),
			"desk_posts",
			"",
			"publish"
		);
		$(".new-post .form-control").val(""); // reset
		
	},
	
	// Comment
	'submit .comment'(event) {
		event.preventDefault();
		
		const target = event.target;
		console.log(target);
		
		Meteor.call('postsmeta.update',
			"new",
			"me",
			"",
			target.content.value,
			"post_comment",
			target.parent_id.value,
		);
		
		$('[name=content]').val('');
	},
	
	
	
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
				closeOnConfirm: true
			});
			
			// Add Notification and Meta data		
			var post_id = Meteor.call('posts.update',
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
				closeOnConfirm: true
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
				closeOnConfirm: true
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
				closeOnConfirm: true
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


Template.people_desk.helpers({
	
	people_desk() {
		//Meteor.subscribe('postsmeta', "notify_meta", this._id); 
		return Meteor.users.findOne({ "profile.username":Router.current().params.user_slug }); 
	},
	desk_posts() {
		return Posts.find({type:"desk_posts"}, {sort: { createdAt: -1 } });
	},
	desk_comments(){
		// SUBSCRIBE TO POSTMETA: parent_id
		Meteor.subscribe('postsmeta', "desk_comments", this._id); 
		return Postsmeta.find({parent_id:this._id});
	},
	HasOwnerAvatar(){
		if(this.owner_avatar != "https://dlnde5a0p49uc.cloudfront.net/files/undefined"){
			return true;
		}
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
	
	slug(string){
		return ToSeoUrl(string);
	}
	
});