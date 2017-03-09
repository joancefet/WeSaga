// Route
import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// Route
Router.route('/buzz',{

	data:function(){
		
		if( !Meteor.user() ){
			Router.go('/');
		}
	},
	waitOn: function(){
		//Meteor.subscribe('posts', 'people_all'); 
	},
	template:'screen',
	yieldTemplates: {
		'buzz': {to: 'content'},
	}
	
});

// Render
Template.buzz.rendered = function() {

};


// Events
Template.buzz.events({
	
});

// Events
Template.buzz.helpers({
	
	// people() {
		// return Meteor.users.find({});
	// },
	
});
