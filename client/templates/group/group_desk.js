import { Posts } 					from '../../../imports/posts.js';
import { Postsmeta } 				from '../../../imports/postsmeta.js';

// ROUTER
//=========
Router.route('/group/:group_slug',{
	data:function(){
		
	},
	waitOn: function(){
		
		Meteor.subscribe('posts', "notify", Meteor.userId() ); 
		
		Meteor.subscribe('posts', 'group_by_slug', ToSeoUrl(Router.current().params.group_slug) );
		var group = Posts.findOne({type:"groups"});
		// console.log(group);
		
		Meteor.subscribe('posts', 'group_desk',  ToSeoUrl(Router.current().params.group_slug) );
		Meteor.subscribe('posts', "group_desk_posts", group._id ); 
		Meteor.subscribe('posts', 'group_image_by_group_id', group._id );
		
		Meteor.subscribe('posts', 'group_location',  group._id );
		Meteor.subscribe('posts', 'group_phone',  group._id );
		Meteor.subscribe('posts', 'group_email',  group._id );
		
	},
	template:'screen',
	yieldTemplates: {
		'group_desk': {to: 'content'},
	}
	
});

Router.route('/group/:group_slug/desk',{
	data:function(){
		
	},
	waitOn: function(){
		Router.go('/group/'+ToSeoUrl(Router.current().params.group_slug));
	},
	template:'screen',
	yieldTemplates: {
		'group_desk': {to: 'content'},
	}
	
});

Template.group_desk.rendered = function() {

	//Load Google Map
	GoogleMaps.load({key: 'AIzaSyATUzfjVr1TtxqBIvDJa2AKnNYdgu_XXKE'});

	//Place Marker on User Location.
	GoogleMaps.ready('profileMap', function(map) {
		var marker = new google.maps.Marker({
			position: map.options.center,
			map: map.instance
		});
	});
	
};

// Events
Template.group_desk.events({
	
	// Submit New Post
	'click .group_submit_new_post'(event) {
		event.preventDefault();
		
		if( $(".newPostContent").val().length < 1 ){
			return;
		}
		
		Meteor.call('posts.update',
			"new",
			"me",
			"",
			$(".newPostContent").val(),
			"group_desk_posts",
			$("#group_id").val(),
			"publish",
			function(error, parent_post_id){
				
				// Upload Attachments				
				input = document.getElementById('fileInput');
				for(var i = 0; i < input.files.length ; i++){(function(i) {
					var file = input.files[i];
					
					// Send to Cloudinary
					Cloudinary.upload( file, function(error, result){
						
						Meteor.call('posts.update',
							"new",
							"me",
							"",
							"https://res.cloudinary.com/skyroomsio/image/upload/a_0/"+result.public_id+"."+result.format, 
							"group_desk_posts_attachment",
							parent_post_id,
						);
						console.log("ADDED post_attachment to:" +parent_post_id);
					});
					
					
				})(i); }

				// Reset Form
				$(".newPostContent").val(""); 
				$("#fileInput").val("");
				$(".fileInput_count").html("");
				
			}
		);
		
		// Reset Form
		$(".newPostContent").val(""); 
		
		
	},
	
	
	// Comment
	'submit .comment'(event) {
		event.preventDefault();
		
		const target = event.target;
		console.log(target);
		
		Meteor.call('posts.update',
			"new",
			"me",
			"",
			target.content.value,
			"group_desk_posts_comments",
			target.parent_id.value, //TODO This part. No parent is set.
		);
		
		$('[name=content]').val('');
	},
	
});


// skyrooms Helper
Template.group_desk.helpers({
	
	group_desk() {
		
		// Find all the groups on screen, then find our membership status
		var groups = Posts.find({type:"groups"});
		groups.forEach(function(group){
			Meteor.subscribe('posts', 'group_member_by_group_id', Meteor.userId(), group._id );
		});
		
		return groups;
	},
	group_image(){
		var image = Posts.findOne({title:"group_image", parent_id:this._id});
		if(image){ 
			return image.content;
		}else{
			return false;
		}
	},
	
	group_slug(){
		
		return Router.current().params.group_slug; 
	},
	
	slug(string){
		return ToSeoUrl(string);
	},
	
	isMember(){
		return true;
	},
	
	the_group_id(){
		var group = Posts.findOne({type:"groups"}); 
		if(group){
			return group._id;
		} else {
			return "not_found";
		}
	},
	the_group_title(){
		var group = Posts.findOne({type:"groups"}); 
		if(group){
			return group.title;
		} else {
			return false;
		}
	},
	the_group_content(){
		var group = Posts.findOne({type:"groups"}); 
		if(group){
			return group.content;
		} else {
			return false;
		}
	},
	
	the_group_location(){
		var post = Posts.findOne({type:"group_location"}); 
		return post.content; 
	},
	
	the_group_phone(){
		var post = Posts.findOne({type:"group_phone"}); 
		return post.content; 
	},
	
	the_group_email(){
		var post = Posts.findOne({type:"group_email"}); 
		return post.content; 
	},
	
	mapOptions: function() {
		if (GoogleMaps.loaded()) {
			return {
				center: new google.maps.LatLng(Meteor.user().profile.location_latitude, Meteor.user().profile.location_longitude),
				zoom: 4,
				disableDefaultUI: true, 
				draggable: true,
				scrollwheel: true,
				disableDoubleClickZoom: true,
			};
			console.log("There was NOT an error!");
		} else {
			console.log("There was an error!");
		}
	},
	
	group_desk_posts() {
		
		// Find and return their recent desk_post
		return Posts.find({type:"group_desk_posts"}, {sort: { createdAt: -1 } });
		
	},
	
	group_desk_posts_comments(){
		// SUBSCRIBE TO POSTMETA: parent_id
		var group = Posts.findOne({type:"groups"});
		
		Meteor.subscribe('posts', "group_desk_posts_comments", this._id); 
		return Posts.find({type: "group_desk_posts_comments", parent_id:this._id}); 
	},
	
	group_desk_posts_attachment(){
		Meteor.subscribe('posts', "group_desk_posts_attachment", this._id);
		return Posts.find({type: "group_desk_posts_attachment", parent_id:this._id});
	},
	
	HasOwnerAvatar(){
		if(this.owner_avatar != "undefined"){
			return true;
		}
	},
	
  
});
