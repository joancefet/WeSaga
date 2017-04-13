import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// ROUTER
//=========
Router.route('/group/:group_slug',{
	data:function(){
		
	},
	waitOn: function(){
		
		Meteor.subscribe('posts', "notify", Meteor.userId() ); 
		
		Meteor.subscribe('posts', 'group_by_slug', ToSeoUrl(Router.current().params.group_slug) );
		var group = Posts.findOne({type:"groups"});
		console.log(group);
		
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
		Router.go('/group/'+ToSeoUrl(Router.current().params.group_slug));
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
	
	group_desk() {
		
		// Find all the groups on screen, then find our membership status
		var groups = Posts.find({type:"groups"});
		groups.forEach(function(group){
			Meteor.subscribe('posts', 'group_member_by_group_id', Meteor.userId(), group._id );
		});
		
		return groups;
	},
	
	group_slug(){
		
		return Router.current().params.group_slug; 
	},
	
	slug(string){
		return ToSeoUrl(string);
	},
	
	isMember(){
		return true;
	},
	
	meta_group_image(){
		Meteor.subscribe('postsmeta', "meeting_meta", this._id);
		var meta = Postsmeta.findOne({title:"meta_group_image", parent_id:this._id});
		if(meta){ 
			console.log(meta);
			return meta.content;
		}else{
			return false;
		}
	},
	
	the_group_title(){
		var group = Posts.findOne({type:"groups"}); 
		if(group){
			return group.title;
		} else {
			return false;
		}
	},
	
	the_group_content(){
		var group = Posts.findOne({type:"groups"}); 
		if(group){
			return group.content;
		} else {
			return false;
		}
	},
	
	
  
});





// Events
Template.group_desk.events({


});
