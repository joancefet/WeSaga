// Route
import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// Route
Router.route('/buzz',{
	data:function(){
		
		if( !Meteor.user() ){
			Router.go('/');
		}
	},
	waitOn: function(){
		Meteor.subscribe('posts', 'people_colleagues'); 
		if(!Router.current().params.user_slug){
			Meteor.subscribe('posts', 'people_all'); 		
		}
	},
	template:'screen',
	yieldTemplates: {
		'buzz': {to: 'content'},
	}
	
});

// Render
Template.buzz.rendered = function() {

};


// Events
Template.buzz.events({
	
	// Submit New Post
	'submit .new-post'(event) {
		event.preventDefault();
		
		Meteor.call('posts.update',
			"new",
			"me",
			"",
			$(".new-post .form-control").val(),
			"desk_posts",
			"",
			"publish"
		);
		$(".new-post .form-control").val(""); // reset
		
	},
	
	// Comment
	'submit .comment'(event) {
		event.preventDefault();
		
		const target = event.target;
		console.log(target);
		
		Meteor.call('postsmeta.update',
			"new",
			"me",
			"",
			target.content.value,
			"post_comment",
			target.parent_id.value,
		);
		
		$('[name=content]').val('');
	},
	
});

// Helpers
Template.buzz.helpers({
	
	colleagues_post() {
		
		// Find ID's of Colleagues
		var colleagueIds = Posts.find({	type:"colleagues" }).map(function(person){ 
			return person.title; 
		});
		
		// Subscribe to each Colleague
		colleagueIds.forEach(function(colleague){
			
			// Post.find({"user_id":user_id}, {skip: 0, limit: 5}); // Sample useage of skipping and limits!
			Meteor.subscribe('posts', "desk_posts", colleague ); 
		});
		
		// This user should be added to the Buzz as well.
		Meteor.subscribe('posts', "desk_posts", Meteor.userId() ); 
		
		
		// Find and return their recent desk_post
		return Posts.find({type:"desk_posts"}, {sort: { createdAt: -1 } });

		//return Meteor.users.find({ "_id": { "$in": colleagueIds }}, {sort: { _id: -1 }} );
		
	},
	
	desk_comments(){
		// SUBSCRIBE TO POSTMETA: parent_id
		Meteor.subscribe('postsmeta', "desk_comments", this._id); 
		return Postsmeta.find({parent_id:this._id});
	},
	
	HasOwnerAvatar(){
		if(this.owner_avatar != "undefined"){
			return true;
		}
	},
	
	slug(string){
		return ToSeoUrl(string);
	}
	
});