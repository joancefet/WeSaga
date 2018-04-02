// Route
import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// Route
Router.route('/meetings',{

	data:function(){
		
		if( !Meteor.user() ){
			Router.go('/');
		}
	},
	waitOn: function(){
		Meteor.subscribe('posts', "notify", Meteor.userId() ); 
		
		Meteor.subscribe('posts', 'meetings', Meteor.userId()); 
		var meetings = Posts.find({type:"meetings"});
		
		meetings.forEach(function(meeting){
			Meteor.subscribe('posts', 'meetings_by_id', meeting._id ); 			
			Meteor.subscribe('posts', 'meetings_image_by_group_id',  meeting._id  ); 
		});
	},
	template:'screen',
	yieldTemplates: {
		'meetings': {to: 'content'},
	}
	
});

// Render
Template.meetings.rendered = function() {

};


// Events
Template.meetings.events({
	
});

// Events
Template.meetings.helpers({
	
	meetings() {
		return Posts.find({type:"meetings", status:{$ne:"trash"}});
	},
	the_meeting_slug(){
		var meeting = Posts.findOne({type:"meetings", _id:this._id});
		if(meeting){ 
			return meeting.slug;
		}else{
			return false;
		}
	},
	meetings_image(){
		var image = Posts.findOne({type:"meetings_image", parent_id:this._id});
		if(image){ 
			return image.content;
		}else{
			return false;
		}
	},
	
	
});
