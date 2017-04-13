import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// ROUTER
//=========
Router.route('/group/:group_slug/article/:articleSlug',{
	data:function(){
		
	},
	waitOn: function(){
		
		Meteor.subscribe('posts', "notify", Meteor.userId() ); 
		
		// Find articles
		// Meteor.subscribe('posts', 'articles_by_group_slug',  ToSeoUrl(Router.current().params.group_slug) );
		
		Meteor.subscribe('posts', 'articles_by_slug', ToSeoUrl(Router.current().params.articleSlug) );
		var article = Posts.findOne ({type:"article"}); 

		Meteor.subscribe('posts', 'article_content_by_article_id', article._id );
		Meteor.subscribe('posts', 'article_image_by_article_id', article._id );
		
	},
	template:'screen',
	yieldTemplates: {
		'group_article': {to: 'content'},
	}
	
});

Template.group_article.rendered = function() {

};





// Events
Template.group_article.events({
	

});




// skyrooms Helper
Template.group_article.helpers({
	

	slug(string){
		return ToSeoUrl(string);
	},
	group_slug(){
		return Router.current().params.group_slug; 
	},
	
	article(){
		return Posts.find({type:"article"}); 
	},
	the_article_slug(){
		article = Posts.findOne({type:"article"}); 
		if(article){
			return article.slug;
		}else{
			return false;
		}
	},
	article_image(){
		image = Posts.findOne({type:"article_image"}); 
		if(image){
			return image.content;
		}else{
			return false;
		}
	},
	article_content(){
		return Posts.find({type:"article_content"}); 
	},
	
	project_comments(){
		return Posts.find({type: "group_projects_comment"}, { sort: { createdAt: 1 } }, {limit:8} );
	},
  
});
