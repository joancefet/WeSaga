// Route
import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// NEW ROUTE
Router.route('/meetings/manage/',{

	data:function(){
		
		if( !Meteor.user() ){
			Router.go('/');
		}
	},
	waitOn: function(){
		Meteor.subscribe('posts', "notify", Meteor.userId() ); 
	},
	template:'screen',
	yieldTemplates: {
		'meetings_manage': {to: 'content'},
	}
	
});

// EXISTING ROUTE
Router.route('/meetings/manage/:roomId',{

	data:function(){
		
		if( !Meteor.user() ){
			Router.go('/');
		}
	},
	waitOn: function(){
		
		Meteor.subscribe('posts', "notify", Meteor.userId() ); 
		
		Meteor.subscribe('posts', 'meetings_by_id', Router.current().params.roomId ); 
		
		Meteor.subscribe('posts', 'meetings_image_by_group_id',  Router.current().params.roomId ); 
		
	},
	template:'screen',
	yieldTemplates: {
		'meetings_manage': {to: 'content'},
	}
	
});

// Render
Template.meetings_manage.rendered = function() {
	


};


// Events
Template.meetings_manage.events({
	
	// CREATE / UPDATE
	'submit'(event) {
		
		event.preventDefault();
		const target = event.target;
		
		var meeting_id = "unset";
		if(target.the_meeting_id.value){
			meeting_id = target.the_meeting_id.value;
		} else {
			meeting_id = "new";
		}
		
		// UPDATE
		Meteor.call('posts.update',
			meeting_id,
			"me",
			target.title.value,
			tinyMCE.get('meeting_description').getContent(),
			"meetings",
			"",
			"publish"
			,function(error, parent_id, event){
				
				// Meeting Meta Data
				// -----------------
				
				// Image
				if($("#fileInput").prop('files')){
					
					meeting_image_id = "new";
					meeting = Posts.findOne({type:"meetings_image"}); 
					if(meeting){
						meeting_image_id = meeting._id;
					}
					
					Cloudinary.upload( $("#fileInput").prop('files'), function(error, result){
						
						// meta_group_image	
						Meteor.call('posts.update',
							meeting_image_id,
							"me",
							"",
							"https://res.cloudinary.com/skyroomsio/image/upload/c_thumb,h_256,w_256/v1489424858/"+result.public_id+"."+result.format,
							"meetings_image",
							parent_id,
							"publish",
						);
						
					});
				}
				
				
				// // meeting_password	
				// meeting_password_id = "new";
				// var meeting_password = Posts.findOne({type:"meeting_password"}); 
				// if(meeting_password){
					// meeting_password_id =  meeting_password._id;
				// }
				// Meteor.call('posts.update',
					// meeting_password_id,
					// "me",
					// "",
					// target.meeting_password.value,
					// "meeting_password",
					// parent_id,
					// "publish",
				// );
				
				
				// // meeting_password_required	
				// Meteor.call('posts.update',
					// meeting_id,
					// "me",
					// "",
					// target.meta_password_required.value,
					// "meeting_password_required",
					// returned_meeting_id,
					// "publish",
				// );
				
				// // meeting_type	
				// Meteor.call('posts.update',
					// meeting_id,
					// "me",
					// "",
					// target.meta_type.value,
					// "meeting_type",
					// returned_meeting_id,
					// "publish",
				// );
				
				// // meeting_listing	
				// Meteor.call('posts.update',
					// meeting_id,
					// "me",
					// "",
					// target.meta_listing.value,
					// "meeting_listing",
					// returned_meeting_id,
					// "publish",
				// );
				
				
				// // meeting_group_members_only	
				// Meteor.call('posts.update',
					// meeting_id,
					// "me",
					// "",
					// target.meta_groups_only.value,
					// "meeting_group_members_only",
					// returned_meeting_id,
					// "publish",
				// );
				
				// // meeting_colleagues_only	
				// Meteor.call('posts.update',
					// meeting_id,
					// "me",
					// "",
					// target.meta_colleague_only.value,
					// "meeting_colleagues_only",
					// returned_meeting_id,
					// "publish",
				// );				
				
				// All Done
				Router.go("/meetings");
				
				if(meeting_id == "new"){
					swal({
						title: "Meeting Created",
						text: "",
						type: "success",
						showCancelButton: false,
						cancelButtonText: "Cancel",
						confirmButtonText: "Close",
						closeOnConfirm: true
					});
				}else{
					swal({
						title: "Meeting Updated",
						text: "",
						type: "success",
						showCancelButton: false,
						cancelButtonText: "Cancel",
						confirmButtonText: "Close",
						closeOnConfirm: true
					});
				}
				
			}
		);
		
		
		// update should have completed
		
	},
	
	// DELETE
	'click #meetings_delete'(event) {
		event.preventDefault();
		
		swal({
			title: "Delete this Meeting?",
			text: "Users will see a 'Meeting Room Closed' message",
			type: "warning",
			showCancelButton: true,
			cancelButtonText: "Cancel",
			confirmButtonColor: "#c0392b",
			confirmButtonText: "Delete Meeting",
			closeOnConfirm: true
		},
		function(){				
			
			Meteor.call('posts.remove',
				Router.current().params.roomId,
			);
			Router.go('/meetings',);
			
		});
		
	},
	
});

// Events
Template.meetings_manage.helpers({
	
	slug(title){
		return ToSeoUrl(title); 
	},
	
	meetings() {
		return Posts.find({type:"meetings"});
	},
	
	meetings_image(){
		var image = Posts.findOne({type:"meetings_image"});
		if(image){ 
			return image.content;
		}else{
			return false;
		}
	},
	
	the_meeting_id(){
		var meeting = Posts.findOne({type:"meetings"}); 
		if(meeting){
			return meeting._id;
		} else {
			return false;
		}
	},
	
	the_meeting_title(){
		var meeting = Posts.findOne({type:"meetings"}); 
		if(meeting){
			return meeting.title;
		} else {
			return false;
		}
	},
	
	the_meeting_content(){
		var meeting = Posts.findOne({type:"meetings"}); 
		if(meeting){
			return meeting.content;
		} else {
			return false;
		}
	},
	
	// meta_password(){
		// return Postsmeta.findOne({title:"meta_password"});
	// },
	// meta_password_required(){
		// return Postsmeta.findOne({title:"meta_password_required"});
	// },
	// meta_type(){
		// return Postsmeta.findOne({title:"meta_type"});
	// },
	// meta_listing(){
		// return Postsmeta.findOne({title:"meta_listing"});
	// },
	// meta_groups_only(){
		// return Postsmeta.findOne({title:"meta_groups_only"});
	// },
	// meta_colleague_only(){
		// return Postsmeta.findOne({title:"meta_colleague_only"});
	// },
	
});
