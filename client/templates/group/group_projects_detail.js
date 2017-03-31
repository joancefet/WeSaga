import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// ROUTER
//=========
Router.route('/group/:group_slug/projects/details/:groupsProjectId',{
	data:function(){
		
	},
	waitOn: function(){
		
	},
	template:'screen',
	yieldTemplates: {
		'group_projects_details': {to: 'content'},
	}
	
});

Template.group_projects_details.rendered = function() {

};


// skyrooms Helper
Template.group_projects_details.helpers({
	
	group_slug(){
		return Router.current().params.group_slug; 
	}
  
});





// Events
Template.group_projects_details.events({
	

});
