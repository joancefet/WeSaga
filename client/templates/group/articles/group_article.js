import { Posts } 					from '../../../../imports/posts.js';

// ROUTER
//=========
Router.route('/group/:group_slug/article/:articleSlug',{
	data:function(){
		
	},
	waitOn: function(){
		
		Meteor.subscribe('posts', "notify", Meteor.userId() ); 
		
		Meteor.subscribe('posts', 'group_by_slug',  ToSeoUrl(Router.current().params.group_slug) );
		var group = Posts.findOne({type:"groups"});
		
		Meteor.subscribe('posts', 'group_image_by_group_id', group._id ); 
		
		Meteor.subscribe('posts', 'articles_by_slug', ToSeoUrl(Router.current().params.articleSlug) );
		var article = Posts.findOne ({type:"article"}); 

		Meteor.subscribe('posts', 'article_content_by_article_id', article._id );
		Meteor.subscribe('posts', 'article_image_by_article_id', article._id );
		
		Meteor.subscribe('posts', 'article_comments', article._id );
		
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
	
	// Comment
	'submit .comment'(event) {
		event.preventDefault();
		
		if( !Meteor.user() ){
			swal({
				title: "Please sign in to SkyRooms to comment",
				text: "",
				type: "warning",
				showCancelButton: false,
				confirmButtonText: "Close",
			});
			return;
		}
		
		const target = event.target;
		console.log(target);
		
		Meteor.call('posts.update',
			"new",
			"me",
			"",
			target.content.value,
			"article_comments",
			target.parent_id.value,
		);
		
		$('[name=content]').val('');
	},
	
});


// skyrooms Helper
Template.group_article.helpers({
	

	slug(string){
		return ToSeoUrl(string);
	},
	group_slug(){
		return Router.current().params.group_slug; 
	},
	
	the_group_title(){
		var group = Posts.findOne({type:"groups"}); 
		if(group){
			return group.title;
		} else {
			return false;
		}
	},
	group_image(){
		var image = Posts.findOne({title:"group_image"});
		if(image){ 
			return image.content;
		}else{
			return false;
		}
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
	
	article_comments(){
		return Posts.find({type: "article_comments"});
	}, 
  
});
