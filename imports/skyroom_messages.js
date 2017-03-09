import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const SkyroomMessages = new Mongo.Collection('skyroomMessages');

// Publish
if (Meteor.isServer) {
  
  Meteor.publish('skyroomMessages', function(slug) {
    return SkyroomMessages.find({"slug":slug },	{ sort: { timestamp: -1 }, limit: 7});
  });
  
}

// Methods
Meteor.methods({
  'skyroomMessages.insert'(content, username, slug) {
	
    check(content, String);
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
		throw new Meteor.Error('not-authorized');
    }
 
    var id = SkyroomMessages.insert({
		owner: this.userId,
		createdAt: new Date,
		timeAgo: new Date().toISOString(),
		timestamp: Date.now(),
		username: username,
		
		slug: slug,
		username: username,
		content: content,
	  
    });
	
	console.log(id + " created");
	
  },
  'skyroomMessages.remove'(taskId) {
    check(taskId, String);
	
	const task = SkyroomMessages.findOne(taskId);
    if (task.private && task.owner !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
	
  },
  
});