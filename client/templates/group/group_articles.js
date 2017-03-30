import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// ROUTER
//=========
Router.route('/group/:group_slug/articles',{
	data:function(){
		
	},
	waitOn: function(){
		
	},
	template:'screen',
	yieldTemplates: {
		'group_articles': {to: 'content'},
	}
	
});

Template.group_articles.rendered = function() {

};


// skyrooms Helper
Template.group_articles.helpers({
	
	group_slug(){
		return Router.current().params.group_slug; 
	}
  
});





// Events
Template.group_articles.events({
	

});
