import { Posts } 					from '../../../../imports/posts.js';

// ROUTER
//=========

Router.route('/group/:group_slug/articles/manager',{
	data:function(){
		
		if( !Meteor.user()){
			Router.go('/');
		}
	},
	waitOn: function(){
		
		Meteor.subscribe('posts', "notify", Meteor.userId() ); 
		
		// group_by_slug
		Meteor.subscribe('posts', 'group_by_slug',  ToSeoUrl(Router.current().params.group_slug) );
		

	},
	template:'screen',
	yieldTemplates: {
		'group_article_manager': {to: 'content'},
	}
	
});

Router.route('/group/:group_slug/articles/manager/:articleId',{
	data:function(){
		
		if( !Meteor.user()){
			Router.go('/');
		}
		
	},
	waitOn: function(){
		
		Meteor.subscribe('posts', "notify", Meteor.userId() ); 
		
		// group_by_slug
		Meteor.subscribe('posts', 'group_by_slug', ToSeoUrl(Router.current().params.group_slug) );
		
		Meteor.subscribe('posts', 'article_by_id', Router.current().params.articleId );
		Meteor.subscribe('posts', 'article_content_by_article_id', Router.current().params.articleId );
		
		var articles = Posts.find({type:"article"}); 
		articles.forEach(function(article){
			//Meteor.subscribe('posts', 'article_content_by_article_id', article._id );
			Meteor.subscribe('posts', 'article_image_by_article_id', article._id );
		});
		
	},
	template:'screen',
	yieldTemplates: {
		'group_article_manager': {to: 'content'},
	}
	
});

Template.group_article_manager.rendered = function() {
	
};


// Events
Template.group_article_manager.events({
	
	// CREATE / UPDATE
	'submit'(event) {
		
		event.preventDefault();
		const target = event.target;
		
		var POST_ID = "unset";
		if(target.the_article_id.value){
			POST_ID = target.the_article_id.value;
		} else {
			POST_ID = "new";
		}
		
		// tinyMCE.get('article_content').getContent(),
		// UPDATE
		Meteor.call('posts.update',
			POST_ID,
			"me",
			target.title.value,
			target.content.value,
			"article",
			target.the_group_id.value,
			"publish"
			,function(error, parent_id, event){
				
				// Image
				if($("#fileInput").prop('files')){
					
					Cloudinary.upload( $("#fileInput").prop('files'), function(error, result){
						
						article_image_id = "new";
						image = Posts.findOne({type:"article_image"}); 
						if(image){
							article_image_id = image._id;
						}else{
							return false;
						}
						
						// meta_group_image	
						Meteor.call('posts.update',
							article_image_id,
							"me",
							"article_image",
							"https://res.cloudinary.com/skyroomsio/image/upload/c_fill,g_faces,h_400,w_1085/v1489424858/"+result.public_id+"."+result.format,
							"article_image",
							parent_id,
							"publish",
							result,
						);
						
					});
				}
				
				
				
				// Article Content
				article_content_id = "new";
				var article_content = Posts.findOne({type:"article_content"}); 
				if(article_content){
					article_content_id =  article_content._id;
				}
				
				Meteor.call('posts.update',
					article_content_id,
					"me",
					"Article Content",
					tinyMCE.get('article_content').getContent(),
					"article_content",
					parent_id, // parent_id
					"publish"
					,function(error, parent_id_2, event){
				});
				
				if(POST_ID == "new"){
					swal({
						title: "Article has been Published",
						text: "",
						type: "success",
						showCancelButton: false,
						cancelButtonText: "Cancel",
						confirmButtonText: "Close",
					});
				}else{
					swal({
						title: "Article has been  Updated",
						text: "",
						type: "success",
						showCancelButton: false,
						cancelButtonText: "Cancel",
						confirmButtonText: "Close",
						
					});
				}
				
				// All Done
				// Router.go("/group/"+Router.current().params.group_slug+"/article/"+ToSeoUrl(target.title.value));
				
			}
		);
		
		// update should have completed
		
	},
	
	// DELETE
	'click #article_delete'(event) {
		event.preventDefault();
		
		swal({
			title: "Delete this article?",
			text: "It will be moved to the Trash bin for 30 days before being permantently deleted",
			type: "warning",
			showCancelButton: true,
			cancelButtonText: "Cancel",
			confirmButtonColor: "#c0392b",
			confirmButtonText: "Delete Article",
		}).then(function (result) {			
			console.log("TRASH groups_project_category: "+Router.current().params.articleId);
			Meteor.call('posts.trash',
				Router.current().params.articleId,
			);
			Router.go('/group/'+Router.current().params.group_slug+"/articles",);
			
		});
		
	},
	
});


// skyrooms Helper
Template.group_article_manager.helpers({
	
	slug(title){
		return ToSeoUrl(title); 
	},
	group_slug(){
		return Router.current().params.group_slug; 
	},
	
	the_group_id(){
		var group = Posts.findOne({type:"groups"}); 
		if(group){
			return group._id;
		} else {
			return false;
		}
	},
	
	the_article_id(){
		var article = Posts.findOne({type:"article"}); 
		if(article){
			return article._id;
		} else {
			return false;
		}
	},
	
	the_article_title(){
		var article = Posts.findOne({type:"article"}); 
		if(article){
			return article.title;
		} else {
			return false;
		}
	},
	
	the_article_content(){
		var article = Posts.findOne({type:"article"}); 
		if(article){
			return article.content;
		} else {
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
		article_content = Posts.findOne({type:"article_content"}); 
		if(article_content){
			return article_content.content;
		}else{
			return false;
		}
	},
	
	
  
});

