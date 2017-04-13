// Route
import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';


// Route
Router.route('/resume/:user_slug',{

	data:function(){
		
	},
	waitOn: function(){
		Meteor.subscribe('posts', 'resume',  ToSeoUrl(Router.current().params.user_slug) );
		Meteor.subscribe('posts', "resume_posts", ToSeoUrl(Router.current().params.user_slug) ); 
		
		Meteor.subscribe('posts', "resume_owner", ToSeoUrl(Router.current().params.user_slug) ); 
		
		Meteor.subscribe('posts', "resume_skill", ToSeoUrl(Router.current().params.user_slug) ); 		
		Meteor.subscribe('posts', "resume_education",ToSeoUrl(Router.current().params.user_slug) ); 
			Meteor.subscribe('posts', "resume_education_date1",ToSeoUrl(Router.current().params.user_slug) );
			Meteor.subscribe('posts', "resume_education_date2",ToSeoUrl(Router.current().params.user_slug) );	
			Meteor.subscribe('posts', "resume_education_type",ToSeoUrl(Router.current().params.user_slug) );
		Meteor.subscribe('posts', "resume_experience",ToSeoUrl(Router.current().params.user_slug) ); 
			Meteor.subscribe('posts', "resume_experience_group",ToSeoUrl(Router.current().params.user_slug) );
			Meteor.subscribe('posts', "resume_experience_date1",ToSeoUrl(Router.current().params.user_slug) );
			Meteor.subscribe('posts', "resume_experience_date2",ToSeoUrl(Router.current().params.user_slug) );	
			Meteor.subscribe('posts', "resume_experience_type",ToSeoUrl(Router.current().params.user_slug) );
			
	},
	template:'screen',
	yieldTemplates: {
		'resume': {to: 'content'},
	},
	onAfterAction: function() {
		
		var this_user = Meteor.users.findOne({ "profile.username":Router.current().params.user_slug }); 
		
		var seo_title 		= this_user.profile.name_first+" "+this_user.profile.name_last+"'s Resume";
		var seo_description = meta_description(this_user.profile.resume_objective); 
		var seo_image 		= this_user.profile.avatar;
		SEO.set({
			
			description: seo_description,
			title: seo_title,
			
			// separator: '-',

			meta: {
				description: seo_description,
				keywords: ['skyrooms', 'virtual', 'office'], 
			},

			og: {
				site_name: 'SkyRooms',
				image: seo_image,
				type:"article",
				url:"https://www.skyrooms.io/resume/"+Router.current().params.user_slug,
				'fb:app_id':"726835877472962",
			}
			
		});
		
	}
	
});

Template.resume.events({
	
});	


Template.resume.helpers({
	
	
	resume() {
		//Meteor.subscribe('posts', "notify_meta", this._id); 
		return Meteor.users.findOne({ "profile.username":Router.current().params.user_slug }); 
	},
	desk_posts() {
		return Posts.find({type:"desk_posts"}, {sort: { createdAt: -1 } });
	},
	
	post_attachment(){
		Meteor.subscribe('posts', "post_attachment", this._id);
		return Posts.find({type: "post_attachment", parent_id:this._id});
	},
	
	desk_comments(){
		// SUBSCRIBE TO POSTMETA: parent_id
		Meteor.subscribe('posts', "desk_comments", this._id); 
		return Posts.find({parent_id:this._id});
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
	
	my_resume(){
		if(Meteor.user().profile.username == ToSeoUrl(Router.current().params.user_slug) ) {
			return true;
		}
		return false;
	}, 
	
	
	resume_skills(){
		return Posts.find({type:"resume_skill", parent_id:this._id});
	},	
	
	resume_education(){
		return Posts.find({type:"resume_education"});
	},
	resume_education_date1(){
		return Posts.find({type:"resume_education_date1", parent_id:this._id});
	},
	resume_education_date2(){
		return Posts.find({type:"resume_education_date2", parent_id:this._id});
	},
	resume_education_type(){
		return Posts.find({type:"resume_education_type", parent_id:this._id});
	},
	
	resume_experience(){
		return Posts.find({type:"resume_experience"});
	},
	resume_experience_group(){
		return Posts.find({type:"resume_experience_group", parent_id:this._id});
	},
	resume_experience_date1(){
		return Posts.find({type:"resume_experience_date1", parent_id:this._id});
	},
	resume_experience_date2(){
		return Posts.find({type:"resume_experience_date2", parent_id:this._id});
	},
	
}); 