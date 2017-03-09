// Route
Router.route('/organizations',{
	fastRender: true,
	data:function(){
		
		if( Meteor.user() && Meteor.user().profile.guest ){
			Router.go('/');
		} else {
			Router.go('/organizations');
		}
	},
	template:'screen',
	yieldTemplates: {
		'organizations': {to: 'content'},
	}
	
});

// Render
Template.organizations.rendered = function() {

};


// Events
Template.organizations.events({
	
});