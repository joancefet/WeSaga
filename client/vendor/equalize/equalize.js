
equalize = function(element){
	
	var maxHeight = 0;

	$(element).each(function(){
	   if ($(this).height() > maxHeight) { maxHeight = $(this).height(); }
	});

	$(element).height(maxHeight);
	
}
