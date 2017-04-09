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
			
			if( $("input#module_leads").is(":checked") ){
				modules_standard++;
			}
			if( $('input#module_tickets').is(':checked') ){
				modules_standard++;
			}
			if( $('input#module_leads').is(':checked') ){
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
				total = 0;
			}else{
				total = ( (modules_standard * modules_fee) * submit_members ) + submit_leads + submit_tickets+ white_label;
			}
			
			$("#calc_total").html("$"+ total +" a month");
			$("#calc_total_annual").show();
			$("#calc_total_annual").html("$"+ total * 12 +" a year");
			
			
			
		},1000);
		
		
	}
	
});
