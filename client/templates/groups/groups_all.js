import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// ROUTER
//=========
Router.route('/groups/all',{
	data:function(){
		
	},
	waitOn: function(){
		window.subscription_group_search = "";
		window.subscription_group = Meteor.subscribe('posts', 'groups_all');
	},
	template:'screen',
	yieldTemplates: {
		'groups_all': {to: 'content'},
	}
	
});


Template.groups_all.rendered = function() {

};


// Events
Template.groups_all.events({
	
	// SEARCH
	// ------
	'submit .search_start'(event) {
		
		event.preventDefault();
		
		$(".search_container").hide(); 
		$(".show_loader").show();
		$(".search_container_message").html("");
		
		window.subscription_group.stop();
		
		if(window.subscription_group_search){ 
			window.subscription_group_search.stop(); 
		}
		window.subscription_group_search = Meteor.subscribe('posts', 'group_search', $(".search_value").val());
		
		setTimeout(function(){
			$(".search_container").show();
			$(".show_loader").hide();
			$(".search_container_message").html("We found the following Groups");
		},2000);
		
	},
	
	// ADD / CANCEL / REMOVE
	// ---------------------
	'submit'(event) {
		event.preventDefault();
		
		const target = event.target;
		
		// ---------------
		// Join Group
		// ---------------
		if(target.action.value == "add"){
			
			swal({
				title: "Request to Join Group sent!",
				text: "",
				type: "success",
				showCancelButton: false,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Close",
				
			});
			
			// Add Notification and Meta data		
			var post_id = Meteor.call('posts.update',
				"new",
				target.group_id.value,
				"Group Join Request from "+Meteor.user().profile.username,
				"",
				"notify",
				"",
				"new",
				function(error, return_post_id){
					
					// Group Request as a POST to ME
					Meteor.call('posts.update',
						"new",
						Meteor.userId(),
						target.group_id.value,
						"",
						"group_member",
						target.group_id.value,
						"waiting"
					);
					
					// Colleague Request as a POST to YOU
					Meteor.call('posts.update',
						"new",
						target.user_id.value,
						Meteor.userId(),
						"",
						"group_member",
						target.group_id.value,
						"request"
					);
					
				}
			);
		} // Add
		
		// ---------------
		// Cancel
		// ---------------
		if(target.action.value == "cancel"){
			swal({
				title: "Group Request Cancelled",
				text: "",
				type: "warning",
				showCancelButton: false,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Close",
				
			});
			
			// 1-OWNER) owner_id:, type:colleague, status:"waiting"
			// 2-ACTOR) 
			// 	noitifcation) PARENT ID
			// 	post)         TITLE
			
			// Remove Owner Colleague Post
			Meteor.call('posts.removeByParent',
				target.group_id.value,
			);
			
			
		}
		
		// ---------------
		// Remove
		// ---------------
		if(target.action.value == "remove"){
			
			swal({
				title: "Really leave this Group?",
				text: "",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Confirm",
				
			},
				function(){
					
					// Remove to accepted for Me
					Meteor.call('posts.removeByParent',
						target.group_id.value,
						Meteor.userId(),
					);
				
					setTimeout(function(){
					
						swal({
							title: "You have left this Group",
							text: "",
							type: "warning",
							confirmButtonColor: "#DD6B55",
							confirmButtonText: "Close",
							showCancelButton: false,
						});
					
					},200);
						
				}
					
				
			);

			
		} 
		
		
	}

});

// Helpers
Template.groups_all.helpers({
	
	groups() { 
	
		// Find all the groups on screen, then find our membership status
		var groups = Posts.find({type:"groups"});
		groups.forEach(function(group){
			Meteor.subscribe('posts', 'group_member_by_group_id', Meteor.userId(), group._id );
		});
		
		return groups;
	},
	
	slug(title){
		return ToSeoUrl(title); 
	},
	
	meta_group_image(){
		Meteor.subscribe('postsmeta', "meeting_meta", this._id);
		var meta = Postsmeta.findOne({title:"meta_group_image", parent_id:this._id});
		if(meta){ 
			return meta;
		}
	},
	
	groupsStatus(status){
		
		var posts = Posts.findOne({parent_id:this._id, type:"group_member"});
		if(posts.status == status){
			return true;
		}else{
			return false;
		}
		
	},
	
	noGroupStatus(){
		
		var posts = Posts.findOne({parent_id:this._id, type:"group_member"});
		if(posts){
			return false;
		}else{
			return "notMember";
		}
	},	
	
});
