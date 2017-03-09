// Route
import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';



// ------------------
// CHATS
// ------------------
Router.route('/chats',{
	data:function(){
		
		// if( Meteor.user() && Meteor.user().profile.guest ){
			// Router.go('/');
		// } else {
			// Router.go('/chats');
		// }
	},
	waitOn: function(){
		Meteor.subscribe('posts', "chat_message"); 
		return;
	},
	template:'screen',
	yieldTemplates: {
		'chats': {to: 'content'},
	}
	
});


// Render
Template.chats.rendered = function() {
	$(".chat-discussion").animate({ scrollTop: $('.chat-discussion').prop("scrollHeight")}, 1000);

	// Set last message seen on client
	window.chatMessage_first = true;
	window.chatMessage_last_messageId = $(".chat-message:last").attr("id");
	
	// LOOP
	setTimeout( function(){ 
		
		setInterval( function(){ 
		
			if(window.chatMessage_first == false){ // skip first run
			
				// New message?
				if(window.chatMessage_last_messageId !== null && window.chatMessage_last_messageId != $(".chat-message:last").attr("id") ){
					
					// Do I own this? (no sound)
					var message_owner = $("#"+window.chatMessage_last_messageId+" #owner_id").html();
					
					if(message_owner != Meteor.userId() ){ 
						window.chatMessage_last_messageId = $(".chat-message:last").attr("id");

						ringAudio = new Audio('/sounds/chat_message.mp3'); 
						ringAudio.pause();
						ringAudio.currentTime = 0;
						ringAudio.play();
						
						$(".chat-discussion").animate({ scrollTop: $('.chat-discussion').prop("scrollHeight")}, 1000);
						console.log("PLAY AUDIO");
					}
					
				}
				
			}
			window.chatMessage_first = false; // first run complete, play sounds from now on
		}, 100);
	
	}, 4000);
	
	
};


// Events
Template.chats.events({
	
	'submit'(event) {
		event.preventDefault();

		console.log("submitting message");
		
		Meteor.call('postsmeta.insert',
			"MS92FYi4f3iCngDPj",
			Meteor.user().username,
			$(".form-control").val(),
			"chat_message",
		);
		
		$(".form-control").val("");
		$(".chat-discussion").animate({ scrollTop: $('.chat-discussion').prop("scrollHeight")}, 1000);
		
	},
});

//  Helper
Template.chats.helpers({
	
	groups() {
		return Posts.find({ "type":"group" });
	},
	chatMessages() {
		return Postsmeta.find({ "parent_id":"MS92FYi4f3iCngDPj"});
	}
  
});
