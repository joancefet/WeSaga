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
		
		Meteor.subscribe('posts', "resume_skill", Meteor.user().profile.username ); 
		Meteor.subscribe('posts', "resume_education", Meteor.user().profile.username ); 
			Meteor.subscribe('postsmeta', "resume_education_date1", Meteor.user().profile.username );
			Meteor.subscribe('postsmeta', "resume_education_date2", Meteor.user().profile.username );	
			Meteor.subscribe('postsmeta', "resume_education_type", Meteor.user().profile.username );
		Meteor.subscribe('posts', "resume_experience", Meteor.user().profile.username ); 
			Meteor.subscribe('postsmeta', "resume_experience_group", Meteor.user().profile.username );
			Meteor.subscribe('postsmeta', "resume_experience_date1", Meteor.user().profile.username );
			Meteor.subscribe('postsmeta', "resume_experience_date2", Meteor.user().profile.username );	
			Meteor.subscribe('postsmeta', "resume_experience_type", Meteor.user().profile.username );
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
	
	//Load Google Map
	GoogleMaps.load({key: 'AIzaSyATUzfjVr1TtxqBIvDJa2AKnNYdgu_XXKE'});
	
	
};



// Initialize file uploader
// ========================
Template.deskedit.onCreated(function () {
  
  //Place Marker on User Location.
  GoogleMaps.ready('editMap', function(map) {
    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
  });
  
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
		
		console.log("COMPLETE");
		
	},
	
	'click .desk_save_all': function(event){
		
		// Update working location
		// TODO: Change this to Google Maps API so user can enter data. This is quick and dirty.
		$.getJSON('https://freegeoip.net/json/').done(function(location){
			//$('#country').html(location.country_name);
			//$('#country_code').html(location.country_code);
			//$('#region').html(location.region_name);
			//$('#region_code').html(location.region_code);
			//$('#city').html(location.city);
			//alert(location.city);
			//$('#latitude').html(location.latitude);
			//$('#longitude').html(location.longitude);
			//$('#timezone').html(location.time_zone);
			//$('#ip').html(location.ip);
			Meteor.users.update(Meteor.userId(), {
				$set: {
					"profile.location_latitude": location.latitude,
					"profile.location_longitude": location.longitude,
					"profile.location_name": location.city + ", " + location.region_name + ", " + location.country_name,
				}
			});
		});
		
		// Update profile data
		Meteor.users.update(Meteor.userId(), {
			$set: {
				"profile.name_first": $(".update_name_first").val(),
				"profile.name_last": $(".update_name_last").val(),
				"profile.about": tinyMCE.get('user_about').getContent(),
			}
		});
		
		swal({
			title: "Profile Updated",
			text: "",
			type: "success",
			showCancelButton: false,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Close",
			closeOnConfirm: true
		});
		
	},
	
	
	
	// =============
	// RESUME EVENTS
	// =============
	
	// save_contact
	'click .save_contact': function(event){
		Meteor.users.update(Meteor.userId(), {
			$set: {
				"profile.resume_phone": $('.update_resume_phone').val(),
				"profile.resume_email": $('.update_resume_email').val(),
				"profile.resume_privacy": $('.update_resume_privacy').val(),
			}
		});
		
		swal({
			title: "Updated",
			text: "Your profile has been updated.",
			type: "success",
			showCancelButton: false,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Close",
			closeOnConfirm: true
		});
		
	},
	
	// Objective
	'click .save_objective': function(event){
		Meteor.users.update(Meteor.userId(), {
			$set: {
				"profile.resume_objective": tinyMCE.get('resume_objective').getContent(),
			}
		});
		
		swal({
			title: "Objective Updated",
			text: "Your resume has been updated.",
			type: "success",
			showCancelButton: false,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Close",
			closeOnConfirm: true
		});
		
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
		
		swal({
			title: "Skills Updated",
			text: "Your resume has been updated.",
			type: "success",
			showCancelButton: false,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Close",
			closeOnConfirm: true
		});
		
	},
	'submit .skill_delete':function(event){
		
		event.preventDefault();
		const target = event.target;
		
		Meteor.call('posts.remove',
			target.skill_id.value
		);
		
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
				
				Meteor.call('postsmeta.update',
					"new",
					"me",
					"",
					"", 
					"resume_education_date1",
					parent_post_id,
					"publish",
				);
				Meteor.call('postsmeta.update',
					"new",
					"me",
					"",
					"", 
					"resume_education_date2",
					parent_post_id,
					"publish",
				);
				Meteor.call('postsmeta.update',
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
		
	},
	'submit .form_resume_education': function(event){
		
		event.preventDefault();
		const target = event.target;
			
		console.log(target.resume_id.value);
		console.log(target.resume_education_title.value);
		console.log(target.resume_education_content.value);
		console.log(target.resume_education_date1.value);
		console.log(target.resume_education_date2.value);
		console.log(target.resume_education_type.value);
		
			
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
		Meteor.call('postsmeta.update',
			target.resume_id.value,
			"me",
			target.resume_education_date1.value,
			"", 
			"resume_education_date1",
			target.resume_id.value,
			"publish",
			"method_2",
		);
		Meteor.call('postsmeta.update',
			target.resume_id.value, 
			"me",
			target.resume_education_date2.value,
			"", 
			"resume_education_date2",
			target.resume_id.value,
			"publish",
			"method_2",
		);
		Meteor.call('postsmeta.update',
			target.resume_id.value,
			"me",
			target.resume_education_type.value,
			"", 
			"resume_education_type",
			target.resume_id.value,
			"publish",
			"method_2",
		);
			
		swal({
			title: "Education Updated",
			text: "Your resume has been updated.",
			type: "success",
			showCancelButton: false,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Close",
			closeOnConfirm: true
		});
		
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
				
				Meteor.call('postsmeta.update',
					"new",
					"me",
					"",
					"", 
					"resume_experience_group",
					parent_post_id,
					"publish",
				);
				Meteor.call('postsmeta.update',
					"new",
					"me",
					"",
					"", 
					"resume_experience_date1",
					parent_post_id,
					"publish",
				);
				Meteor.call('postsmeta.update',
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
	
	},
	'submit .form_resume_experience': function(event){
		
		event.preventDefault();
		const target = event.target;
			
		console.log(target.resume_id.value);
		console.log(target.resume_experience_title.value);
		console.log(target.resume_experience_content.value);
		console.log(target.resume_experience_date1.value);
		console.log(target.resume_experience_date2.value);
		
		
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
		Meteor.call('postsmeta.update',
			target.resume_id.value,
			"me",
			target.resume_experience_group.value,
			"", 
			"resume_experience_group",
			target.resume_id.value,
			"publish",
			"method_2",
		);
		Meteor.call('postsmeta.update',
			target.resume_id.value,
			"me",
			target.resume_experience_date1.value,
			"", 
			"resume_experience_date1",
			target.resume_id.value,
			"publish",
			"method_2",
		);
		Meteor.call('postsmeta.update',
			target.resume_id.value, 
			"me",
			target.resume_experience_date2.value,
			"", 
			"resume_experience_date2",
			target.resume_id.value,
			"publish",
			"method_2",
		);
		
			
		swal({
			title: "experience Updated",
			text: "Your resume has been updated.",
			type: "success",
			showCancelButton: false,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Close",
			closeOnConfirm: true
		});
		
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
		return Postsmeta.find({type:"resume_education_date1", parent_id:this._id});
	},
	resume_education_date2(){
		return Postsmeta.find({type:"resume_education_date2", parent_id:this._id});
	},
	resume_education_type(){
		return Postsmeta.find({type:"resume_education_type", parent_id:this._id});
	},
	
	resume_experience(){
		return Posts.find({type:"resume_experience"});
	},
	resume_experience_group(){
		return Postsmeta.find({type:"resume_experience_group", parent_id:this._id});
	},
	resume_experience_date1(){
		return Postsmeta.find({type:"resume_experience_date1", parent_id:this._id});
	},
	resume_experience_date2(){
		return Postsmeta.find({type:"resume_experience_date2", parent_id:this._id});
	},
	
	  
});