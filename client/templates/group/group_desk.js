import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// ROUTER
//=========
Router.route('/group/:group_slug',{
	data:function(){
		
	},
	waitOn: function(){
		Meteor.subscribe('posts', 'group_desk',  ToSeoUrl(Router.current().params.group_slug) );
		Meteor.subscribe('posts', "group_desk_posts", ToSeoUrl(Router.current().params.group_slug) ); 
	},
	template:'screen',
	yieldTemplates: {
		'group_desk': {to: 'content'},
	}
	
});

Router.route('/group/:group_slug/desk',{
	data:function(){
		
	},
	waitOn: function(){
		Meteor.subscribe('posts', 'group_desk',  ToSeoUrl(Router.current().params.group_slug) );
		Meteor.subscribe('posts', "group_desk_posts", ToSeoUrl(Router.current().params.group_slug) ); 
	},
	template:'screen',
	yieldTemplates: {
		'group_desk': {to: 'content'},
	}
	
});

Template.group_desk.rendered = function() {

};


// skyrooms Helper
Template.group_desk.helpers({
	
	group_slug(){
		return Router.current().params.group_slug; 
	},
	
	group_desk() {
		return Posts.findOne({});
		//return Meteor.users.findOne({ "profile.username":Router.current().params.user_slug }); 
	},
	
	
	desk_posts() {
		return Posts.find({type:"desk_posts"}, {sort: { createdAt: -1 } });
	},
	
	post_attachment(){
		Meteor.subscribe('postsmeta', "post_attachment", this._id);
		return Postsmeta.find({type: "post_attachment", parent_id:this._id});
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
	
	noColleagueStatus(){
		var posts = Posts.findOne({title:this._id });
		if(posts){
		}else{
			return "notFound";
		}
	},	
	colleagueStatus(userId) {	
		return Posts.find({title:this._id}); 
	},
	checkStatus(status){
		var posts = Posts.findOne({_id:this._id, type:"colleagues" });
		if(posts.status == status){
			return true;
		}else{
			return false;
		}
	},
	
	slug(string){
		return ToSeoUrl(string);
	},
	
	// Google Map helper.
	mapOptions2: function() {
		console.log("mapOptions called.");
		if (GoogleMaps.loaded()) {
		  return {
			center: new google.maps.LatLng(Meteor.user().profile.location_latitude, Meteor.user().profile.location_longitude),
			zoom: 8,
			disableDefaultUI: true, 
			draggable: true,
			scrollwheel: true,
			disableDoubleClickZoom: true,
		  };
		  
		}
	},
  
});





// Events
Template.group_desk.events({


});
