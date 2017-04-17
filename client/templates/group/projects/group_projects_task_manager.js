import { Posts } 					from '../../../../imports/posts.js';

// ROUTER
//=========

Router.route('/group/:group_slug/projects/task_manager',{
	data:function(){
		
		if( !Meteor.user()){
			Router.go('/');
		}
	},
	waitOn: function(){
		
		Meteor.subscribe('posts', "notify", Meteor.userId() ); 
		
		// group_by_slug
		Meteor.subscribe('posts', 'group_by_slug',  ToSeoUrl(Router.current().params.group_slug) );

	},
	template:'screen',
	yieldTemplates: {
		'group_projects_task_manager': {to: 'content'},
	}
	
});

Router.route('/group/:group_slug/projects/task_manager/:groupsProjectId/:taskListId',{
	data:function(){
		
		if( !Meteor.user()){
			Router.go('/');
		}
	},
	waitOn: function(){
		
		// group_by_slug
		Meteor.subscribe('posts', 'group_by_slug',  ToSeoUrl(Router.current().params.group_slug) );
		
		// groups_project_by_id
		Meteor.subscribe('posts', 'groups_project_by_id', Router.current().params.groupsProjectId );
		
		// groups_task_list
		Meteor.subscribe('posts', 'groups_task_list_by_id', Router.current().params.taskListId );
		
	},
	template:'screen',
	yieldTemplates: {
		'group_projects_task_manager': {to: 'content'},
	}
	
});

Template.group_projects_task_manager.rendered = function() {
	
};


// Events
Template.group_projects_task_manager.events({
	
	// CREATE / UPDATE
	'submit'(event) {
		
		event.preventDefault();
		const target = event.target;
		
		var POST_ID = "unset";
		if(target.the_group_task_list_id.value){
			POST_ID = target.the_group_task_list_id.value;
		} else {
			POST_ID = "new";
		}
		
		// UPDATE
		Meteor.call('posts.update',
			POST_ID,
			"me",
			target.title.value,
			target.content.value,
			"groups_task_list",
			target.the_group_project_id.value,
			"publish"
			,function(error, result, event){
				
				// All Done
				Router.go("/group/"+target.group_slug.value+"/projects/details/"+target.the_group_project_id.value);
				
				if(POST_ID == "new"){
					swal({
						title: "Group Task List Created",
						text: "",
						type: "success",
						showCancelButton: false,
						cancelButtonText: "Cancel",
						confirmButtonText: "Close",
					});
				}else{
					swal({
						title: "Group Task List Updated",
						text: "",
						type: "success",
						showCancelButton: false,
						cancelButtonText: "Cancel",
						confirmButtonText: "Close",
						
					});
				}
				
			}
		);
		
		
		// update should have completed
		
	},
	
	// DELETE
	'click #groups_delete'(event) {
		event.preventDefault();
		
		swal({
			title: "Delete the ENTIRE Group Project Category?",
			text: "(The category will become archieved for 2 months in case you change your mind)",
			type: "warning",
			showCancelButton: true,
			cancelButtonText: "Cancel",
			confirmButtonColor: "#c0392b",
			confirmButtonText: "Delete group",
		}).then(function (result) {			
			console.log("TRASH groups_project_category: "+Router.current().params.groupId);
			Meteor.call('posts.trash',
				Router.current().params.projectCategoryId,
			);
			Router.go('/group/'+Router.current().params.group_slug+"/projects",);
			
		});
		
	},
	
	'click .add_task'(event){
		alert('click');
	}
	
});


// skyrooms Helper
Template.group_projects_task_manager.helpers({
	
	slug(title){
		return ToSeoUrl(title); 
	},
	group_slug(){
		return Router.current().params.group_slug; 
	},
	group_project_slug(){
		return Router.current().params.groupsProjectId
	},	
	
	groups_task_list() {
		
		var groupIds = Posts.find({	type:"groups_task_list" }).map(function(group){	
			return group.parent_id; 
		});
		
		return Posts.find({type:"groups_task_list", status:{$ne:"trash"}});
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
	
	the_group_task_list_id(){
		var list = Posts.findOne({type:"groups_task_list"}); 
		if(list){
			return list._id;
		} else {
			return false;
		}
	},
	
	the_group_task_list_title(){
		var group = Posts.findOne({type:"groups_task_list"}); 
		if(group){
			return group.title;
		} else {
			return false;
		}
	},
	
	the_group_task_list_content(){
		var group = Posts.findOne({type:"groups_task_list"}); 
		if(group){
			return group.content;
		} else {
			return false;
		}
	},
	
	tasks(){
		return Posts.find({type:"tasks"});
	}
	
  
});

