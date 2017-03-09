import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const SkyRooms = new Mongo.Collection('skyrooms');

// Publish
if (Meteor.isServer) {
	
	// Current SkyRoom data for a meeting
	Meteor.publish('skyrooms', function(owner_id, slug, skyroom_depth, roomId) {
		
		if(owner_id){
			return SkyRooms.find({"owner_id":owner_id});
		}
		if(slug){
			return SkyRooms.find({"slug":slug});
		}
		if(slug){
			return SkyRooms.find({"_id":roomId});
		}
		
	});
	
	
}

// Security Stuff
Meteor.methods({
	
  'skyrooms.insert_update'(action, skyroom_setting_id, skyroom_name, skyroom_require_password, skyroom_password, skyroom_type, skyroom_depth, skyroom_listing, skyroom_must_belong_to_org, skyroom_must_be_colleague) {

	
	if(action == "insert"){
		
		// Build Slug
		if (skyroom_depth == 1){
			var slug = Meteor.SkyroomTools.ToSeoUrl(skyroom_name);
		}
		if (skyroom_depth == 2){
			var username_slug = Meteor.SkyroomTools.ToSeoUrl( Meteor.users.findOne(this.userId).profile.username );
			var slug = username_slug +"/"+ Meteor.SkyroomTools.ToSeoUrl(skyroom_name);
		}
	 
		SkyRooms.insert({
			name: skyroom_name,
			slug: slug,
			createdAt: new Date(),
			owner_id: this.userId,
			owner_username: Meteor.users.findOne(this.userId).profile.username,
			skyroom_require_password: skyroom_require_password,
			password: skyroom_password,
			skyroom_listing: skyroom_listing,
			skyroom_type: skyroom_type,
			skyroom_depth: skyroom_depth,
			skyroom_must_be_colleague: skyroom_must_be_colleague,
			skyroom_must_belong_to_org: skyroom_must_belong_to_org,
			skyroom_must_be_colleague: skyroom_must_be_colleague,
		});
		
		return slug;
		
	} 
	
	if(action == "update"){
		
		SkyRooms.update(skyroom_setting_id, {
			$set: { skyroom_require_password: skyroom_require_password,
					password: skyroom_password,
					skyroom_type: skyroom_type,
					skyroom_listing: skyroom_listing,
					skyroom_must_be_colleague: skyroom_must_be_colleague,
					skyroom_must_belong_to_org: skyroom_must_belong_to_org,
					skyroom_must_be_colleague: skyroom_must_be_colleague,
			},
		});
		
	}
	
  },
  
  'skyrooms.remove'(id) {
	  
    check(id, String);
	
	const skyroom = SkyRooms.findOne(id);
    if (skyroom.private && skyroom.owner !== this.userId) {
      // If the skyroom is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    } else {
		SkyRooms.remove(id);
	}
	
  },
  
  'skyrooms_find_related'(username){
	  const skyroom = SkyRooms.find({});
	  return skyroom;
  },
  
  'skyrooms.setChecked'(id, setChecked) {
    check(id, String);
    check(setChecked, Boolean);
 
    SkyRooms.update(id, { $set: { checked: setChecked } });
  },
  
	'skyrooms.setPrivate'(id, setToPrivate) {
		check(id, String);
		check(setToPrivate, Boolean);
	 
		const skyroom = SkyRooms.findOne(id);
		
		if (skyroom.private && skyroom.owner !== this.userId) {
		  // If the skyroom is private, make sure only the owner can check it off
		  throw new Meteor.Error('not-authorized');
		}
	 
		SkyRooms.update(id, { $set: { private: setToPrivate } });
	  },
	  
	'skyrooms.howMany'(owner_id){
		console.log(SkyRooms.find({"owner_id":owner_id}).count());
		return SkyRooms.find({"owner_id":owner_id}).count();
	},
});