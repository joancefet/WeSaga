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
		
		// GROUPS
		// =======
		if(action == "group_meta"){
			return Postsmeta.find({type:action, parent_id:parent_id},{ sort: { createdAt: -1 }, limit:10 }); //
		}
		
		// RESUME
		// ======
		if(action == "resume_education_date1"){
			return Postsmeta.find({type:action, owner_username:parent_id},{ sort: { createdAt: 1 }, limit:10 }); //
		}		
		if(action == "resume_education_date2"){
			return Postsmeta.find({type:action, owner_username:parent_id},{ sort: { createdAt: 1 }, limit:10 }); //
		}		
		if(action == "resume_education_type"){
			return Postsmeta.find({type:action, owner_username:parent_id},{ sort: { createdAt: 1 }, limit:10 }); //
		}
		
		if(action == "resume_experience_group"){
			return Postsmeta.find({type:action, owner_username:parent_id},{ sort: { createdAt: 1 }, limit:10 }); //
		}
		if(action == "resume_experience_date1"){
			return Postsmeta.find({type:action, owner_username:parent_id},{ sort: { createdAt: 1 }, limit:10 }); //
		}		
		if(action == "resume_experience_date2"){
			return Postsmeta.find({type:action, owner_username:parent_id},{ sort: { createdAt: 1 }, limit:10 }); //
		}		
		
	});
	
}



// Security Stuff
Meteor.methods({
  
	// INSERT AND UPDATE
	'postsmeta.update'(update_id, author, title, content, type, parent_id, status, update_by_parent){
		
		if(author == "me") { author = Meteor.userId(); }
		if(parent_id === null){ parent_id = "not_set"; }
		if(status === null){ status = "published"; }
		
		var exists = Postsmeta.find({_id:update_id});
		
		if( update_id != "new") {
		
			// UPDATE EXISTING POST			
			
			if(update_by_parent != "method_2"){
				
				// Update by Parent
				Postsmeta.update({parent_id:parent_id, title:title},
					{$set: {
						updatedAt: Date.now(), 
						title:title,
						content:content,
						status:status,
						}
					}
				);
				console.log("-------++ UPDATE BY POSTMETA PARENT: "+update_id);
				console.log(title);
			} else if(update_by_parent == "method_2"){
				
				// Update by Parent
				Postsmeta.update({parent_id:parent_id, type:type},
					{$set: {
						updatedAt: Date.now(), 
						title:title,
						content:content,
						type:type,
						status:status,
						}
					}
				);
				
				console.log("-------++ METHOD 2: "+update_id);
				console.log(title);
				console.log(update_by_parent);
				
			} else {
				
				// Update by _id
				Postsmeta.update(update_id,
					{$set: {
						updatedAt: Date.now(), 
						title:title,
						content:content,
						status:status,
						}
					}
				);
				console.log("-------++ UPDATE POSTMETA: "+update_id);
			}
			
			
			
		} else {
			
			// NEW POST
			var new_id = Postsmeta.insert({
				owner_id: author,
				owner_username: Meteor.user().profile.username,
				owner_fullname: Meteor.user().profile.name_first +" "+Meteor.user().profile.name_last,
				owner_avatar: ""+Meteor.user().profile.avatar, 
				createdAt: Date.now(),
				updatedAt: Date.now(),
				timeAgo: new Date().toISOString(),
				menu_order: 0,
				
				title: title,
				content: content,
				type: type,
				parent_id: parent_id,
				status:status,
			});
			// assert(Posts.find().count() === 1); // // Changes are visible immediately -- no waiting for a round trip to the server.
			console.log("-------++ NEW POSTMETA: "+new_id);
			
		}
	  
	},
  
  
    // REMOVE (todo)
    'postsmeta.remove'(postId) {
		check(postId, String);
		console.log("REMOVE POST: "+postId);
		Postsmeta.remove({_id:postId});
	},
  
});




// SEO URL
function ToSeoUrl(url) { 
	var encodedUrl = url.toString().toLowerCase(); 
	
	// Trim to 20 characters
	encodedUrl = encodedUrl.substring(0, 40);

	// replace & with and           
	encodedUrl = encodedUrl.split(/\&+/).join("-and-")

	// remove invalid characters 
	encodedUrl = encodedUrl.split(/[^a-z0-9]/).join("-");       

	// remove duplicates 
	encodedUrl = encodedUrl.split(/-+/).join("-");

	// trim leading & trailing characters 
	encodedUrl = encodedUrl.trim('-'); 
	
	return encodedUrl; 
}

// GUID
function guid() {
  function s4() {
	return Math.floor((1 + Math.random()) * 0x10000)
	  .toString(16)
	  .substring(1);
  }
  return s4() + s4();
}
