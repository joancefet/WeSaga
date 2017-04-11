
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
	waitOn: function(){
				
		var seo_title 		=  "Login to SkyRooms"; 
		var seo_description = "Virtual Offices for Business";
		var seo_image 		= "https://www.skyrooms.io/images/og_facebook.jpg";
		SEO.set({
			
			description: seo_description,
			title: seo_title,
			image: seo_image,
			separator: '-',

			meta: {
				keywords: ['skyrooms', 'virtual', 'office'], 
			},

			twitter: {
				card: seo_title+" - "+seo_description,
				creator: '@skyrooms'
				// etc.
			},

			og: {
				site_name: 'SkyRooms',
				title: seo_title,
				description: seo_description,
				image: seo_image,
				type:"article",
				url:"https://www.skyrooms.io",
				'fb:app_id':"726835877472962",
			}
			
		});
		
	},
	template:('screen'),
	yieldTemplates: {
		'login': {to: 'content'},
	}
});


Template.login.rendered = function() {
	
	Ladda.bind( '.ladda-button' );
	
}


Template.login.events({
	'submit #loginForm': function(event){
        event.preventDefault();
		
		//$(".login-container button").prop('disabled', true);
		
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
		
		// Logout of the 'guest account' first
		Meteor.logout();
		
        Meteor.loginWithPassword(email, password, function(error){
			if(error){
				
				event.preventDefault();
				//$(".login-container button").prop('disabled', false);
				swal({
					title: error.reason,
					text: "",
					type: "error"
				});
				Ladda.stopAll();
				
			} else {
				
				ga("send", "event", "user", "login");
				Router.go("/desk");
				
			}
		});
    }
});


