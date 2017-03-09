// Route
Router.route('/colleagues',{
	fastRender: true,
	data:function(){
		
		if( Meteor.user() && Meteor.user().profile.guest ){
			Router.go('/');
		} else {
			Router.go('/colleagues');
		}
	},
	waitOn: function(){
		Meteor.subscribe('posts', 'people_colleagues'); 
	},
	template:'screen',
	yieldTemplates: {
		'colleagues': {to: 'content'},
	}
	
});

// Render
Template.colleagues.rendered = function() {

};


// Events
Template.colleagues.events({
	
	colleagues() {
		return Meteor.users.find({});
	},
	
});