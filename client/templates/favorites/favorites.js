// Route
Router.route('/favorites',{
	fastRender: true,
	data:function(){
		
		if( Meteor.user() && Meteor.user().profile.guest ){
			Router.go('/');
		} else {
			Router.go('/favorites');
		}
	},
	template:'screen',
	yieldTemplates: {
		'favorites': {to: 'content'},
	}
	
});

// Render
Template.favorites.rendered = function() {

};


// Events
Template.favorites.events({
	
});