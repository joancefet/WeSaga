// Route
import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';


// Route
Router.route('/people/:user_slug',{

	data:function(){
		
	},
	waitOn: function(){
		Meteor.subscribe('posts', 'people_desk',  ToSeoUrl(Router.current().params.user_slug) );
		Meteor.subscribe('posts', "people_desk_posts", ToSeoUrl(Router.current().params.user_slug) ); 
	},
	template:'screen',
	yieldTemplates: {
		'people_desk': {to: 'content'},
	}
	
});

Template.people_desk.events({
	
	// Submit New Post
	'submit .new-post'(event) {
		
		event.preventDefault();
		const target = event.target;
		
		Meteor.call('posts.update',
			"new",
			target.owner_id.value,
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


Template.people_desk.helpers({
	
	people_desk() {
		//Meteor.subscribe('postsmeta', "notify_meta", this._id); 
		return Meteor.users.findOne({ "profile.username":Router.current().params.user_slug }); 
	},
	desk_posts() {
		return Posts.find({type:"desk_posts"}, {sort: { createdAt: -1 } });
	},
	desk_comments(){
		// SUBSCRIBE TO POSTMETA: parent_id
		Meteor.subscribe('postsmeta', "desk_comments", this._id); 
		return Postsmeta.find({parent_id:this._id});
	},
	HasOwnerAvatar(){
		if(this.owner_avatar != "https://dlnde5a0p49uc.cloudfront.net/files/undefined"){
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
	}
	
});