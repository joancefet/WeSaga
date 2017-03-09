import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
	
	import '../imports/posts.js';
	import '../imports/postsmeta.js';
	
	import '../imports/skyroom_tools_server.js';
	import '../imports/user_experience.js';
	
	// ================
	// FILES
	// ================
	
	// profileImages
	// -------
	// Images Subscribe
	Meteor.publish('files.profileImages.all', function () {
		return profileImages.find().cursor;
	});
	// MOVE THIS TO A SMARTER PUBLISH. Cant publish ALL images dude!
	
	var profileImages = new FilesCollection({
		debug:false,
		public:true,
		downloadRoute:"/profileImages",
		storagePath:Meteor.settings.public.file_storage_path, // PRODUCTION: ../data //LOCALHOST: ../../../../../../skyrooms2_data 
		collectionName: 'profileImages',
		allowClientCode: false, // Disallow remove files from Client
		onBeforeUpload: function (file) {
			// Allow upload files under 10MB, and only in png/jpg/jpeg formats
			console.log(file);
			if (file.size <= 1024*1024*2 && /png|jpg|jpeg/i.test(file.extension)) {
				return true;
			} else {
				return 'Please upload image, with size equal or less than 2MB';
			}
		}
	});
	
	// ================
	// GUEST ACCOUNTS
	// ================
	
	// Settings
	AccountsGuest.enabled = false // . Automatically logs in all visitors.
	AccountsGuest.forced= true //. Will force recently logged out accounts into guest mode.
	AccountsGuest.name = false //, assign the guest a friendly nickname. WEIRD NAMES, maybe customize this later on. Guest is fine for now..
	AccountsGuest.anonymous = false // Dont generate a fake email address / password. This is an anon account
	
	// Clean up anonymous accounts
	var before = new Date();
	before.setHours(before.getHours() - 1); // Remove one hour old accounts
	Accounts.removeOldGuests(before);

	
	Meteor.publish("userList", function () {
           return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
    });
	
	// ================
	// PARTICIPANTS
	// ================
	
	// Reset the entire database when we come online
	// Meteor.call('removeAllSkyroomParicipants');
	
	// User Logouts
	// UserStatus.events.on("connectionLogout", function(fields) { 
		
		// console.log("USER HAS DISCONNECTED: "+fields.userId);
		// Meteor.call('SkyroomParticipantLogoutByServer', fields.userId);
		// console.log(fields.userId);
		
	// });
	
	// Goes Offline
	// Meteor.users.find({ "status.online": true }).observe({
	  // added: function(user) {
		// console.log(user._id +" ONLINE");
	  // },
	  // removed: function(user) {
		// console.log(user._id +" OFFLINE - remove from rooms");
		// Meteor.call('SkyroomParticipantLogoutByServer', user._id);
	  // }
	// });
	
	// ================
	// GLOBAL CHAT
	// ================
	
	
	
});
