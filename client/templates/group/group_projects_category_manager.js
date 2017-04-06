import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// ROUTER
//=========

Router.route('/group/:group_slug/projects/category_manager',{
	data:function(){
		
		if( !Meteor.user()){
			Router.go('/');
		}
	},
	waitOn: function(){
		
		// group_by_slug
		Meteor.subscribe('posts', 'group_by_slug',  ToSeoUrl(Router.current().params.group_slug) );

	},
	template:'screen',
	yieldTemplates: {
		'groups_project_category_manager': {to: 'content'},
	}
	
});

Router.route('/group/:group_slug/projects/category_manager/:projectCategoryId',{
	data:function(){
		
		if( !Meteor.user()){
			Router.go('/');
		}
	},
	waitOn: function(){
		
		// group_by_slug
		Meteor.subscribe('posts', 'group_by_slug',  ToSeoUrl(Router.current().params.group_slug) );
		
		// groups_project_category_by_parent_id
		Meteor.subscribe('posts', 'groups_project_category_by_id', Router.current().params.projectCategoryId );
		
	},
	template:'screen',
	yieldTemplates: {
		'groups_project_category_manager': {to: 'content'},
	}
	
});

Template.groups_project_category_manager.rendered = function() {
	
};


// Events
Template.groups_project_category_manager.events({
	
	// CREATE / UPDATE
	'submit'(event) {
		
		event.preventDefault();
		const target = event.target;
		
		var group_id = "unset";
		if(target.the_group_id.value){
			group_id = target.the_group_project_id.value;
		} else {
			group_id = "new";
		}
		
		// UPDATE
		Meteor.call('posts.update',
			group_id,
			"me",
			target.title.value,
			target.content.value,
			"groups_project_category",
			target.the_group_id.value,
			"publish"
			,function(error, result, event){
				
				// All Done
				Router.go("/group/"+target.group_slug.value+"/projects/");
				
				if(group_id == "new"){
					swal({
						title: "Group Project Category Created",
						text: "",
						type: "success",
						showCancelButton: false,
						cancelButtonText: "Cancel",
						confirmButtonText: "Close",
						
					});
				}else{
					swal({
						title: "Group Project Category Updated",
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
	
});


// skyrooms Helper
Template.groups_project_category_manager.helpers({
	
	slug(title){
		return ToSeoUrl(title); 
	},
	group_slug(){
		return Router.current().params.group_slug; 
	},
	
	groups_project_category() {
		
		var groupIds = Posts.find({	type:"groups_project_category" }).map(function(group){	
			return group.parent_id; 
		});
		
		return Posts.find({type:"groups_project_category", status:{$ne:"trash"}});
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
		var group = Posts.findOne({type:"groups_project_category"}); 
		if(group){
			return group._id;
		} else {
			return false;
		}
	},
	
	the_group_project_title(){
		var group = Posts.findOne({type:"groups_project_category"}); 
		if(group){
			return group.title;
		} else {
			return false;
		}
	},
	
	the_group_project_content(){
		var group = Posts.findOne({type:"groups_project_category"}); 
		if(group){
			return group.content;
		} else {
			return false;
		}
	},
	
  
});

