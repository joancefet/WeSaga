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
	desk_comments(){
		// SUBSCRIBE TO POSTMETA: parent_id
		Meteor.subscribe('postsmeta', "desk_comments", this._id); 
		return Postsmeta.find({parent_id:this._id});
	},
	HasOwnerAvatar(){
		if(this.owner_avatar != "/profileImages/undefined"){
			return true;
		}
	}

});

// Events
Template.desk.events({
	
	// Submit New Post
	'submit .new-post'(event) {
		event.preventDefault();
		
		Meteor.call('posts.update',
			"new",
			"me",
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

