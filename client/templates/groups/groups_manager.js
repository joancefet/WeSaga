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
		Meteor.subscribe('posts', "notify", Meteor.userId() ); 
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
		
		Meteor.subscribe('posts', 'group_image_by_group_id', Router.current().params.groupId ); 
		Meteor.subscribe('posts', 'group_by_id',  Router.current().params.groupId );
		Meteor.subscribe('posts', 'group_member_by_group_id',  Router.current().params.groupId );
		Meteor.subscribe('posts', 'group_member_role_by_group_id',  Router.current().params.groupId );
		Meteor.subscribe('posts', 'group_listing_by_group_id',  Router.current().params.groupId );
			
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
			,function(error, parent_id, event){
				
				// group Meta Data
				// -----------------
				
				// Image
				if($("#fileInput").prop('files')){
					
					group_image_id = "new";
					group = Posts.findOne({type:"group_image"}); 
					if(group){
						group_image_id = group._id;
					}
					
					Cloudinary.upload( $("#fileInput").prop('files'), function(error, result){
						
						// meta_group_image	
						Meteor.call('posts.update',
							group_image_id,
							"me",
							"group_image",
							"https://res.cloudinary.com/skyroomsio/image/upload/c_thumb,h_256,w_256/v1489424858/"+result.public_id+"."+result.format,
							"group_image",
							parent_id,
							"publish",
						);
						
					});
				}
				
				// Are we already a member? 
				// No: create membership
				// Yes: Skip membership
				group_id = "new";
				var group = Posts.findOne({type:"groups"}); 
				if(group){
					group_id =  group._id;
				}
				if(group_id == "new"){
					
					// Become a member of this group
					Meteor.call('posts.update',
						"new",
						"me",
						target.title.value,
						"",
						"group_member",
						parent_id,
						"accepted"
					);
					
					// Become group admin
					Meteor.call('posts.update',
						"new",
						"me",
						target.title.value,
						"",
						"group_member_role",
						parent_id,
						"admin"
					);
				}
				
				// group_listing	
				group_listing_id = "new";
				var group_listing = Posts.findOne({type:"group_listing"}); 
				if(group_listing){
					group_listing_id =  group_listing._id;
				}
				Meteor.call('posts.update',
					group_listing_id,
					"me",
					"",
					target.group_listing.value,
					"group_listing",
					parent_id,
					"publish",
				);
				
				// All Done
				
				if(group_id == "new"){
					swal({
						title: "Group Created",
						text: "",
						type: "success",
						showCancelButton: false,
						cancelButtonText: "Cancel",
						confirmButtonText: "Close",
						
					}).then(function (result) {
						Router.go("/groups");
					});
				}else{
					swal({
						title: "Group Updated",
						text: "",
						type: "success",
						showCancelButton: false,
						cancelButtonText: "Cancel",
						confirmButtonText: "Close",
					}).then(function (result) {
						Router.go("/groups");
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
	
	group_listing(){
		return Posts.findOne({type:"group_listing"});
	},
	
	group_image(){
		var image = Posts.findOne({title:"group_image"});
		if(image){ 
			return image.content;
		}else{
			return false;
		}
	},
	
  
});

