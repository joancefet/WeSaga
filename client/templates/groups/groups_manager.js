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
		
		Meteor.subscribe('posts', 'group_location',  Router.current().params.groupId );
		Meteor.subscribe('posts', 'group_location_lat',  Router.current().params.groupId );
		Meteor.subscribe('posts', 'group_location_lng',  Router.current().params.groupId );
		Meteor.subscribe('posts', 'group_phone',  Router.current().params.groupId );
		Meteor.subscribe('posts', 'group_email',  Router.current().params.groupId );
			
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
			tinyMCE.get('group_description').getContent(),
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
				
				// the_group_location	
				group_location_id = "new";
				var group_location = Posts.findOne({type:"group_location"}); 
				if(group_location){
					group_location_id =  group_location._id;
				}
				Meteor.call('posts.update',
					group_location_id,
					"me",
					"",
					target.the_group_location.value,
					"group_location",
					parent_id,
					"publish",
				);
				
				var address = target.the_group_location.value;
				address = encodeURIComponent(address);
				
				$.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key=AIzaSyATUzfjVr1TtxqBIvDJa2AKnNYdgu_XXKE').done(function(google){
					if(google.status != "ZERO_RESULTS"){
						
						// the_group_location_lat
						group_location_lat_id = "new";
						var group_location_lat = Posts.findOne({type:"group_location_lat"}); 
						if(group_location_lat){
							group_location_lat_id =  group_location_lat._id;
						}
						Meteor.call('posts.update',
							group_location_lat_id,
							"me",
							"",
							google.results[0].geometry.location.lat,
							"group_location_lat",
							parent_id,
							"publish",
						);
						
						// the_group_location_lng
						group_location_lng_id = "new";
						var group_location_lng = Posts.findOne({type:"group_location_lng"}); 
						if(group_location_lng){
							group_location_lng_id =  group_location_lng._id;
						}
						Meteor.call('posts.update',
							group_location_lng_id,
							"me",
							"",
							google.results[0].geometry.location.lng,
							"group_location_lng",
							parent_id,
							"publish",
						);
						
					}else{
						swal({
							title: "Invalid Address",
							text: "Please check your address input and try again",
							type: "error",
							showCancelButton: false,
							confirmButtonText: "Try Again",
						});
					}
				});
				
				// group_phone	
				group_phone_id = "new";
				var group_phone = Posts.findOne({type:"group_phone"}); 
				if(group_phone){
					group_phone_id =  group_phone._id;
				}
				Meteor.call('posts.update',
					group_phone_id,
					"me",
					"",
					target.the_group_phone.value,
					"group_phone",
					parent_id,
					"publish",
				);
				
				// group_email	
				group_email_id = "new";
				var group_email = Posts.findOne({type:"group_email"}); 
				if(group_email){
					group_email_id =  group_email._id;
				}
				Meteor.call('posts.update',
					group_email_id,
					"me",
					"",
					target.the_group_email.value,
					"group_email",
					parent_id,
					"publish",
				);
				
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
	
	the_group_location(){
		var post = Posts.findOne({type:"group_location"}); 
		return post.content; 
	},
	the_group_location_lat(){
		var post = Posts.findOne({type:"group_location_lat"}); 
		return post.content; 
	},
	the_group_location_lng(){
		var post = Posts.findOne({type:"group_location_lng"}); 
		return post.content; 
	},
	
	the_group_phone(){
		var post = Posts.findOne({type:"group_phone"}); 
		return post.content; 
	},
	
	the_group_email(){
		var post = Posts.findOne({type:"group_email"}); 
		return post.content; 
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

