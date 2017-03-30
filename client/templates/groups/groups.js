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
		
		Meteor.subscribe('posts', 'group_member', Meteor.userId() ); 
	},
	template:'screen',
	yieldTemplates: {
		'groups': {to: 'content'},
	}
	
});

// EXISTING ROUTE
Router.route('/groups/manage/:groupId',{

	data:function(){
		
		if( !Meteor.user() ){
			Router.go('/');
		}
	},
	waitOn: function(){
		Meteor.subscribe('posts', 'groups', Meteor.userId() ); 
		Meteor.subscribe('postsmeta', 'groups_meta', Router.current().params.groupId ); 
	},
	template:'screen',
	yieldTemplates: {
		'groups_manager': {to: 'content'},
	}
	
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
	
		var groupIds = Posts.find({	type:"group_member" }).map(function(group){
			
			Meteor.subscribe('posts', 'groups', group.parent_id ); 			
			Meteor.subscribe('posts', 'group_member_role', group.parent_id ); 			
			return group.parent_id; 
			
		});
		
		return Posts.find({ type:"groups", "_id": { "$in": groupIds }}, {sort: { _id: -1 }} );
		
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
  
});



