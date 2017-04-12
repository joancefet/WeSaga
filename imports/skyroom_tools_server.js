console.log("Skyroom Tools Loaded");
Meteor.SkyroomTools = {
	
	// SEO URL
	ToSeoUrl : function(url) { 
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
	},
	
	// GUID
	guid : function() {
	  function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
		  .toString(16)
		  .substring(1);
	  }
	  return s4() + s4();
	},

	
	meta_description: function(text){
		
		return (text.replace(/<\/?[^>]+(>|$)/g, "").slice(0,170));
		
	} 
	
}