import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';


Template.groups_manager.rendered = function() {
	
	
	
};


// Events
Template.groups_manager.events({
	
	'submit'(event) {
		
		event.preventDefault();
		
		Meteor.call('posts.insert',
			Meteor.user().username,
			$(".form-control").val(),
			"group",
		);
		
		Router.go('/groups/');
		
	},
	
	'click #groups_manager_delete'(event){
		
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