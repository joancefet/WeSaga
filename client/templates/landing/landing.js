Router.route('/', {
	data:function(){
		
		if( Meteor.user() ){
			Router.go('/buzz');
		} 
		
	},
	waitOn: function(){
				
		var seo_title 		=  "SkyRooms Virtual Offices for Business";
		var seo_description = "SkyRooms Virtual Offices is a Freemium based Professionals Social Network and Business Management suite";
		var seo_image 		= "https://www.skyrooms.io/images/og_facebook.jpg";
		SEO.set({
			
			description: seo_description,
			title: seo_title,
			image: seo_image,
			separator: '-',

			meta: {
				keywords: ['skyrooms', 'virtual', 'office'], 
			},

			twitter: {
				card: seo_title+" - "+seo_description,
				creator: '@skyrooms'
				// etc.
			},

			og: {
				site_name: 'SkyRooms',
				title: seo_title,
				description: seo_description,
				image: seo_image,
				type:"article",
				url:"https://www.skyrooms.io",
				'fb:app_id':"726835877472962",
			}
			
		});
		
	},
	template: 'landing',
	yieldTemplates: {
		'landing': {to: 'content'},
	},
	onAfterAction: function() {

	
	}
	
});

Template.landing.rendered = function() {
	$('body').addClass("landing-page");
	
	ga('send', 'event', "view", "landing");
	
	equalize(".equalize .table");
	equalize(".equalize");
	$(".table td").css('border', 'none');
	

	
};

Template.landing.events({
	
	
	'click #calculate'(event){
		
		$("#calc_total").html("<div class='loader'></div>");
		$("#calc_total_annual").hide();
		setTimeout(function(){
			
			var modules_standard = 0;
			var modules_fee = 3;
			var total = 0;
			var white_label = 0;
			
			// Modules
			// TODO: Email is not standard feature, do custom rule
			
			if( $("input#module_leads").is(":checked") ){
				modules_standard++;
			}
			if( $('input#module_tickets').is(':checked') ){
				modules_standard++;
			}
			if( $('input#module_pm').is(':checked') ){
				modules_standard++;
			}
			if( $('input#module_hr').is(':checked') ){
				modules_standard++;
			}
			if( $('input#module_schedule').is(':checked') ){
				modules_standard++;
			}
			if( $('input#module_book').is(':checked') ){
				modules_standard++;
			}
			if( $('input#module_email').is(':checked') ){
				modules_standard++;
			}
			if( $('input#module_white').is(':checked') ){
				white_label = 200;
			}
			
			// Submits
			var submit_members = $('#module_members').val();
			var submit_leads = $('#module_leads_submit').val() * 0.15;
			var submit_tickets = $('#module_tickets_submit').val() * 0.15;
			
			if(submit_members <= 5 ){
				total = ( (modules_standard * 0) * submit_members ) + submit_leads + submit_tickets + white_label;
			}else{
				total = ( (modules_standard * modules_fee) * submit_members ) + submit_leads + submit_tickets+ white_label;
			}
			
			$("#calc_total").html("$"+ total +" a month");
			$("#calc_total_annual").show();
			$("#calc_total_annual").html("$"+ total * 12 +" a year");
			
			
			
		},1000);
		
		
	}
	
});
