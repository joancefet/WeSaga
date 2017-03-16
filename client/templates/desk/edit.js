

Router.route('/desk/edit',{
	data:function(){
		
		if( !Meteor.user()){
			Router.go('/');
		}
	},
	template:'screen',
	yieldTemplates: {
		'deskedit': {to: 'content'},
	}
	
});

// ------------------
// ACCOUNT
// ------------------
Template.deskedit.rendered = function() {
	
	//Load Google Map
	GoogleMaps.load({key: 'AIzaSyATUzfjVr1TtxqBIvDJa2AKnNYdgu_XXKE'});
	
};



// Initialize file uploader
// ========================
Template.deskedit.onCreated(function () {
  
  //Place Marker on User Location.
  GoogleMaps.ready('editMap', function(map) {
    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
  });
  
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
			draggable: true,
			scrollwheel: true,
			disableDoubleClickZoom: true,
		  };
		  
		}
	},
	  
});

// Events
// ======
Template.deskedit.events({
	
	'change #fileInput': function (event, template) {
		
		// TODO: Remove current profile pic from Cloudinary
			
		$( ".imageUploadPreview" ).addClass( "loader" );
		$( ".imageUploadPreview img" ).addClass( "loader_background" );
		
		
		Cloudinary.upload(event.currentTarget.files, function(error, result){
			
			Meteor.users.update({_id:Meteor.userId()}, {
				$set:{"profile.avatar":"https://res.cloudinary.com/skyroomsio/image/upload/c_thumb,g_face,h_512,w_512/v1489424858/"+result.public_id+"."+result.format}
			});
			
			setTimeout(function(){
				$( ".imageUploadPreview" ).removeClass( "loader" );
				$( ".imageUploadPreview img" ).removeClass( "loader_background" );
			},2000);
			
		});
		
		console.log("COMPLETE");
		
	},
	
	'click #update_location': function(event){
		$.getJSON('https://freegeoip.net/json/').done(function(location){
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
	}
	
})