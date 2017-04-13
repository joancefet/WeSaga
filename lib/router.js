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
	},
	
});

// ====================================	
// ROUTES
// ====================================	
if (Meteor.isClient) { 
	

}

