import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Postsmeta = new Mongo.Collection('postsmeta');

// Publish
if (Meteor.isServer) {
	
	Meteor.publish('postsmeta', function(action, parent_id) {
		
		// All data has been migrated.
		
		return;
		
	});
	
}


