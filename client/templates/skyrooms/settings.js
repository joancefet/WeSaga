Template.skyroom_settings.rendered = function() {
	
	
	
};


// Events
Template.skyroom_settings.events({
	
	'submit'(event) {
		
		event.preventDefault();
		const target = event.target;
		
		// Create or Update?
		if(target.skyroom_setting_id.value.length < 2){
			// Create
			var newSkyRoom = Meteor.call('skyrooms.insert_update', 
				"insert",
				'',
				target.skyroom_name.value, 
				target.skyroom_require_password.value, 
				target.skyroom_password.value, 
				target.skyroom_type.value,
				2,
				target.skyroom_listing.value,
				target.skyroom_must_belong_to_org.value,
				target.skyroom_must_be_colleague.value,
			);
			
			// Let's pop them a nice little message
			Router.go('/skyrooms/?result=success&skug');
		
		} else {
			
			// Update
			Meteor.call('skyrooms.insert_update',
				"update",
				target.skyroom_setting_id.value,
				target.skyroom_name.value, 
				target.skyroom_require_password.value, 
				target.skyroom_password.value, 
				target.skyroom_type.value,
				2,
				target.skyroom_listing.value,
				target.skyroom_must_belong_to_org.value,
				target.skyroom_must_be_colleague.value,
			);
			
			swal({
				title: "SkyRoom Updated!",
				text: "",
				type: "success",
				showCancelButton: true,
				cancelButtonText: "Close",
				confirmButtonColor: "#62cb31",
				confirmButtonText: "Join this SkyRoom",
				closeOnConfirm: true
			},
			function(){				
				// Build Slug
				console.log(this);
				Router.go('/join/'+target.skyroom_setting_slug.value,);
				
			});
			
		}
	},
	
	'click #skyroom_settings_delete'(event){
		
		event.preventDefault();
		
		const target = event.target;
		
		swal({
			title: "Delete SkyRoom & Contents?",
			text: "All references to this SkyRoom will be delted when you press confirm",
			type: "error",
			showCancelButton: true,
			cancelButtonText: "CANCEL",
			confirmButtonColor: "#c0392b",
			confirmButtonText: "Confirm Delete this SkyRoom",
			closeOnConfirm: true
		},
		function(){				
		
			Meteor.call('skyrooms.remove', $('input[name=skyroom_setting_id]').val() );
		
			Router.go('/skyrooms');
			
			swal({
				title: "Deleted",
				text: "",
				type: "success",
				showCancelButton: false,
				cancelButtonText: "",
				confirmButtonColor: "#c0392b",
				confirmButtonText: "Close",
				closeOnConfirm: true
			});
			
		});
		
	},
	
});