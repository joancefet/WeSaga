// ------------------
// skyrooms
// ------------------

Template.skyrooms.rendered = function() {

};


// skyrooms Helper
Template.skyrooms.helpers({
	
  skyrooms() {
    return SkyRooms.find({ "owner_id":Meteor.userId(), "skyroom_depth":2 });
  },
  
});





// Events
Template.skyrooms.events({
	
	'click .skyrooms_logout': function(event){
		event.preventDefault();
		Meteor.logout();
		Router.go('/');
	},
	
	'click .openSettingsModal':function(event){
		$('#roomSettingsModal').modal('show');
	},

});
