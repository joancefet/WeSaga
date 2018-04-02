// Route
import { Posts } 					from '../../../imports/posts.js';

// Route
Router.route('/notify',{

	data:function(){
		
		if( !Meteor.user() ){
			Router.go('/');
		}
	},
	waitOn: function(){
		// Meteor.subscribe('posts', "notify" );  // We're already subb'd from account navigation
	},
	template:'screen',
	yieldTemplates: {
		'notify': {to: 'content'},
	}
	
});

// Render
Template.notify.rendered = function() {
	
	Meteor.subscribe('posts', "notify", Meteor.userId() ); 
	Meteor.subscribe('posts', "colleagues", Meteor.userId() ); 

	// Mark all notification as read
	Meteor.call('posts.updateNotificationsRead', Meteor.userId());

};


// Events
Template.notify.events({
	
});

// Events
Template.notify.helpers({
	
	notify() {
		return Posts.find({type:"notify"}, {sort: { createdAt: -1 } });
	},
	slug(string){
		return ToSeoUrl(string);
	}
	
});
