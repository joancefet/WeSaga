import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
	
	import '../imports/posts.js';
	import '../imports/postsmeta.js';
	
	import '../imports/skyroom_tools_server.js';
	
	
		// Accounts.config({
		// // enable client user creation
		// forbidClientAccountCreation: false,
	// }),
	
	// ================
	// FILES
	// ================
	Cloudinary.config({
		cloud_name: 'skyroomsio',
		api_key: '855778861979654',
		api_secret: 'q1MVzehJji9mZ5iMjEoJiRcTt9g'
	});

	// // Fix CloudFront certificate issue
	// // Read: https://github.com/chilts/awssum/issues/164
	// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
	
	// knox    = Npm.require('knox');
	// Request = Npm.require('request');
	// bound = Meteor.bindEnvironment(function(callback) {
		// return callback();
	// });
	
	// cfdomain = 'https://dlnde5a0p49uc.cloudfront.net'; //https://skyroomsfiles.cloudfront.net
	
	// client = knox.createClient({
		// key: 'AKIAJT3FHPGMW5POLROA',
		// secret: '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',
		// bucket: 'skyroomsfiles',
		// region: 'us-west-1' // Only needed if not "us-east-1" or "us-standard"
	// });

	
	// // uploadFiles
	// // -------
	// // Images Subscribe
	// Meteor.publish('files.uploadFiles.all', function () {
		// return uploadFiles.find().cursor;
	// });
	// // MOVE THIS TO A SMARTER PUBLISH. Cant publish ALL images dude!
	
	// var uploadFiles = new FilesCollection({
		// debug:false,
		// public:true,
		// throttle: false,
		// downloadRoute:"/files",
		// storagePath:Meteor.settings.public.file_storage_path, // PRODUCTION: ../data //LOCALHOST: ../../../../../../skyrooms2_data 
		// collectionName: 'uploadFiles',
		// allowClientCode: false, // Disallow remove files from Client
		// onBeforeUpload: function (file) {
			// // Allow upload files under 10MB, and only in png/jpg/jpeg formats
			// console.log(file);
			// if (file.size <= 1024*1024*2 && /png|jpg|jpeg/i.test(file.extension)) {
				// return true;
			// } else {
				// return 'Please upload image, with size equal or less than 2MB';
			// }
			
			// // BEGIN OPTIMIZATION
			
			
			
		// },
		// onAfterUpload: function(fileRef) {
			// // In onAfterUpload callback we will move file to AWS:S3
			// var self = this;
			// _.each(fileRef.versions, function(vRef, version) {
			  // // We use Random.id() instead of real file's _id 
			  // // to secure files from reverse engineering
			  // // As after viewing this code it will be easy
			  // // to get access to unlisted and protected files
			  // // console.log("PUSH FILE TO AMAZON");
			  // // console.log(fileRef._id);
			  // var filePath = "files/" + (fileRef._id) + "." + fileRef.extension;
			  // client.putFile(vRef.path, filePath, function(error, res) {
				// bound(function() {
				  // var upd;
				  // if (error) {
					// console.error(error);
				  // } else {
					// upd = {
					  // $set: {}
					// };
					// upd['$set']["versions." + version + ".meta.pipeFrom"] = cfdomain + '/' + filePath;
					// upd['$set']["versions." + version + ".meta.pipePath"] = filePath;
					// self.collection.update({
					  // _id: fileRef._id
					// }, upd, function(error) {
					  // if (error) {
						// console.error(error);
					  // } else {
						// // Unlink original files from FS
						// // after successful upload to AWS:S3
						// self.unlink(self.collection.findOne(fileRef._id), version);
					  // }
					// });
				  // }
				// });
			  // });
			// });
		// },
		// interceptDownload: function(http, fileRef, version) {
			// var path, ref, ref1, ref2;
			// path = (ref = fileRef.versions) != null ? (ref1 = ref[version]) != null ? (ref2 = ref1.meta) != null ? ref2.pipeFrom : void 0 : void 0 : void 0;
			// if (path) {
			  // // If file is moved to S3
			  // // We will pipe request to S3
			  // // So, original link will stay always secure
			  // Request({
				// url: path,
				// headers: _.pick(http.request.headers, 'range', 'accept-language', 'accept', 'cache-control', 'pragma', 'connection', 'upgrade-insecure-requests', 'user-agent')
			  // }).pipe(http.response);
			  // return true;
			// } else {
			  // // While file is not yet uploaded to S3
			  // // We will serve file from FS
			  // return false;
			// }
		// }
		
	// });
	
	// ================
	// GUEST ACCOUNTS
	// ================
	
	// Settings
	// AccountsGuest.enabled = false // . Automatically logs in all visitors.
	// AccountsGuest.forced= true //. Will force recently logged out accounts into guest mode.
	// AccountsGuest.name = false //, assign the guest a friendly nickname. WEIRD NAMES, maybe customize this later on. Guest is fine for now..
	// AccountsGuest.anonymous = false // Dont generate a fake email address / password. This is an anon account
	
	// // Clean up anonymous accounts
	// var before = new Date();
	// before.setHours(before.getHours() - 1); // Remove one hour old accounts
	// Accounts.removeOldGuests(before);

	
	// Meteor.publish("userList", function () {
           // return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
    // });
	
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
