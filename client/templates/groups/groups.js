import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// ROUTER
//=========
Router.route('/groups',{
	data:function(){
		
		if( !Meteor.user()){
			Router.go('/');
		}
	},
	waitOn: function(){
		
		// Clear any search filters from /groups/all
		if(window.subscription_group_search){ 
			window.subscription_group_search.stop(); 
		}
		
		Meteor.subscribe('posts', 'group_member_by_user_id', Meteor.userId() ); 
		var memberships = Posts.find({type:"group_member"});
		
		memberships.forEach(function(membership){
			
			Meteor.subscribe('posts', 'group_by_id', membership.parent_id ); 
			Meteor.subscribe('posts', 'group_member_role_by_group_id', membership.parent_id ); 
			Meteor.subscribe('posts', 'group_image_by_group_id', membership.parent_id ); 
			
		});
		
	},
	template:'screen',
	yieldTemplates: {
		'groups': {to: 'content'},
	},
	
});


Template.groups.rendered = function() {

};




// Events
Template.groups.events({
	
	
	'submit'(event) {
		event.preventDefault();
		
		const target = event.target;
			
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

	},
	
});


// skyrooms Helper
Template.groups.helpers({
	
	groups() { 
		return Posts.find({ type:"groups" }, {sort: { _id: -1 }} );
	},
	
	group_image(){
		var image = Posts.findOne({title:"group_image", parent_id:this._id});
		if(image){ 
			return image.content;
		}else{
			return false;
		}
	},
	
	groupsStatus(status){
		var post = Posts.findOne({parent_id:this._id, type:"group_member"});
		if(post){
			if(post.status == status){
				return true;
			}else{
				return false;
			}
		} else { 
			return false;
		}
	},
	
	groupAdmin(){
		var admin = Posts.findOne({parent_id:this._id, type:"group_member_role", "status":"admin", owner_id:Meteor.userId() });
		if(admin){
			return true;
		}else{
			return false;
		}
	}
	
  
});



