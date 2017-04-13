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
	slug(title){
		return ToSeoUrl(title); 
	},
	meta_meeting_image(){
		Meteor.subscribe('postsmeta', "meeting_meta", this._id);
		var meta = Postsmeta.findOne({title:"meta_meeting_image", parent_id:this._id});
		if(meta){ 
			return meta;
		}
	},
	
});
