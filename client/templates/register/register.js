
Template.register.rendered = function() {
	

  
};

Template.register.events({
    'submit form': function(event){
		
        event.preventDefault();
		
		// REGISTRATION VALIDATION
		
		// Does the username have spaces?
		// if( $('[name=username]').val().indexOf(' ') >= 0 ){
			
			// swal({
				// title: "User cannot have spaces",
				// text: "Examples: MyUserName or JamesBond",
				// type: "error"
			// });
				
			// return;
		// }
		
		// // Username too long
		// if( $('[name=username]').val().length >= 20 ){
			
			// swal({
				// title: "User name too long",
				// text: "Please shorten your user name, must be less than 20 characters",
				// type: "error"
			// });
				
			// return;
		// }
		
		// // Username too short
		// if( $('[name=username]').val().length <= 2 ){
			
			// swal({
				// title: "User name is Too Short",
				// text: "Please choose a longer user name, 2 characters or more",
				// type: "error"
			// });
				
			// return;
		// }
		
		
		// First Name
		if( $('[name=name_first]').val().length < 2 ){
			
			swal({
				title: "First Name?",
				text: "Your first name is really short...",
				type: "error"
			});
				
			return;
		}
		
		// Last Name
		if( $('[name=name_last]').val().length < 2 ){
			
			swal({
				title: "Last Name?",
				text: "Your last name is really short...",
				type: "error"
			});
				
			return;
		}
		
		// Email
		if( $('[name=email]').val().length < 2 ){
			
			swal({
				title: "Email Invalid",
				text: "Please check your email address",
				type: "error"
			});
				
			return;
		}
		
		
		// Password too short
		if( $('[name=password]').val() != $('[name=password_repeat]').val() ){
			
			swal({
				title: "Your password didn't match",
				text: "Please re-type your password, it didn't match",
				type: "error"
			});
				
			return;
		}
		
		// Password too long
		if( $('[name=password]').val().length >= 30 ){
			
			swal({
				title: "Password too long",
				text: "Please shorten your password, must be less than 30 characters",
				type: "error"
			});
				
			return;
		}
		
		// Password too short
		if( $('[name=password]').val().length <= 6 ){
			
			swal({
				title: "Password is Too Short",
				text: "Please choose a longer user name, 6 characters or more",
				type: "error"
			});
				
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
				
			} else {
				
				Router.go("/desk"); // Redirect user if registration succeeds
			}
		});
		
    }
});

