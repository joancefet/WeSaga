import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const SkyroomPosts = new Mongo.Collection('skyroomPosts');

// Publish
if (Meteor.isServer) {
	
	Meteor.publish('skyroomPosts', function( userId ) {
		return SkyroomPosts.find({"owner":userId},{ sort: { timestamp: -1 }, limit:10 });
	});
	
}

// Security Stuff
Meteor.methods({
  'skyroomPosts.insert'(content, username) {
	console.log(content);
    check(content, String);
 
    var id = SkyroomPosts.insert({
		owner: this.userId,
		createdAt: new Date,
		timeAgo: new Date().toISOString(),
		timestamp: Date.now(),
		username: username,
		content: content,
	  
    });
	
	console.log(id + " created");
	
  },
  
  'skyroomPosts.remove'(taskId) {
    check(taskId, String);
	
	const task = skyroomPosts.findOne(taskId);
    if (task.private && task.owner !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
	
  },
  
});