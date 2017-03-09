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
		Meteor.subscribe('posts', 'meetings', Meteor.userId() ); 
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
		Meteor.subscribe('posts', 'meetings', Meteor.userId() ); 
		Meteor.subscribe('postsmeta', 'meeting_meta', Router.current().params.roomId ); 
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
			target.content.value,
			"meetings",
			"",
			"publish"
			,function(error, result){
				
				// Meeting Meta Data
				// -----------------
				
				returned_meeting_id = result; 
				
				var update_meta_by_parent = false;
				if(meeting_id != "new"){ 
					update_meta_by_parent = true; 
				}
				
				// meta_password	
				Meteor.call('postsmeta.update',
					meeting_id,
					"me",
					"meta_password",
					target.meta_password.value,
					"meeting_meta",
					returned_meeting_id,
					"publish",
					update_meta_by_parent
				);
				
				// meta_password_required	
				Meteor.call('postsmeta.update',
					meeting_id,
					"me",
					"meta_password_required",
					target.meta_password_required.value,
					"meeting_meta",
					returned_meeting_id,
					"publish",
					update_meta_by_parent
				);
				
				// meta_type	
				Meteor.call('postsmeta.update',
					meeting_id,
					"me",
					"meta_type",
					target.meta_type.value,
					"meeting_meta",
					returned_meeting_id,
					"publish",
					update_meta_by_parent
				);
				
				// meta_listing	
				Meteor.call('postsmeta.update',
					meeting_id,
					"me",
					"meta_listing",
					target.meta_listing.value,
					"meeting_meta",
					returned_meeting_id,
					"publish",
					update_meta_by_parent
				);
				
				
				// meta_groups_only	
				Meteor.call('postsmeta.update',
					meeting_id,
					"me",
					"meta_groups_only",
					target.meta_groups_only.value,
					"meeting_meta",
					returned_meeting_id,
					"publish",
					update_meta_by_parent
				);
				
				// meta_colleague_only	
				Meteor.call('postsmeta.update',
					meeting_id,
					"me",
					"meta_colleague_only",
					target.meta_colleague_only.value,
					"meeting_meta",
					returned_meeting_id,
					"publish",
					update_meta_by_parent
				);
				
				
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
	
	paramRoomId() {
		return Posts.findOne({"_id":Router.current().params.roomId});
	},
	slug(title){
		return ToSeoUrl(title); 
	},
	
	// Meta Data
	meta_password(){
		return Postsmeta.findOne({title:"meta_password"});
	},
	meta_password_required(){
		return Postsmeta.findOne({title:"meta_password_required"});
	},
	meta_type(){
		return Postsmeta.findOne({title:"meta_type"});
	},
	meta_listing(){
		return Postsmeta.findOne({title:"meta_listing"});
	},
	meta_groups_only(){
		return Postsmeta.findOne({title:"meta_groups_only"});
	},
	meta_colleague_only(){
		return Postsmeta.findOne({title:"meta_colleague_only"});
	},
	
});
