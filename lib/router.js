

// ====================================	
// SET LAYOUTS
// ====================================	
Router.configure({
    layoutTemplate: 'screen',
	notFoundTemplate: "not_found", // NOT WORKING, it's still pulling screen
	//progressDelay: 100, // disable bar for fast routes
	trackPageView: true,
	

	// SET FOR FAST ROUTE
	waitOn: function() {
	return [
			
		]
	},
	
});

// ====================================	
// ROUTES
// ====================================	
if (Meteor.isClient) { 

	Router.route('/', {
		data:function(){
			
			if( Meteor.user() ){
				Router.go('/buzz');
			} 
			
		},
		waitOn: function(){
			
		},
		template: 'landing',
		yieldTemplates: {
			'landing': {to: 'content'},
		},
		onAfterAction: function() {
			
			SEO.set({
			  title: "SkyRooms Virtual Offices for Business",
			  meta: {
				'description': "Professional Business Tools for your Organziation presented in a familiar way that are free for all users.",
				'keywords': "skyrooms, free, business, tools, webinar, video, conference, conferencing, resume, builder",
			  },
			  og: {
				'title': "SkyRooms Virtual Offices for Business",
				'description': "Professional Business Tools for your Organziation presented in a familiar way that are free for all users.",
				'image':"https://www.skyrooms.io/images/og_facebook.jpg",
				'url':'https://www.skyrooms.io',
				'type':'article',
				'fb:app_id':"726835877472962"
			  }
			});
		
		}
		
	});

}

// LOGIN
// ------------------
Router.route('/login',{
	
	data:function(){
		if( !Meteor.user() ){
			// This guest would like to login :)
		} else {
			Router.go('/buzz');
		}	
	},
	template:('screen'),
	yieldTemplates: {
		'login': {to: 'content'},
	}
});



// REGISTER
// ------------------
Router.route('/register',{	
	
	data:function(){
			
		if( Meteor.user() && Meteor.user().profile.guest ){
			// Guest landed
		} else {
			//Router.go('/account');
		}

	},
	template:'screen',
	yieldTemplates: {
		'register': {to: 'content'},
	}
	
});

