import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// ROUTER
//=========
Router.route('/group/:group_slug/projects/details/:groupsProjectId',{
	data:function(){
		
	},
	waitOn: function(){
		
		Meteor.subscribe('posts', "notify", Meteor.userId() ); 
		
		// MAIN SETTINGS
		// ==========
		// group_by_slug
		Meteor.subscribe('posts', 'group_by_slug',  ToSeoUrl(Router.current().params.group_slug) );
		var group = Posts.findOne({type:"groups"});
	
		// groups_project_category_by_parent_id
		Meteor.subscribe('posts', 'groups_project_category_by_parent_id',  group._id );
		
		// groups_project_by_id
		Meteor.subscribe('posts', 'groups_project_by_id', Router.current().params.groupsProjectId );
		var groups_project = Posts.findOne({type:"groups_project"});
		
		// FIND PEOPLE + PROJECT WORKER
		// ==========
		
		// project_worker_by_parent_id
		Meteor.subscribe('posts', 'project_worker_by_parent_id', Router.current().params.groupsProjectId );
			
		// Fetch Group Members post
		Meteor.subscribe('posts', 'group_member_all_by_group_id', group._id );
		
		var members = Posts.find({type:"project_worker", status:"publish"});
		members.forEach(function(member){
			Meteor.subscribe('posts', 'group_member_user_profile', member.owner_id );
			Meteor.subscribe('posts', 'group_member_role', member.owner_id);
		});
		
		// PROJECT COMMENTS
		// ==========
		Meteor.subscribe('posts', 'group_projects_comment_by_id', groups_project._id );
		
		// TASK LISTS
		// ==========
		// groups_task_list
		Meteor.subscribe('posts', 'groups_task_list_by_parent_id', Router.current().params.groupsProjectId );
		var task_lists = Posts.find({type:"groups_task_list", status:"publish"}); 
		
		// TASK LIST COMMENTS
		// ==========
		// groups_task_list_comments
		// task
		task_lists.forEach(function(list){
			Meteor.subscribe('posts', 'groups_task_list_comments_by_parent_id', list._id );
			Meteor.subscribe('posts', 'tasks_by_parent_id', list._id );
		});
		
		
	},
	template:'screen',
	yieldTemplates: {
		'group_projects_details': {to: 'content'},
	}
	
});

Template.group_projects_details.rendered = function() {


};



// Events
Template.group_projects_details.events({
	
		
	// CREATE / UPDATE
	'submit'(event) {
		
		event.preventDefault();
		const target = event.target;
		
		// ---------------
		// Project Comment
		// ---------------
		if(target.action.value == "comment"){
			
			Meteor.call('posts.update',
				"new",
				"me",
				"",
				target.content.value,
				"group_projects_comment",
				target.the_group_project_id.value,
				"publish",
				function(error, parent_post_id){
					
					// Reset Form
					$(".comment_container").val(""); 
					
				}
			);
		}
		
		// ---------------
		// Task List Comment
		// ---------------
		if(target.action.value == "task_list_comment"){
			
			Meteor.call('posts.update',
				"new",
				"me",
				"",
				target.content.value,
				"groups_task_list_comments",
				target.the_task_list_id.value,
				"publish",
				function(error, parent_post_id){
					
					// Reset Form
					$(".comment_container").val(""); 
					
				}
			);
		}
		
		// ---------------
		// Task Add
		// ---------------
		if(target.action.value == "task_add"){
			
			Meteor.call('posts.update',
				"new",
				"me",
				"",
				"",
				"task",
				target.the_task_list_id.value,
				"publish",
				function(error, parent_post_id){
					// Nothing to do
				}
			);
		}
		
		// ---------------
		// Task Update
		// ---------------
		if(target.action.value == "task_update"){
			
			swal({
				title: "Task Updated",
				text: "",
				type: "success",
				showCancelButton: false,
				cancelButtonText: "Cancel",
				confirmButtonText: "Close",
			});
			
			Meteor.call('posts.update',
				target.task_id.value,
				"me",
				$("#"+target.task_id.value+".form-control").val(),
				$("input#"+target.task_id.value).is(":checked"),
				"task",
				target.the_task_list_id.value,
				"publish",
				function(error, parent_post_id){
					// Nothing to do
				}
			);
		}
		
		// ---------------
		// Task Delete
		// ---------------
		if(target.action.value == "task_delete"){
			
			swal({
				title: "Really delete this task?",
				text: "",
				type: "question",
				showCancelButton: true,
				cancelButtonText: "Cancel",
				confirmButtonText: "Delete",
				confirmButtonColor: "#c0392b",
			}).then(function (result) {
				
				Meteor.call('posts.trash',
					target.task_id.value,
					function(error, parent_post_id){
						
						// Trash complete						
						swal({
							title: "Trashed Task",
							text: "",
							type: "error",
							showCancelButton: false,
							cancelButtonText: "Cancel",
							confirmButtonText: "Close",
						}).then(function (result) {
							
						});
						
					}
				);
				
			});
			
			
		}
		
	},
	'click .task_checkbox'(event){
		
		const target = event.target;
		var isChecked = event.target.checked;
		
		console.log("Checking Box: "+event.target.id+" as "+isChecked);
		
		Meteor.call('posts.updateCheckbox',
			event.target.id,
			isChecked,
		);
		
	},

});



// skyrooms Helper
Template.group_projects_details.helpers({
	
	slug(string){
		return ToSeoUrl(string);
	},
	group_slug(){
		return Router.current().params.group_slug; 
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
		var members = Posts.find({type:"project_worker", status:"publish"});
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
		
	},
	
	project_comments(){
		return Posts.find({type: "group_projects_comment"}, { sort: { createdAt: 1 } }, {limit:8} );
	},
	
	groups_task_list_id(){
		var list = Posts.findOne({type:"groups_task_list", _id:this._id}); 
		if(list){
			return list._id;
		} else {
			return false;
		}
	},
	
	groups_task_list(){
		return Posts.find({type:"groups_task_list"});
	},
	
	groups_task_list_comments(){
		return Posts.find({type: "groups_task_list_comments", parent_id:this._id}, { sort: { createdAt: 1 } }, {limit:8} );
	},
	
	task(){
		return Posts.find({type: "task", parent_id:this._id}, { sort: { createdAt: 1 } } );
	},
	task_checked(){
		var task = Posts.findOne({type:"task", _id:this._id}); 
		if(task.content==true){
			return true;
		} else {
			return false;
		}
	},
  
});



