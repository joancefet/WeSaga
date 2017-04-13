import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// ------------------
// SKYROOM JOIN
// ------------------
Router.route('/meet', {
	template:'screen',
	yieldTemplates: {
		'meet': {to: 'content'},
	}
});

// View By User Home Slug ONLY
Router.route('/meet/:user_slug', {
	data:function(){
	},
	waitOn: function(){
		
		Meteor.subscribe('posts', "notify", Meteor.userId() ); 
		
	},
	template:'screen',
	yieldTemplates: {
		'meet': {to: 'content'},
	}
	
},);


	
// View By User Home Slug + Room Slug
Router.route('/meet/:user_slug/:requested_room_slug', {
	data:function(){
	},
	waitOn: function(){
		
		Meteor.subscribe('posts', "notify", Meteor.userId() ); 
		
		// Set Password from URL: /join/room-name?password=______
		// if(this.params.query.password){
			// Session.set("skyroom_current_password", this.params.query.password);
		// }
		
		Meteor.subscribe('posts', 'meetings_by_url', Router.current().params.requested_room_slug ); 
		Meteor.subscribe('postsmeta', 'meeting_meta_by_url', Router.current().params.requested_room_slug ); 
		
		
	},
	template:'screen',
	yieldTemplates: {
		'meet': {to: 'content'},
	}
	
},);


Template.meet.onCreated(function () {
	
	this.autorun(function () {
		if (Router.current().params.myParam) {
		// Do my stuff
		//Meteor.subscribe('skyroomParticipants');
		}
	});
	
});

// SKYROOM Render
Template.meet.rendered = function() {
	
	// window.SkyroomSharingFrameFullScreen = 0; // what's this? :/
	
	// Make sure to Show the loader
	// $('.skyroom_connecting_loader').css('display', 'block');
	
	// var slug = "";
	// if(typeof  Router.current().params.requested_room_slug === 'undefined' || !Router.current().params.requested_room_slug){
		// slug = ToSeoUrl( Router.current().params.user_slug);
	// } else {
		// slug = ToSeoUrl( Router.current().params.user_slug) + "/"+ ToSeoUrl(Router.current().params.requested_room_slug ) ;
	// }
	
	// // Add a participant
	// setTimeout( function(){
		
		// ga("send", "event", "skyroom", "joined", slug );
		// Meteor.call('skyroomParticipants.join', ToSeoUrl( Router.current().params.user_slug) );
		// //skyroom_connect( slug );
		// //Helpers.skyroom_connect( connection, ToSeoUrl( Router.current().params.user_slug) , "join" );
		
	// }, 4000);
};

// SKYROOM Leave
Template.meet.onDestroyed(function () {
	
	// console.log("========================== PARTICIPANT TRYING TO LEAVE");
	// Meteor.call('skyroomParticipants.leave');
	// skyroom_leave();
	
	// See helpers.js
	//Helpers.skyroom_connect(connection, Router.current().params.requested_room_slug, "leave" );
	
	
	api.executeCommand('hangup');
	
});

// SKYROOM Events
Template.meet.events({	

	// INSERT CHAT MESSAGE
	'submit .form_skyroomMessages'(event) {
		
		// Prevent default browser form submit
		event.preventDefault();
		
		// Get value from form element
		const target = event.target;
		const content = target.content.value;
		//alert(ToSeoUrl( Router.current().params.user_slug));
		Meteor.call('skyroomMessages.insert', content, Meteor.user().username, ToSeoUrl( Router.current().params.user_slug) );
		target.content.value = '';	
		
	},	
	
	'click #files-container .closebox'(events){
		$("#files-container").slideUp();
	},
	
	'click .fullscreen'(events){
		
		// We have to click to make this work :/
		
		if(window.SkyroomSharingFrameFullScreen == 0){
			var height = $(window).height();
			$('iframe').css('height', height * 0.9 | 0);
			window.SkyroomSharingFrameFullScreen = 1;
			return;
		};
		
		if(window.SkyroomSharingFrameFullScreen == 1){
			var height = $(window).height();
			$('iframe').css('height', height * 0.2 | 0);
			window.SkyroomSharingFrameFullScreen = 0;
			return;
		};
	},
	
	// 'click #showMoreSkyroomsModal'(events){
		// Meteor.subscribe('skyrooms_relatedRooms', '79D9mNYNxPjWxsMEd', ''); // skip searching by user_id
	// },

});



Template.meet.helpers({	

	meeting(){
		return Posts.findOne({slug:Router.current().params.requested_room_slug});
	}

});