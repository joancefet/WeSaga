import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// ROUTER
//=========
Router.route('/desk',{
	data:function(){
		
		if( !Meteor.user() ){
			Router.go('/');
		}
		
	},
	waitOn: function(){
		Meteor.subscribe('posts', "desk_posts", Meteor.userId() ); 
		//Meteor.subscribe('postsmeta', "desk_comments"); // Need meta data in helpers
		return;
	},
	template:'screen',
	yieldTemplates: {
		'desk': {to: 'content'},
	}
	
});


// Initialize map
// ==============
Template.desk.onCreated(function () {
  //Place Marker on User Location.
  GoogleMaps.ready('profileMap', function(map) {
    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
  });
});


// Render
// ==============
Template.desk.rendered = function() {
	
	//Load Google Map
	GoogleMaps.load({key: 'AIzaSyATUzfjVr1TtxqBIvDJa2AKnNYdgu_XXKE'});
	
};


// Events
Template.desk.events({
	
	// Submit New Post
	'click .desk_submit_new_post'(event) {
		event.preventDefault();
		
		if( $(".newPostContent").val().length < 1 ){
			return;
		}
		
		Meteor.call('posts.update',
			"new",
			"me",
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
						
						Meteor.call('postsmeta.update',
							"new",
							"me",
							"",
							"https://res.cloudinary.com/skyroomsio/image/upload/a_0/"+result.public_id+"."+result.format, 
							"post_attachment",
							parent_post_id,
							"publish",
						);
						console.log("ADDED post_attachment to:" +parent_post_id);
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
	
	'submit #userSettings'(event){
		event.preventDefault();
		
		Meteor.users.update(Meteor.userId(), {
		  $set: {
			"profile.firstName": $('[name=firstName]').val(),
			"profile.lastName": $('[name=lastName]').val(),
			"profile.birthday": $('[name=birthday]').val(),
		  }
		});
		
		$('#deskSettings').modal('hide');
	},

});


//Helpers
//=======
Template.desk.helpers({
	
	// Google Map helper.
	mapOptions: function() {
		console.log("mapOptions called.");
		if (GoogleMaps.loaded()) {
		  return {
			center: new google.maps.LatLng(Meteor.user().profile.locLat, Meteor.user().profile.locLng),
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
	  
  
	desk_posts() {
		return Posts.find({type:"desk_posts"}, {sort: { createdAt: -1 } });
	},
	
	post_attachment(){
		Meteor.subscribe('postsmeta', "post_attachment", this._id);
		return Postsmeta.find({type: "post_attachment", parent_id:this._id});
	},
	
	desk_comments(){
		// SUBSCRIBE TO POSTMETA: parent_id
		Meteor.subscribe('postsmeta', "desk_comments", this._id); 
		return Postsmeta.find({parent_id:this._id});
	},
	HasOwnerAvatar(){
		if(this.owner_avatar != "/uploadFiles/undefined"){
			return true;
		}
	},
	
	slug(string){
		return ToSeoUrl(string);
	}

});
