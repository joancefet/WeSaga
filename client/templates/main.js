import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';

// ====================================
// COLLECTIONS
// ====================================
import { Posts } 					from '../../imports/posts.js';
import { Postsmeta } 				from '../../imports/postsmeta.js';

// ====================================
// STARTUP / SUBSCRIPTIONS
// ====================================
Meteor.startup(function(){
	
	// NOT WORKING
	SEO.set({
		defaults: {
			title: 'Virtual Offices for Business',
			suffix: 'SkyRooms',
			separator: '·',

			description: 'SkyRooms Virtual Offices is a Freemium based Professionals Social Network and Business Management suite',
			image: 'https://www.skyrooms.io/images/og_facebook.jpg',

			meta: {
				keywords: ['skyrooms', 'virtual', 'office'], 
			},

			twitter: {
				card: 'SkyRooms - Virtual Offices for Business',
				creator: '@skyrooms'
				// etc.
			},

			og: {
				site_name: 'SkyRooms',
				description: 'SkyRooms - Virtual Offices for Business',
				image: 'https://www.skyrooms.io/images/og_facebook.jpg',
				type:"article",
				url:"https://www.skyrooms.io",
				'fb:app_id':"726835877472962",
			}
		}
	});
		
	toastr.options = {
		"closeButton": true,
		"debug": false,
		"newestOnTop": false,
		"progressBar": false,
		"positionClass": "toast-top-right",
		"preventDuplicates": false,
		"onclick": null,
		"showDuration": "300",
		"hideDuration": "1000",
		"timeOut": "15000",
		"extendedTimeOut": "0",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	}
	
});


// ====================================	
// IMPORT TEMPLATES
// ====================================	
// Todo: Make a script that just grabs all .html files. Why this isn't auto already...?

import './main.html';
	import './account_navigation.html';
import './landing/landing.html';
import './meet/meet.html';
import './desk/desk.html';
	import './desk/edit.html';
import './groups/groups.html';
	import './groups/groups_manager.html';
import './group/group_desk.html';
	import './group/group_people_pending.html';
import './chats/chats.html';
import './people/people.html';
import './register/register.html';
import './login/login.html';

Router.configure({
    trackPageView: true
});

// =======================
//
// HELPERS
//
// =======================
// This needs to be moved in to their own JS files, but for some reason Meteor hates it
// Lets do this asap but its hard :(

// Account Navigation Helper
Template.sidebar_right.helpers({
	
	// ACTIVE CLASS ON MENU BARS
	show_ads(){
		if(location.hostname === "localhost"){
			return false;
		}else{
			return true;
		}
	}
	
});

// Account Navigation Helper
Template.account_navigation_list.rendered = function() {
	Meteor.subscribe('posts', "notify", Meteor.userId() ); 
	Meteor.subscribe('posts', "colleagues", Meteor.userId() ); 
};

// Account Navigation Helper
Template.account_navigation_list.helpers({
	
	// ACTIVE CLASS ON MENU BARS
	account_navigation_list_active_class(link) {

		if( ToSeoUrl( Iron.Location.get().path ) == "-"+link){ // Do this because / in the location becaomes a -
			return 'active';
		}

	},

	// Notification Helper
	notify_count() {
		var posts = Posts.find({type:"notify", status:"new"}).count();
		return posts;
	},
  
  
});
Template.account_navigation.events({

	'click .skyrooms_logout'(event) {
		
		swal({
			title: "Logout?",
			text: "",
			type: "question",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Logout",
		}).then(function (result) {
			Meteor.logout();
			Router.go('/');
		});
		
	},

});

// ====================================	
// GENERAL
// ====================================	

// ALL SCREENS RENDER (with extension)
Template.onRendered(function () {
	console.log("RENDER: Template.onRendered");

	$('body').addClass("fixed-sidebar");
	
	// LOADING SCREEN
	if( window.skyroom_rendered == undefined && window.skyroom_rendered == null ){
		//console.log("SET TIMEOUT!");
		setTimeout(function(){
			$('.splash').css('display', 'none');
			window.skyroom_rendered = true;
		},2000);		
		// TODO: Set a global "DATA IS COMPLETE", then remove the lodaer that way.
	};
	if( window.skyroom_rendered == true ){
		//console.log("NO TIMEOUT");
		$('.splash').css('display', 'none'); // Hide this immeidatley, we're already rendered
	};
});



// AFTER GLOBAL RENDER?
Router.onAfterAction(function(){
	
	console.log("RENDER: Router.onAfterAction");
	
	
});

Template.screen.rendered = function() {
	
	console.log("RENDER: Template.screen.rendered");
	

	// This is SUPER broken don't use it	

	
	// HOMER THEME
	// ===========
	
	setBodySmall();
	// Wait until metisMenu, collapse effect finish and set wrapper height
	setInterval(function () {
		fixWrapperHeight();
	}, 300);

	$(window).bind("resize click", function () {

		// Add special class to minimalize page elements when screen is less than 768px
		setBodySmall();

		// Wait until metisMenu, collapse effect finish and set wrapper height
		setTimeout(function () {
			fixWrapperHeight();
		}, 300);
	});
	
	$('.animate-panel').animatePanel();
	
	
}


function fixWrapperHeight() {

    // Get and set current height
    var headerH = 0;
    var navigationH = $("#navigation").height();
    var contentH = $(".content").height();

    // Set new height when content height is less then navigation
    if (contentH < navigationH) {
        $("#wrapper").css("min-height", navigationH + 'px');
    }

    // Set new height when content height is less then navigation and navigation is less then window
    if (contentH < navigationH && navigationH < $(window).height()) {
        $("#wrapper").css("min-height", $(window).height() - headerH  + 'px');
    }

    // Set new height when content is higher then navigation but less then window
    if (contentH > navigationH && contentH < $(window).height()) {
        $("#wrapper").css("min-height", $(window).height() - headerH + 'px');
    }
}




function setBodySmall() {
	
    if ($(window).width() < 769) {
        $('body').addClass('page-small');
    } else {
        $('body').removeClass('page-small');
        $('body').removeClass('show-sidebar');
    }
}



// Animate panel function
$.fn['animatePanel'] = function() {

    var element = $(this);
    var effect = $(this).data('effect');
    var delay = $(this).data('delay');
    var child = $(this).data('child');

    // Set default values for attrs
    if(!effect) { effect = 'zoomIn'}
    if(!delay) { delay = 0.06 } else { delay = delay / 10 }
    if(!child) { child = '.row > div'} else {child = "." + child}

    //Set defaul values for start animation and delay
    var startAnimation = 0;
    var start = Math.abs(delay) + startAnimation;

    // Get all visible element and set opacity to 0
    var panel = element.find(child);
    panel.addClass('opacity-0');

    // Get all elements and add effect class
    panel = element.find(child);
    panel.addClass('stagger').addClass('animated-panel').addClass(effect);

    var panelsCount = panel.length + 10;
    var animateTime = (panelsCount * delay * 10000) / 10;

    // Add delay for each child elements
    panel.each(function (i, elm) {
        start += delay;
        var rounded = Math.round(start * 10) / 10;
        $(elm).css('animation-delay', rounded + 's');
        // Remove opacity 0 after finish
        $(elm).removeClass('opacity-0');
    });

    // Clear animation after finish
    setTimeout(function(){
        $('.stagger').css('animation', '');
        $('.stagger').removeClass(effect).removeClass('animated-panel').removeClass('stagger');
    }, animateTime)

};
