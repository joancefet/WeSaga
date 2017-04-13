import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// ROUTER
//=========
Router.route('/group/:group_slug/articles',{
	data:function(){
		
	},
	waitOn: function(){
		
		Meteor.subscribe('posts', "notify", Meteor.userId() ); 
		
		// group_by_slug
		Meteor.subscribe('posts', 'group_by_slug',  ToSeoUrl(Router.current().params.group_slug) );
		var group = Posts.findOne({type:"groups"});
		
		
		// Find articles
		Meteor.subscribe('posts', 'articles_by_group_parent_id', group._id );
		var articles = Posts.find({type:"article"}); 
		articles.forEach(function(article){
			//Meteor.subscribe('posts', 'article_content_by_article_id', article._id );
			Meteor.subscribe('posts', 'article_image_by_article_id', article._id );
		});
		
	},
	template:'screen',
	yieldTemplates: {
		'group_articles': {to: 'content'},
	}
	
});

Template.group_articles.rendered = function() {

};



// Events
Template.group_articles.events({
	

});



// skyrooms Helper
Template.group_articles.helpers({
	
	group_slug(){
		return Router.current().params.group_slug; 
	},
	
	article_in_group(){
		return Posts.find({type:"article"}); 
	},
	article_image(){
		image = Posts.findOne({type:"article_image", parent_id:this._id}); 
		console.log(image);
		if(image){
			return image.content;
		}else{
			return false;
		}
	},
  
});

