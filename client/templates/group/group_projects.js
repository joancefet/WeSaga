import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// ROUTER
//=========
Router.route('/group/:group_slug/projects',{
	data:function(){
		
	},
	waitOn: function(){
		Meteor.subscribe('posts', 'group_by_slug',  ToSeoUrl(Router.current().params.group_slug) );
		var group = Posts.findOne({type:"groups"});
	
		Meteor.subscribe('posts', 'groups_project_category_by_parent_id',  group._id );
		var group_project_categories = Posts.find({type:"groups_project_category"});
		group_project_categories.forEach(function(project_category){
			console.log("JOIN ON: "+project_category._id);
			Meteor.subscribe('posts', 'groups_project_by_parent_id', project_category._id);
		});
		
		Meteor.subscribe('posts', 'groups_project_by_parent_id',  ToSeoUrl(Router.current().params.group_slug) );
	},
	template:'screen',
	yieldTemplates: {
		'group_projects': {to: 'content'},
	}
	
});

Template.group_projects.rendered = function() {

};


// Events
Template.group_projects.events({
	
	'submit'(event) {
		
		event.preventDefault();
		const target = event.target;

		// ---------------
		// Add Colleague
		// ---------------
		if(target.action.value == "add_project"){
			
			// Add Notification and Meta data		
			Meteor.call('posts.update',
				"new",
				target.groups_project_category_id.value,
				"New Project",
				"Click here to enter the project and configure the details.",
				"groups_project",
				this._id,
				"publish",
				function(error, return_post_id){
					
				}
			);
			
		}
		
	},
	
});



// skyrooms Helper
Template.group_projects.helpers({
	
	group_slug(){
		return Router.current().params.group_slug; 
	},
	groups_project_category(){
		
		var groups_categories = Posts.find({type:"groups_project_category"});
		groups_categories.forEach(function(project){
			// Meteor.subscribe('posts', 'group_member_user_profile', member.owner_id );
			// Meteor.subscribe('posts', 'group_member_role', member.owner_id);
		});
		
		return groups_categories;
	},
	groups_project(){
		return Posts.find({type:"groups_project"});
	}
  
});




