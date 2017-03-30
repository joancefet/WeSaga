import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// ROUTER
//=========
Router.route('/group/:group_slug/people',{
	data:function(){
		
	},
	waitOn: function(){
		
	},
	template:'screen',
	yieldTemplates: {
		'group_people': {to: 'content'},
	}
	
});

Template.group_people.rendered = function() {

};


// skyrooms Helper
Template.group_people.helpers({
	
	group_slug(){
		return Router.current().params.group_slug; 
	}
  
});





// Events
Template.group_people.events({
	

});
