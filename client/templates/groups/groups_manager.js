import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// ROUTER
//=========

Router.route('/groups/manage/',{
	data:function(){
		
		if( !Meteor.user()){
			Router.go('/');
		}
	},
	waitOn: function(){
		
	},
	template:'screen',
	yieldTemplates: {
		'groups_manager': {to: 'content'},
	}
	
});

Router.route('/groups/manage/:groupId',{
	data:function(){
		
		if( !Meteor.user()){
			Router.go('/');
		}
	},
	waitOn: function(){
		
		if( Router.current().params.groupId != "" ){
			Meteor.subscribe('posts', 'group_by_id',  Router.current().params.groupId );
		}
		
	},
	template:'screen',
	yieldTemplates: {
		'groups_manager': {to: 'content'},
	}
	
});

Template.groups_manager.rendered = function() {
	
};


// Events
Template.groups_manager.events({
	
	// CREATE / UPDATE
	'submit'(event) {
		
		event.preventDefault();
		const target = event.target;
		
		var group_id = "unset";
		if(target.the_group_id.value){
			group_id = target.the_group_id.value;
		} else {
			group_id = "new";
		}
		
		// UPDATE
		Meteor.call('posts.update',
			group_id,
			"me",
			target.title.value,
			target.content.value,
			"groups",
			"",
			"publish"
			,function(error, result, event){
				
				// group Meta Data
				// -----------------
				
				returned_group_id = result; 
				
				var update_meta_by_parent = false;
				if(group_id != "new"){ 
					update_meta_by_parent = true; 
				}
				
				// Image
				if($("#fileInput").prop('files')){
					
					console.log("Starting Upload");
					
					Cloudinary.upload( $("#fileInput").prop('files'), function(error, result){
						
						// meta_group_image	
						Meteor.call('postsmeta.update',
							group_id,
							"me",
							"meta_group_image",
							"https://res.cloudinary.com/skyroomsio/image/upload/c_thumb,h_256,w_256/v1489424858/"+result.public_id+"."+result.format,
							"group_meta",
							returned_group_id,
							"publish",
							update_meta_by_parent
						);
						
						console.log("Upload Complete: "+group_id);
						
					});
				}
				
				// Become a member of this group
				Meteor.call('posts.update',
					"new",
					"me",
					target.title.value,
					"",
					"group_member",
					returned_group_id,
					"accepted"
				);
				
				// Become group admin
				Meteor.call('posts.update',
					"new",
					"me",
					target.title.value,
					"",
					"group_member_role",
					returned_group_id,
					"admin"
				);
				
				// meta_listing	
				Meteor.call('postsmeta.update',
					group_id,
					"me",
					"meta_listing",
					target.meta_listing.value,
					"group_meta",
					returned_group_id,
					"publish",
					update_meta_by_parent
				);
				
				// All Done
				Router.go("/groups");
				
				if(group_id == "new"){
					swal({
						title: "Group Created",
						text: "",
						type: "success",
						showCancelButton: false,
						cancelButtonText: "Cancel",
						confirmButtonText: "Close",
						
					});
				}else{
					swal({
						title: "Group Updated",
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
			title: "Delete this group?",
			text: "(The group will become archieved for 2 months in case you change your mind)",
			type: "warning",
			showCancelButton: true,
			cancelButtonText: "Cancel",
			confirmButtonColor: "#c0392b",
			confirmButtonText: "Delete group",
		}).then(function (result) {			
			console.log("TRASH GROUP: "+Router.current().params.groupId);
			Meteor.call('posts.trash',
				Router.current().params.groupId,
			);
			Router.go('/groups',);
			
		});
		
	},
	
});


// skyrooms Helper
Template.groups_manager.helpers({
	
	
	slug(title){
		return ToSeoUrl(title); 
	},
	
	groups() {
		
		var groupIds = Posts.find({	type:"groups" }).map(function(group){
			// Meteor.subscribe('posts', 'groups', group.parent_id ); 			
			// Meteor.subscribe('posts', 'group_member_role', group.parent_id ); 			
			Meteor.subscribe('postsmeta', 'group_meta', group._id ); 			
			return group.parent_id; 
			
		});
		
		return Posts.find({type:"groups", status:{$ne:"trash"}});
	},
	
	the_group_id(){
		var group = Posts.findOne({type:"groups"}); 
		if(group){
			return group._id;
		} else {
			return false;
		}
	},
	
	the_group_title(){
		var group = Posts.findOne({type:"groups"}); 
		if(group){
			return group.title;
		} else {
			return false;
		}
	},
	
	the_group_content(){
		var group = Posts.findOne({type:"groups"}); 
		if(group){
			return group.content;
		} else {
			return false;
		}
	},
	
	meta_listing(){
		return Postsmeta.findOne({title:"meta_listing"});
	},
	
	meta_group_image(){
		
		var meta = Postsmeta.findOne({title:"meta_group_image"});
		if(meta){ 
			return meta.content;
		}else{
			return false;
		}
	},
	
  
});

