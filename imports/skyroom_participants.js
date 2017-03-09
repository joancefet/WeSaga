import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const SkyroomParticipants = new Mongo.Collection('skyroomParticipants');

// Publish
if (Meteor.isServer) {
	
	// This code only runs on the server
	Meteor.publish('skyroomParticipants', function(slug) {
		
		if(slug){
			return SkyroomParticipants.find({"slug":slug});
		}
		
	});
  
	Meteor.methods({		
		
		// Remove all participants
		removeAllSkyroomParicipants: function() {
			return SkyroomParticipants.remove({});
		},
		
		// Remove Participant
		SkyroomParticipantLogoutByServer: function(userId) { // comes from the 'fields' paramter on servers main.js
			
			return SkyroomParticipants.remove({"owner": userId});

		},

    });
}

// INSERT SECURITY
Meteor.methods({
	
	'skyroomParticipants.join'( room_slug ) {
		
		SkyroomParticipants.remove({"owner": this.userId});
		
		var guest = 1;
		if( Meteor.user().profile.guest ) { guest = 0; }
		
		var id = SkyroomParticipants.insert({
			owner: this.userId,
			createdAt: new Date,
			timeAgo: new Date().toISOString(),
			timestamp: Date.now(),
			
			username: Meteor.user().username,
			guest: guest,
			slug:room_slug,
		  
		});
	
	},
	'skyroomParticipants.leave'() {

		console.log("Removing Participant");
		return SkyroomParticipants.remove({"owner": this.userId});

	},

  
});