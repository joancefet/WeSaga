

Router.route('/desk/edit',{
	data:function(){
		
		if( Meteor.user() && Meteor.user().profile.guest ){
			Router.go('/');
		} else {
			Router.go('/desk/edit');
		}
	},
	template:'screen',
	yieldTemplates: {
		'deskedit': {to: 'content'},
	}
	
});

var MAP_ZOOM = 15;

// ------------------
// ACCOUNT
// ------------------
Template.deskedit.rendered = function() {
	
	//Init datepickers. Month and year only.
	$( "#fromDate, #toDate" ).datepicker({ 
	   changeMonth: true,
	   changeYear: true,
	   showButtonPanel: true,
	   dateFormat: 'M yy',            
	   onClose: function(dateText, inst) { 
		   var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
		   var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();             
		   $(this).datepicker('setDate', new Date(year, month, 1));
	   },
	   beforeShow : function(input, inst) {
		   if ((datestr = $(this).val()).length > 0) {
			   year = datestr.substring(datestr.length-4, datestr.length);
			   month = jQuery.inArray(datestr.substring(0, datestr.length-5), $(this).datepicker('option', 'monthNames'));
			   $(this).datepicker('option', 'defaultDate', new Date(year, month, 1));
			   $(this).datepicker('setDate', new Date(year, month, 1));    
		   }
		   var other = this.id == "fromDate" ? "#toDate" : "#fromDate";
		   var option = this.id == "fromDate" ? "maxDate" : "minDate";        
		   if ((selectedDate = $(other).val()).length > 0) {
			   year = selectedDate.substring(selectedDate.length-4, selectedDate.length);
			   month = jQuery.inArray(selectedDate.substring(0, selectedDate.length-5), $(this).datepicker('option', 'monthNames'));
			   $(this).datepicker( "option", option, new Date(year, month, 1));
		   }
	   }
	});
	
	//Change datepicker icons.
	$('.ui-icon-circle-triangle-w').toggleClass('pe-7s-angle-left ui-icon-circle-triangle-w');
	
	//Set "About" section to a TinyMCE editor.
	tinymce.init({
	  selector: 'textarea',
	  skin_url: '/packages/teamon_tinymce/skins/lightgray',
	  menubar: false,
	  toolbar: 'insert | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist',
	});
	
	//Load Google Map
	GoogleMaps.load({key: 'AIzaSyATUzfjVr1TtxqBIvDJa2AKnNYdgu_XXKE'});
	
	//Waiting for user to become available. Setting TinyMCE content.
	//==============================================================
	Meteor.subscribe("userList", function() {
		tinyMCE.get('aboutUser').setContent(Meteor.user().profile.aboutUser);
		Meteor.call('skyrooms.howMany', Meteor.userId(), function(e,r){
			console.log("Rooms: " + r);
			$('#skyroomsCount').html(r);
		});
	});

};



// Initialize file uploader
// ========================
Template.deskedit.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
  
  //Place Marker on User Location.
  GoogleMaps.ready('editMap', function(map) {
    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
  });
});

// profileImages
// =============
var profileImages = new FilesCollection({
	collectionName: 'profileImages',
	allowClientCode: false, // Disallow remove files from Client
	onBeforeUpload: function (file) {
		// Allow upload files under 10MB, and only in png/jpg/jpeg formats
		if (file.size <= 1024*1024*2 && /png|jpg|jpeg/i.test(file.extension)) {
			return true;
		} else {
			return 'Please upload image, with size equal or less than 2MB';
		}
	}
});


//Desk Edit Helpers
// ==============
Template.deskedit.helpers({
	// Google Map helper.
	mapOptions: function() {
		console.log("mapOptions called.");
		if (GoogleMaps.loaded()) {
		  return {
			center: new google.maps.LatLng(Meteor.user().profile.locLat, Meteor.user().profile.locLng),
			zoom: 8,
			disableDefaultUI: true, 
			draggable: false,
			scrollwheel: false,
			disableDoubleClickZoom: true,
		  };
		  console.log("There was NOT an error!");
		} else {
			console.log("There was an error!");
		}
	},
	  
	expByUser(){
		console.log("expByUser");
		return UserExperience.find({"ownerId":Meteor.userId()}, {sort: { fromStamp: -1 }});
	},
});



// Events
// ======
Template.deskedit.events({
	
	'change #fileInput': function (event, template) {
		  
		if (event.currentTarget.files && event.currentTarget.files[0]) {
		  // We upload only one file, in case
		  // multiple files were selected
		  var upload = profileImages.insert({
			file: event.currentTarget.files[0],
			streams: 'dynamic',
			chunkSize: 'dynamic'
		  }, false);

		  upload.on('start', function () {
			template.currentUpload.set(this);
		  });

		  upload.on('end', function (error, fileObj) {
			if (error) {
			  alert('Error during upload: ' + error);
			} else {
				console.log(fileObj._id);
				console.log(event.currentTarget.files[0]);
			  //alert('File "' + fileObj.name + '" successfully uploaded');
			}
			
			// Update The users profile image
			Meteor.users.update({_id:this.userId}, { $set:{"profile.avatar":fileObj._id+event.currentTarget.files[0].extensionWithDot}} ) // Had to use the current event for some reason
			
			template.currentUpload.set(false);
		  });

		  upload.start();
		}
	},
	
	'click #update_location': function(event){
		$.getJSON('https://freegeoip.net/json/') 
     .done (function(location)
     {
          //$('#country').html(location.country_name);
          //$('#country_code').html(location.country_code);
          //$('#region').html(location.region_name);
          //$('#region_code').html(location.region_code);
          //$('#city').html(location.city);
		  //alert(location.city);
          //$('#latitude').html(location.latitude);
          //$('#longitude').html(location.longitude);
          //$('#timezone').html(location.time_zone);
          //$('#ip').html(location.ip);
		  Meteor.users.update(Meteor.userId(), {
		  $set: {
			"profile.locLat": location.latitude,
			"profile.locLng": location.longitude,
			"profile.locName": location.city + ", " + location.region_name + ", " + location.country_name,
		  }
		});
     });
	},
	
	//Present check div and box.
	'click #presentCheck': function(event) {
		if($('#presentCheck').attr('aria-pressed') == 'true'){
			console.log("Uncheck!");
			$('#presentCheck').attr('aria-pressed', 'false');
			$('#presentCheck').addClass('btn-default');
			$('#toDate').val('');
			$('#toDate').prop('readonly', false);
		} else {
			console.log("Check!");
			$('#presentCheck').removeAttr('aria-pressed');
			$('#presentCheck').attr('aria-pressed', 'true');
			$('#presentCheck').removeClass('btn-default');
			$('#toDate').val('Present');
			$('#toDate').prop('readonly', true);
		}
	},
	
	//Save experience.
	'click #addExperience': function(event) {
		if($('#fromDate').val() == "" || $('#toDate').val() == "" || $('#newOrg').val() == "" || $('#newTitle').val() == "" || tinymce.get('newDesc').getContent() == ""){
			$("#errorModal").modal();
			console.log("Error");
		} else { 
			var fromStamp = new Date($('#fromDate').val()).getTime();
			console.log(fromStamp);
			
			Meteor.call('userExperience.insert',
				$('#fromDate').val(),
				fromStamp,
				$('#toDate').val(),
				$('#newOrg').val(),
				$('#newTitle').val(),
				tinymce.get('newDesc').getContent(),
			);
			
			$('#fromDate').val("");
			$('#toDate').val("");
			$('#newOrg').val("");
			$('#newTitle').val("");
			tinymce.get('newDesc').setContent("");
			if($('#presentCheck').attr('aria-pressed') == 'true'){
				console.log("Uncheck!");
				$('#presentCheck').attr('aria-pressed', 'false');
				$('#presentCheck').addClass('btn-default');
				$('#toDate').val('');
				$('#toDate').prop('readonly', false);
			}
			
		}
		
	},
	
	//Edit experience
	'click .edit': function(event){
		var xpId = event.currentTarget.id.slice(0,-5);
		var entry = Meteor.call('userExperience.getOne', xpId, function(e,r){
			console.log(r.fromDate);
		
			$('#fromDate').val(r.fromDate);
			$('#toDate').val(r.toDate);
			$('#newOrg').val(r.org);
			$('#newTitle').val(r.title);
			tinymce.get('newDesc').setContent(r.description);
			$('#addExperience').html('Update Experience');
			$('#addExperience').attr('id', 'update-' + r._id);
			
			if(r.toDate == "Present"){
				console.log("Check!");
				$('#presentCheck').removeAttr('aria-pressed');
				$('#presentCheck').attr('aria-pressed', 'true');
				$('#presentCheck').removeClass('btn-default');
				$('#toDate').val('Present');
				$('#toDate').prop('readonly', true);
			}
		});
		
		
	},
	
	//Save Edited Experience
	'click .updateExp': function(event){
		if($('#fromDate').val() == "" || $('#toDate').val() == "" || $('#newOrg').val() == "" || $('#newTitle').val() == "" || tinymce.get('newDesc').getContent() == ""){
			$("#errorModal").modal();
			console.log("Error");
		} else { 
			var fromStamp = new Date($('#fromDate').val()).getTime();
			console.log(event.currentTarget.id.substring(7));
			
			Meteor.call('userExperience.update',
				event.currentTarget.id.substring(7),
				$('#fromDate').val(),
				fromStamp,
				$('#toDate').val(),
				$('#newOrg').val(),
				$('#newTitle').val(),
				tinymce.get('newDesc').getContent(),
			);
			
			$('#fromDate').val("");
			$('#toDate').val("");
			$('#newOrg').val("");
			$('#newTitle').val("");
			tinymce.get('newDesc').setContent("");
			if($('#presentCheck').attr('aria-pressed') == 'true'){
				console.log("Uncheck!");
				$('#presentCheck').attr('aria-pressed', 'false');
				$('#presentCheck').addClass('btn-default');
				$('#toDate').val('');
				$('#toDate').prop('readonly', false);
			}
			$('#'+event.currentTarget.id).html('Add Experience');
		}
	},
	
	//Delete Experience
	'click .delete': function(event){
		var xpId = event.currentTarget.id.slice(0,-7);
		console.log(xpId);
		
		Meteor.call('userExperience.remove',
			xpId,
		);
	},
	
	'click .skyrooms_logout': function(event){
		event.preventDefault();
		Meteor.logout();
		Router.go('/');
	},
	
	//Update profile.
	'click #saveProfile'(event){
		event.preventDefault();
		
		Meteor.users.update(Meteor.userId(), {
		  $set: {
			"profile.firstName": $('[name=firstName]').val(),
			"profile.lastName": $('[name=lastName]').val(),
			"profile.birthday": $('[name=birthday]').val(),
			"profile.aboutUser": tinymce.get('aboutUser').getContent(),
			"profile.FacebookURL": $('#fbAcct').val(),
			"profile.TwitterURL": $('#twAcct').val(),
			"profile.LinkedInURL": $('#liAcct').val(),
		  }
		});
		Router.go('/desk');
		
	},
});