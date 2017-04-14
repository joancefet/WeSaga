import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// ROUTER
//=========
Router.route('/desk/edit',{
	data:function(){
		
		if( !Meteor.user()){
			Router.go('/');
		}
		
	},
	waitOn: function(){
		
		Meteor.subscribe('posts', "notify", Meteor.userId() ); 
		
		Meteor.subscribe('posts', "resume_skill", Meteor.user().profile.username ); 
		Meteor.subscribe('posts', "resume_education", Meteor.user().profile.username ); 
			Meteor.subscribe('posts', "resume_education_date1", Meteor.user().profile.username );
			Meteor.subscribe('posts', "resume_education_date2", Meteor.user().profile.username );	
			Meteor.subscribe('posts', "resume_education_type", Meteor.user().profile.username );
		Meteor.subscribe('posts', "resume_experience", Meteor.user().profile.username ); 
			Meteor.subscribe('posts', "resume_experience_group", Meteor.user().profile.username );
			Meteor.subscribe('posts', "resume_experience_date1", Meteor.user().profile.username );
			Meteor.subscribe('posts', "resume_experience_date2", Meteor.user().profile.username );	
			Meteor.subscribe('posts', "resume_experience_type", Meteor.user().profile.username );
		return;
	},
	template:'screen',
	yieldTemplates: {
		'deskedit': {to: 'content'},
	}
	
});

// ------------------
// ACCOUNT
// ------------------
Template.deskedit.rendered = function() {
	
  //Place Marker on User Location.
  GoogleMaps.ready('editMap', function(map) {
    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
  });
  
	// https://maps.googleapis.com/maps/api/geocode/json?address=Toronto+Ontario+Canada&key=AIzaSyATUzfjVr1TtxqBIvDJa2AKnNYdgu_XXKE
    
	//Load Google Map
	GoogleMaps.load({key: 'AIzaSyATUzfjVr1TtxqBIvDJa2AKnNYdgu_XXKE'});

};



// Initialize file uploader
// ========================
Template.deskedit.onCreated(function () {
  
  
});

// Events
// ======
Template.deskedit.events({
	
	'change #fileInput': function (event, template) {
		
		// TODO: Remove current profile pic from Cloudinary
			
		$( ".imageUploadPreview" ).addClass( "loader" );
		$( ".imageUploadPreview img" ).addClass( "loader_background" );
		
		
		Cloudinary.upload(event.currentTarget.files, function(error, result){
			
			Meteor.users.update({_id:Meteor.userId()}, {
				$set:{"profile.avatar":"https://res.cloudinary.com/skyroomsio/image/upload/c_thumb,g_face,h_512,w_512/v1489424858/"+result.public_id+"."+result.format}
			});
			
			setTimeout(function(){
				$( ".imageUploadPreview" ).removeClass( "loader" );
				$( ".imageUploadPreview img" ).removeClass( "loader_background" );
			},2000);
			
		});
		
		toastr["success"]("Please wait for it to display", "New Profile Image Uploaded");	
		var audio = new Audio('/sounds/pop.mp3');
		audio.play();
		
	},
	
	'click .desk_save_all': function(event){
		
		// Update profile data
		Meteor.users.update(Meteor.userId(), {
			$set: {
				"profile.name_first": $(".update_name_first").val(),
				"profile.name_last": $(".update_name_last").val(),
				"profile.about": tinyMCE.get('user_about').getContent(),
			}
		});
		
		toastr["success"]("", "Business Card Updated");
		var audio = new Audio('/sounds/pop.mp3');
		audio.play();
		
	},
	
	
	
	// =============
	// RESUME EVENTS
	// =============
	
	// save_contact
	'click .save_contact': function(event){
		
		var address = $('.update_resume_location').val();
		address = encodeURIComponent(address)
		
		$.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key=AIzaSyATUzfjVr1TtxqBIvDJa2AKnNYdgu_XXKE').done(function(google){
			if(google.status != "ZERO_RESULTS"){
				// console.log(google.results[0].geometry.location.lat);
				// console.log(google.results[0].geometry.location.lng);
				
				Meteor.users.update(Meteor.userId(), {
				$set: {
					"profile.location_latitude": google.results[0].geometry.location.lat,
					"profile.location_longitude": google.results[0].geometry.location.lng,
					"profile.location_name": $('.update_resume_location').val(),
				}
			});
				
			}else{
				swal({
					title: "Address not found",
					text: "Please check your address input and try again",
					type: "error",
					showCancelButton: false,
					confirmButtonText: "Try Again",
				});
			}
		});
		
		
		Meteor.users.update(Meteor.userId(), {
			$set: {
				"profile.resume_phone": $('.update_resume_phone').val(),
				"profile.resume_email": $('.update_resume_email').val(),
				"profile.resume_privacy": $('.update_resume_privacy').val(),
			}
		});
		toastr["success"]("", "Contact Info Updated");
		var audio = new Audio('/sounds/pop.mp3');
		audio.play();
		
	},
	
	// Objective
	'click .save_objective': function(event){
		Meteor.users.update(Meteor.userId(), {
			$set: {
				"profile.resume_objective": tinyMCE.get('resume_objective').getContent(),
			}
		});
		toastr["success"]("", "Objective Updated");
		var audio = new Audio('/sounds/pop.mp3');
		audio.play();
		
	},
	
	// Skills
	'click .add_skill': function(event){
	
		Meteor.call('posts.update',
			"new",
			"me",
			"New Skill",
			"", 
			"resume_skill",
			Meteor.userId(),
			"publish",
		);
		
		toastr["info"]("Please enter your skill and click Save Skills", "Skill Added");	
		var audio = new Audio('/sounds/pop.mp3');
		audio.play();
	
	},
	'click .save_skill': function(event){
		
		// For Each Skill
		$(".resume_skill").each(function(skill) {
			console.log(this.id);
			
			Meteor.call('posts.update',
				this.id,
				"me",
				this.value,
				"",
				"resume_skill",
				Meteor.userId(),
				"publish",
			);
			
		});
		
		toastr["success"]("", "Skills Updated");	
		var audio = new Audio('/sounds/pop.mp3');
		audio.play();
		
	},
	'submit .skill_delete':function(event){
		
		event.preventDefault();
		const target = event.target;
		
		swal({
			title: "Delete this entry?",
			text: "",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "DELETE",
		}).then(function () {
			
			Meteor.call('posts.remove',
				target.skill_id.value
			);
			
			toastr["error"]("", "Deleted");
			var audio = new Audio('/sounds/pop.mp3');
			audio.play();
		});
		
		
	},
	
	// Education
	'click .add_education': function(event){
	
		Meteor.call('posts.update',
			"new",
			"me",
			"",
			"", 
			"resume_education",
			Meteor.userId(),
			"publish",
			function(error, parent_post_id){
				
				Meteor.call('posts.update',
					"new",
					"me",
					"",
					"", 
					"resume_education_date1",
					parent_post_id,
					"publish",
				);
				Meteor.call('posts.update',
					"new",
					"me",
					"",
					"", 
					"resume_education_date2",
					parent_post_id,
					"publish",
				);
				Meteor.call('posts.update',
					"new",
					"me",
					"",
					"", 
					"resume_education_type",
					parent_post_id,
					"publish",
				);
				
			}
		);
		
		toastr["info"]("Please fill it out and click Update", "Education Field Added");	
		var audio = new Audio('/sounds/pop.mp3');
		audio.play();
		
	},
	'submit .form_resume_education': function(event){
		
		event.preventDefault();
		const target = event.target;
		
		Meteor.call('posts.update',
			target.resume_id.value,
			"me",
			target.resume_education_title.value,
			target.resume_education_content.value,
			"resume_education",
			Meteor.userId(),
			"publish",
		);
		
		// META
		// resume_education_date1_id
		var POST_ID = "unset";
		if(target.resume_education_date1.value){
			POST_ID = target.resume_education_date1_id.value;
		} else {
			POST_ID = "new";
		}
		Meteor.call('posts.update',
			POST_ID,
			"me",
			target.resume_education_date1.value,
			"", 
			"resume_education_date1",
			target.resume_id.value,
			"publish",
			"method_2",
		);
		
		// resume_education_date2
		var POST_ID = "unset";
		if(target.resume_education_date2.value){
			POST_ID = target.resume_education_date2_id.value;
		} else {
			POST_ID = "new";
		}
		Meteor.call('posts.update',
			POST_ID,
			"me",
			target.resume_education_date2.value,
			"", 
			"resume_education_date2",
			target.resume_id.value,
			"publish",
			"method_2",
		);
		
		// resume_education_type
		var POST_ID = "unset";
		if(target.resume_education_type.value){
			POST_ID = target.resume_education_type_id.value;
		} else {
			POST_ID = "new";
		}
		Meteor.call('posts.update',
			POST_ID,
			"me",
			target.resume_education_type.value,
			"", 
			"resume_education_type",
			target.resume_id.value,
			"publish",
			"method_2",
		);
		
		toastr["success"]("", "Education Updated");	
		var audio = new Audio('/sounds/pop.mp3');
		audio.play();
		
	},
	
	// Experience
	'click .add_experience': function(event){
	
		Meteor.call('posts.update',
			"new",
			"me",
			"",
			"", 
			"resume_experience",
			Meteor.userId(),
			"publish",
			function(error, parent_post_id){
				
				Meteor.call('posts.update',
					"new",
					"me",
					"",
					"", 
					"resume_experience_group",
					parent_post_id,
					"publish",
				);
				Meteor.call('posts.update',
					"new",
					"me",
					"",
					"", 
					"resume_experience_date1",
					parent_post_id,
					"publish",
				);
				Meteor.call('posts.update',
					"new",
					"me",
					"",
					"", 
					"resume_experience_date2",
					parent_post_id,
					"publish",
				);
				
			}
		);
		
		toastr["info"]("Please fill it out and click Update", "Experience Field Added");	
		var audio = new Audio('/sounds/pop.mp3');
		audio.play();
	
	},
	'submit .form_resume_experience': function(event){
		
		event.preventDefault();
		const target = event.target;
		
		Meteor.call('posts.update',
			target.resume_id.value,
			"me",
			target.resume_experience_title.value,
			target.resume_experience_content.value,
			"resume_experience",
			Meteor.userId(),
			"publish",
		);
		
		// META
		// resume_experience_group
		var POST_ID = "unset";
		if(target.resume_experience_group.value){
			POST_ID = target.resume_experience_group_id.value;
		} else {
			POST_ID = "new";
		}
		Meteor.call('posts.update',
			POST_ID,
			"me",
			target.resume_experience_group.value,
			"", 
			"resume_experience_group",
			target.resume_id.value,
			"publish",
			"method_2",
		);
		
		// resume_experience_date1
		var POST_ID = "unset";
		if(target.resume_experience_date1.value){
			POST_ID = target.resume_experience_date1_id.value;
		} else {
			POST_ID = "new";
		}
		Meteor.call('posts.update',
			POST_ID,
			"me",
			target.resume_experience_date1.value,
			"", 
			"resume_experience_date1",
			target.resume_id.value,
			"publish",
			"method_2",
		);
		// resume_experience_date2
		var POST_ID = "unset";
		if(target.resume_experience_date2.value){
			POST_ID = target.resume_experience_date2_id.value;
		} else {
			POST_ID = "new";
		}
		Meteor.call('posts.update',
			POST_ID,
			"me",
			target.resume_experience_date2.value,
			"", 
			"resume_experience_date2",
			target.resume_id.value,
			"publish",
			"method_2",
		);
		
		toastr["success"]("", "Experience Updated");	
		var audio = new Audio('/sounds/pop.mp3');
		audio.play();
		
	},
	
	
});




//Desk Edit Helpers
// ==============
Template.deskedit.helpers({
	
	// Google Map helper.
	mapOptions: function() {
		console.log("mapOptions called.");
		if (GoogleMaps.loaded()) {
		  return {
			center: new google.maps.LatLng(Meteor.user().profile.location_latitude, Meteor.user().profile.location_longitude),
			zoom: 8,
			disableDefaultUI: true, 
			draggable: true,
			scrollwheel: true,
			disableDoubleClickZoom: true,
		  };
		  
		}
	},
	
	resume_skills(){
		return Posts.find({type:"resume_skill"});
	},
	
	resume_education(){
		return Posts.find({type:"resume_education"});
	},
	resume_education_date1(){
		return Posts.find({type:"resume_education_date1", parent_id:this._id});
	},
	resume_education_date2(){
		return Posts.find({type:"resume_education_date2", parent_id:this._id});
	},
	resume_education_type(){
		return Posts.find({type:"resume_education_type", parent_id:this._id});
	},
	
	resume_experience(){
		return Posts.find({type:"resume_experience"});
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