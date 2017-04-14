// Route
import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';


// Route
Router.route('/people/:user_slug',{

	data:function(){
	
	},
	waitOn: function(){
		
		Meteor.subscribe('posts', "notify", Meteor.userId() ); 
		Meteor.subscribe('posts', "colleagues", Meteor.userId() ); 
		
		// Cannot view yourself here
		if(Meteor.user().profile.username == ToSeoUrl(Router.current().params.user_slug) ){
			Router.go("/desk");
		}
		
		Meteor.subscribe('posts', 'people_desk',  ToSeoUrl(Router.current().params.user_slug) );
		Meteor.subscribe('posts', "people_desk_posts", ToSeoUrl(Router.current().params.user_slug) ); 
		
		Meteor.subscribe('posts', "resume_experience", ToSeoUrl(Router.current().params.user_slug) ); 
			Meteor.subscribe('posts', "resume_experience_group", ToSeoUrl(Router.current().params.user_slug) );
			Meteor.subscribe('posts', "resume_experience_date1", ToSeoUrl(Router.current().params.user_slug) );
			Meteor.subscribe('posts', "resume_experience_date2", ToSeoUrl(Router.current().params.user_slug) );	
			Meteor.subscribe('posts', "resume_experience_type", ToSeoUrl(Router.current().params.user_slug) );
	},
	template:'screen',
	yieldTemplates: {
		'people_desk': {to: 'content'},
	}
	
});

// Render
// ==============
Template.people_desk.rendered = function() {
	
	//Load Google Map
	GoogleMaps.load({key: 'AIzaSyATUzfjVr1TtxqBIvDJa2AKnNYdgu_XXKE'});

	//Place Marker on User Location.
	GoogleMaps.ready('profileMap', function(map) {
		var marker = new google.maps.Marker({
			position: map.options.center,
			map: map.instance
		});
	});

	
};

// Events
// ==============
Template.people_desk.events({
	
	// Submit New Post
	'click .people_submit_new_post'(event) {
		
		event.preventDefault();
		const target = event.target;
		
		if( $(".newPostContent").val().length < 1 ){
			return;
		}
		
		Meteor.call('posts.update',
			"new",
			$("#owner_id").val(),
			"",
			$(".newPostContent").val(),
			"desk_posts",
			"",
			"publish",
			function(error, parent_post_id){
				
				// Upload Attachments				
				input = document.getElementById('fileInput');
				for(var i = 0; i < input.files.length ; i++){(function(i) {
					var file = input.files[i];
					
					// Send to Cloudinary
					Cloudinary.upload( file, function(error, result){
						
						Meteor.call('posts.update',
							"new",
							"me",
							"",
							"https://res.cloudinary.com/skyroomsio/image/upload/a_0/"+result.public_id+"."+result.format, 
							"desk_posts_attachment",
							parent_post_id,
						);
						console.log("ADDED desk_posts_attachment to:" +parent_post_id);
					});
					
					
				})(i); }

				// Reset Form
				$(".newPostContent").val(""); 
				$("#fileInput").val("");
				$(".fileInput_count").html("");
				
			}
		);
		$(".new-post .form-control").val(""); // reset
		
	},
	
	// Comment
	'submit .comment'(event) {
		event.preventDefault();
		
		const target = event.target;
		console.log(target);
		
		Meteor.call('posts.update',
			"new",
			"me",
			"",
			target.content.value,
			"desk_posts_comments",
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
				type: "question",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Confirm",
				
			}).then(function (result) {
				
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
						type: "error",
						showCancelButton: false,
					});
				
				},100);
					
			});

			
		} 
		
	}
	
	
});	


Template.people_desk.helpers({
	
	people_desk() {
		return Meteor.users.findOne({ "profile.username":Router.current().params.user_slug }); 
	},
	desk_posts() {
		return Posts.find({type:"desk_posts"}, {sort: { createdAt: -1 } });
	},
	desk_posts_attachment(){
		Meteor.subscribe('posts', "desk_posts_attachment", this._id);
		return Posts.find({type: "desk_posts_attachment", parent_id:this._id});
	},
	desk_posts_comments(){
		// SUBSCRIBE TO POSTMETA: parent_id
		Meteor.subscribe('posts', "desk_posts_comments", this._id); 
		return Posts.find({parent_id:this._id});
	},
	
	
	HasOwnerAvatar(){
		if(this.owner_avatar != "undefined"){
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
	},
	
	mapOptions: function() {
		
		// Find the map owner
		var user = Meteor.users.findOne({"profile.username": ToSeoUrl(Router.current().params.user_slug) });
				
		if (GoogleMaps.loaded()) {
			return {
				center: new google.maps.LatLng(user.profile.location_latitude, user.profile.location_longitude),
				zoom: 8,
				disableDefaultUI: true, 
				draggable: false,
				scrollwheel: false,
				disableDoubleClickZoom: true,
			};
			console.log("There was NOT an error!");
		} else {
			console.log("There was an error!");
		}
	},
	
	resume_experience(){
		return Posts.find({type:"resume_experience"}, {sort: { createdAt: 1 }, limit:1 });
	},
	resume_experience_group(){
		return Posts.find({type:"resume_experience_group", parent_id:this._id});
	},
	resume_experience_date1(){
		return Posts.find({type:"resume_experience_date1", parent_id:this._id});
	},
	resume_experience_date2(){
		return Posts.find({type:"resume_experience_date2", parent_id:this._id});
	},
	
});