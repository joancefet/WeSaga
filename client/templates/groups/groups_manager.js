import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// ROUTER
//=========
Router.route('/groups/manage',{
	data:function(){
		
		if( !Meteor.user()){
			Router.go('/');
		}
	},
	waitOn: function(){
		Meteor.subscribe('posts', 'groups', Meteor.userId()); 
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
			text: "Users will see a 'group Room Closed' message",
			type: "warning",
			showCancelButton: true,
			cancelButtonText: "Cancel",
			confirmButtonColor: "#c0392b",
			confirmButtonText: "Delete group",
			
		},
		function(){				
			
			Meteor.call('posts.remove',
				Router.current().params.roomId,
			);
			Router.go('/groups',);
			
		});
		
	},
	
});