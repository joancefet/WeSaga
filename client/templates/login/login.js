

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
			} else {
				
				ga("send", "event", "user", "login");
				Router.go("/desk");
				
			}
		});
    }
});


Template.login.rendered = function() {
	

}
