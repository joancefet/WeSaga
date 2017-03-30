import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// ROUTER
//=========
Router.route('/group/:group_slug/projects',{
	data:function(){
		
	},
	waitOn: function(){
		
	},
	template:'screen',
	yieldTemplates: {
		'group_projects': {to: 'content'},
	}
	
});

Template.group_projects.rendered = function() {

};


// skyrooms Helper
Template.group_projects.helpers({
	
	group_slug(){
		return Router.current().params.group_slug; 
	}
  
});





// Events
Template.group_projects.events({
	

});
