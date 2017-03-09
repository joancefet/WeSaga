// Route
import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// ROUTE
Router.route('/notes',{
	fastRender: true,
	data:function(){
		
		// if( Meteor.user() && Meteor.user().profile.guest ){
			// Router.go('/');
		// } else {
			// Router.go('/chats');
		// }
	},
	waitOn: function(){		
			
	},
	template:'screen',
	yieldTemplates: {
		'notes': {to: 'content'},
	}
	
});

Template.notes.onRendered(function() {

	clearInterval(window.autoSave);

	window.autoSave = setInterval(function(){ 
		// GET TINY MCE CONTENT
		content = tinyMCE.get('notepad').getContent();
		
		// Update User Profile
		Meteor.users.update(Meteor.userId(), {
			$set: {
				"profile.notes": content,
			}
		}); 
		console.log("Notes Auto Save");
	},5000);
	
});

// Events
Template.notes.events({

});

Template.notes.onDestroyed(function() {
	
	// GET TINY MCE CONTENT
	content = tinyMCE.get('notepad').getContent();
	
	// Update User Profile
	Meteor.users.update(Meteor.userId(), {
		$set: {
			"profile.notes": content,
		}
	}); 
	
});

//  Helper
Template.notes.helpers({
	
});
