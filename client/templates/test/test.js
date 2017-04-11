import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// ROUTER
//=========
Router.route('/test',{
	data:function(){
		
	},
	waitOn: function(){
	},
	template:'screen',
	yieldTemplates: {
		'test': {to: 'content'},
	}
	
});


// Initialize map
// ==============
Template.test.onCreated(function () {

});


// Render
// ==============
Template.test.rendered = function() {
	
};


// Events
Template.test.events({


	'click #notification_button'(event){
		
		var options = {
			headers: {
				'Authorization': 'Basic ZTg0Y2NjMDktMzI0YS00MDhjLWFkMmUtMWQzY2NkZmE3MTZj',
				'Content-Type': 'application/json; charset=utf-8'
			},
			data: {
				'app_id': "ba62f6a5-2cce-41c7-8139-b4026c6b1daf",
				'contents': {en: "HELLO"}, // My message
				'headings': {en: "TITLE TEST"}, // notification title
				'include_player_ids': ["ad2af049-c9c3-4e74-8170-90bd5dee0c41","ee6af873-c38e-4238-b6e0-2c038bcf1386"], // Array of oneSignal user Ids (from my Meteor.users table)
				'url': "https://www.skyrooms.io/buzz", // where to go if user clicks on notification
				'ios_sound': "ring.mp3",
				'android_sound': "ring.mp3",
				'wp_sound': "ring.mp3",
				'wp_wns_sound': "ring.mp3",
			}
		};
		
		HTTP.call('POST', "https://onesignal.com/api/v1/notifications", options, function(error, result) {
			console.log(error);
			// Process the return for any ids that were not recognised to remove them from our database
			if (result && result.data && result.data.errors && result.data.errors.invalid_player_ids) {
				console.log("SUCCESS");
				// result.data.errors.invalid_player_ids.forEach(playerId => {
					// Meteor.users.update({oneSignalUserIds: playerId}, {$pull: {oneSignalUserIds: playerId}});
				// });
			}
		});


		// TOAST NOTIFY
		// toastr["success"]("Notification sent to team members", "Task Updated");		
		var audio = new Audio('/sounds/pop.mp3');
		audio.play();
		
	},
	'click #sound_test'(event){
		
		var audio = document.getElementById('sound_file');
		audio.play();
		audio.src = '/sounds/pop.mp3';
		audio.play();
		
		
		// setInterval(function(){
			// toastr["success"]("A new notification on your app is ready. I wonder how long this text can end up being.", "Notification");		
			// var audio = new Audio('/sounds/pop.mp3');
			// audio.play();
		// }, 5000);
		
	},
	
	'click #ringtest'(event){
		
		toastr["success"]("Connecting...", "Calling Bob");	
		
		ringAudio = new Audio('/sounds/ring.mp3'); 
		ringAudio.pause();
		ringAudio.currentTime = 0;
		
		ringAudio.addEventListener('ended', function() {
			this.currentTime = 0;
			this.play();
		}, false);
		ringAudio.play();


		
		// setInterval(function(){
				
			// var audio = new Audio('/sounds/ring.mp3');
			// audio.play();
		// }, 5000);
		
	},
	
	

});


//Helpers
//=======
Template.test.helpers({
	

});
