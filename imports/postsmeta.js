import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Postsmeta = new Mongo.Collection('postsmeta');

// Publish
if (Meteor.isServer) {
	
	Meteor.publish('postsmeta', function(action, parent_id) {
		
		check(action, String);
		// if(parent_id){ check(parent_id, String); }
		
		if(action == "all"){
			return Postsmeta.find({},{ sort: { createdAt: -1 }, limit:10 });
		}
		
		if(action == "desk_comments"){
			return Postsmeta.find({type:"post_comment", parent_id:parent_id},{ sort: { createdAt: -1 }, limit:10 });
		}
		
		if(action == "post_attachment"){
			return Postsmeta.find({type:"post_attachment", parent_id:parent_id},{ sort: { createdAt: -1 }, limit:10 });
		}		
		
		if(action == "notify_meta"){
			return Postsmeta.find({parent_id:parent_id},{ sort: { createdAt: -1 }, limit:10 }); //, 
		}
		
		if(action == "meeting_meta"){
			return Postsmeta.find({type:action, parent_id:parent_id},{ sort: { createdAt: -1 }, limit:10 }); //
		}
			
		
	});
	
}


