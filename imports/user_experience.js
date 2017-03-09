import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const UserExperience = new Mongo.Collection('userExperience');

// Publish
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('userExperience', function userExperiencePublication() {
    return UserExperience.find({
    }, 
	{
      sort: { timestamp: -1 }
    });
  });
}

// Security Stuff
Meteor.methods({
  'userExperience.insert'(fromDate, fromStamp, toDate, org, title, description) {
 
    var id = UserExperience.insert({
		ownerId: this.userId,
		createdAt: new Date,
		fromDate: fromDate,
		fromStamp: fromStamp,
		toDate: toDate,
		org: org,
		title: title, 
		description: description,
    });
	
  },
  
  'userExperience.getOne' : function(entryId){
	  console.log(UserExperience.findOne(entryId));
	  return UserExperience.findOne(entryId);
  },
  
  'userExperience.update'(entryId, fromDate, fromStamp, toDate, org, title, description){
		UserExperience.update(entryId, {
			$set: {
				  "fromDate": fromDate,
				  "fromStamp": fromStamp,
				  "toDate": toDate,
				  "org": org,
				  "title": title,
				  "description": description,
			}
		});
  },
  
  'userExperience.remove'(entryId) {
    check(entryId, String);
	console.log("Remove" + entryId);
	const entry = UserExperience.findOne(entryId);
    if (entry.ownerId !== this.userId) {
      // Make sure only the owner can delete it.
      throw new Meteor.Error('not-authorized');
    } else {
		UserExperience.remove(entryId);
	}
	
  },
  
});