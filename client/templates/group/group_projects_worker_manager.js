import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// ROUTER
//=========

Router.route('/group/:group_slug/projects/worker_manager',{
	data:function(){
		
		if( !Meteor.user()){
			Router.go('/');
		}
	},
	waitOn: function(){
		Meteor.subscribe('posts', "notify", Meteor.userId() ); 
	},
	template:'screen',
	yieldTemplates: {
		'group_projects_worker_manager': {to: 'content'},
	}
	
});

Router.route('/group/:group_slug/projects/worker_manager/:groupsProjectId',{
	data:function(){
		
		if( !Meteor.user()){
			Router.go('/');
		}
	},
	waitOn: function(){
		
		// group_by_slug
		Meteor.subscribe('posts', 'group_by_slug',  ToSeoUrl(Router.current().params.group_slug) );
		var group = Posts.findOne({type:"groups"});
		
		// groups_project_by_id
		Meteor.subscribe('posts', 'groups_project_by_id', Router.current().params.groupsProjectId );
		
		// project_worker_by_parent_id
		Meteor.subscribe('posts', 'project_worker_by_parent_id', Router.current().params.groupsProjectId );
		
		
		// FIND PEOPLE
		
		// Fetch Group Members post
		Meteor.subscribe('posts', 'group_member_all_by_group_id', group._id );
		
		var members = Posts.find({type:"group_member", status:"accepted"});
		members.forEach(function(member){
			Meteor.subscribe('posts', 'group_member_user_profile', member.owner_id );
			Meteor.subscribe('posts', 'group_member_role', member.owner_id);
		});
		
	},
	template:'screen',
	yieldTemplates: {
		'group_projects_worker_manager': {to: 'content'},
	}
	
});

Template.group_projects_worker_manager.rendered = function() {
	
};


// Events
Template.group_projects_worker_manager.events({
	
	// CREATE / UPDATE
	'submit'(event) {
		
		event.preventDefault();
		const target = event.target;
		
		// ---------------
		// Assign Worker
		// ---------------
		if(target.action.value == "assign_worker"){
			
			swal({
				title: "Person added as Worker",
				text: "We've sent them a notification.",
				type: "success",
				showCancelButton: false,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Close",
				
			});
			
			// Group Request as a POST to ME
			Meteor.call('posts.update',
				"new",
				target.user_id.value,
				"Worker",
				"",
				"project_worker",
				target.the_group_project_id.value,
				"publish"
			);
			
		}
		
		// ---------------
		// Remove Worker
		// ---------------
		if(target.action.value == "remove_worker"){
			
			swal({
				title: "Person removed from project",
				text: "We've sent them a notification.",
				type: "error",
				showCancelButton: false,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Close",
				
			});
			Meteor.call('posts.remove',
				target.project_worker_id.value,
			);
			
		}
		
	},
	
	
});


// skyrooms Helper
Template.group_projects_worker_manager.helpers({
	
	slug(title){
		return ToSeoUrl(title); 
	},
	group_slug(){
		return Router.current().params.group_slug; 
	},
	
	groups_project() {
		
		var groupIds = Posts.find({	type:"groups_project" }).map(function(group){	
			return group.parent_id; 
		});
		
		return Posts.find({type:"groups_project", status:{$ne:"trash"}});
	},
	
	the_group_id(){
		var group = Posts.findOne({type:"groups"}); 
		if(group){
			return group._id;
		} else {
			return false;
		}
	},
	
	the_group_project_id(){
		var group = Posts.findOne({type:"groups_project"}); 
		if(group){
			return group._id;
		} else {
			return false;
		}
	},
	
	the_group_project_title(){
		var group = Posts.findOne({type:"groups_project"}); 
		if(group){
			return group.title;
		} else {
			return false;
		}
	},
	
	the_group_project_content(){
		var group = Posts.findOne({type:"groups_project"}); 
		if(group){
			return group.content;
		} else {
			return false;
		}
	},
	
	
	people() {

		// Fetch the group
		var group = Posts.findOne({type:"groups"});
		
		// Subscribe to those users
		var members = Posts.find({type:"group_member", status:"accepted"});
		members.forEach(function(member){
			Meteor.subscribe('posts', 'group_member_user_profile', member.owner_id );
			Meteor.subscribe('posts', 'group_member_role', member.owner_id);
		});
		
		return Meteor.users.find({}); // All users except ME
		
	},
	
	project_worker(){
		
		var worker = Posts.findOne({type:"project_worker", owner_id:this._id});
		if(worker){
			return worker._id;
		}else{
			return false;
		}
		
	}
	
  
});

