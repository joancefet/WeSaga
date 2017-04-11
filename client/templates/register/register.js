
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
	waitOn: function(){
				
		var seo_title 		=  "Register for FREE"; 
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
	template:'screen',
	yieldTemplates: {
		'register': {to: 'content'},
	}
	
});


Template.register.rendered = function() {
	
	Ladda.bind( '.ladda-button' );
  
};

Template.register.events({
	
	'click .ladda-button': function(event){
		setTimeout(function(){
			Ladda.stopAll();
		},1000);
	},
	
    'submit form': function(event){
		
        event.preventDefault();
		
		// REGISTRATION VALIDATION
	
		
		// First Name
		if( $('[name=name_first]').val().length < 2 ){
			
			swal({
				title: "First Name?",
				text: "Your first name is really short...",
				type: "error"
			});
			Ladda.stopAll();
			return;
		}
		
		// Last Name
		if( $('[name=name_last]').val().length < 2 ){
			
			swal({
				title: "Last Name?",
				text: "Your last name is really short...",
				type: "error"
			});
			Ladda.stopAll();
			return;
		}
		
		// Email
		if( $('[name=email]').val().length < 2 ){
			
			swal({
				title: "Email Invalid",
				text: "Please check your email address",
				type: "error"
			});
			Ladda.stopAll();	
			return;
		}
		
		
		// Password too short
		if( $('[name=password]').val() != $('[name=password_repeat]').val() ){
			
			swal({
				title: "Your password didn't match",
				text: "Please re-type your password, it didn't match",
				type: "error"
			});
			Ladda.stopAll();	
			return;
		}
		
		// Password too long
		if( $('[name=password]').val().length >= 30 ){
			
			swal({
				title: "Password too long",
				text: "Please shorten your password, must be less than 30 characters",
				type: "error"
			});
			Ladda.stopAll();	
			return;
		}
		
		// Password too short
		if( $('[name=password]').val().length <= 6 ){
			
			swal({
				title: "Password is Too Short",
				text: "Please choose a longer user name, 6 characters or more",
				type: "error"
			});
			Ladda.stopAll();	
			return;
		}
		
		// Search for existing users
		var user_found = Meteor.users.findOne({"profile.email":$('[name=email]').val()});
		
		if(user_found){
			
			swal({
				title: "This email address is already registered",
				text: "Please try another, or click Forgot Password",
				type: "error"
			});
			Ladda.stopAll();
			return;
		}
		
		// Call this now, because we've been a guest user
		Meteor.logout();
		
		var random_id = Math.floor(Math.random() * 3000) + 1;
		
		Accounts.createUser({
			email: $('[name=email]').val(),
			password: $('[name=password]').val(),
			profile: {
				name_first:  $('[name=name_first]').val(),
				name_last:  $('[name=name_last]').val(),
				username:  ($('[name=name_first]').val()+$('[name=name_last]').val()+random_id).toLowerCase(),
				notes: "Welcome to your SkyRooms Notepad."
			},
			username:  $('[name=name_first]').val()+$('[name=name_last]').val()+random_id, // Must be doubled here, sadly, for the Guest Account logic. Cleanup one day...
		}, function(error){
			if(error){
				
				swal({
					title: error.reason,
					text: "",
					type: "error"
				});
				Ladda.stopAll();
			} else {
				Ladda.stopAll();
				Router.go("/desk"); // Redirect user if registration succeeds
			}
		});
		
    }
});

