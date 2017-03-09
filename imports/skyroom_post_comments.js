import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const SkyroomPostComments = new Mongo.Collection('skyroomPostComments');

// Publish
if (Meteor.isServer) {
 
	Meteor.publish('skyroomPostComments', function skyroomPostCommentsPublication() {
		return SkyroomPostComments.find({},{ sort: { timestamp: -1 }, limit:10 });
	});
}

// Security Stuff
Meteor.methods({
  'skyroomPostComments.insert'(content, username, parentId) {
	console.log(content);
    check(content, String);
 
    var id = SkyroomPostComments.insert({
		parentId: this.userId,
		postParentId: parentId,
		createdAt: new Date,
		timeAgo: new Date().toISOString(),
		timestamp: Date.now(),
		username: username,
		content: content,
	  
    });
	
	console.log(id + " created");
	
  },
  
  'skyroomPostComments.remove'(taskId) {
    check(taskId, String);
	
	const task = skyroomPostComments.findOne(taskId);
    if (task.private && task.owner !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
	
  },
  
});