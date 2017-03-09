

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
// OPEN GRAPH
// ====================================	
// Docs: https://github.com/lookback/meteor-seo

	// Add OG Plugin
	// --------------
	if (Meteor.isClient) { // must wrap or it bugs out
		Router.plugin('seo', {
			//only: ['someRoute'],
			//except: ['someOtherRoute'],

			defaults: {
				suffix: 'SkyRooms.IO',
				title: 'Free Video Social Conferencing',                 // Will apply to <title>, Twitter and OpenGraph.
				separator: '·',

				description: 'SkyRooms is FREE Video & Social Conferencing system. Click this link to join a meeting and see for yourself',        // Will apply to meta, Twitter and OpenGraph.
				image: 'https://www.skyrooms.io/images/og_facebook.jpg',   // Will apply to Twitter and OpenGraph.

				meta: {
					keywords: ['skyrooms', 'free', 'video', 'conferencing', 'social']
				},

				twitter: {
					card: 'SkyRooms is FREE Video & Social Conferencing system. Click this link to join a meeting and see for yourself',
					creator: '@skyrooms'
					// etc.
				},

				og: {
					title: 'SkyRooms.IO',
					type: 'article',
					site_name: 'SkyRooms.IO',
					image: 'https://www.skyrooms.io/images/og_facebook.jpg',
					url: 'https://www.skyrooms.io',
					description: 'SkyRooms is FREE Video & Social Conferencing system. Click this link to join a meeting and see for yourself',
					// etc.
				}
			},
		});
	}

// ====================================	
// ROUTES
// ====================================	
if (Meteor.isClient) { 

	Router.route('/', {
		data:function(){
			
			if( Meteor.user() ){
				Router.go('/desk');
			} 
			
		},
		waitOn: function(){
			
		},
		template: 'landing',
		yieldTemplates: {
			'landing': {to: 'content'},
		},
		
	});

}

// LOGIN
// ------------------
Router.route('/login',{
	
	data:function(){
		if( !Meteor.user() ){
			// This guest would like to login :)
		} else {
			Router.go('/desk');
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


// ------------------
// GROUPS 
// ------------------
Router.route('/groups',{
	fastRender: true,
	data:function(){
		
		// if( Meteor.user() && Meteor.user().profile.guest ){
			// Router.go('/');
		// } else {
			// Router.go('/chats');
		// }
	},
	template:'screen',
	yieldTemplates: {
		'groups': {to: 'content'},
	}
	
});

// CREATE SKYROOMS
// ------------------
Router.route('/groups/manage',{
	
	data:function(){
		
		if( Meteor.user() && Meteor.user().profile.guest ){
			Router.go('/login');
		}
		
	},
	template:'screen',
	yieldTemplates: {
		'groups_manager': {to: 'content'},
	}
	
});
