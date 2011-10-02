var step = 1;
var etsy_prod = null;
var etsy_prod_sel = 0;
var hp_food = null;
var hp_food_sel = 0;
var hp_hotel = null;
var hp_hotel_sel = 0;

function render_etsy_prod()
{
	var html = '<table border="0"><tr>';
	
	for (var i = 0; i <= 2; i++)
		html = html+'<td id="step1-holder'+i+'" class="step1-holder"><img id="'+i+'" class="step1-images" src="' + etsy_prod[i].image + '" width="250px" height="250px" /></td>';
		
	html = html+'</tr></table>';
	$('#step1-choices').fadeTo('normal', 0, function(){
		$('#step1-choices').html(html).fadeTo('normal', 1);
		
		$('#step1-holder'+etsy_prod_sel).animate({backgroundColor: '#b5def2'}, 'fast');

		$('.step1-images').each(function() {
			$(this).click(function() {
				etsy_prod_sel = $(this).attr("id");

				$('.step1-holder').each(function() {
					$(this).animate({backgroundColor: '#eee'}, 'fast');
				});

				$('#step1-holder'+etsy_prod_sel).animate({backgroundColor: '#b5def2'}, 'fast');
			});
		});
	});
}

function request_etsy_prod()
{
	$.ajax({
		url: '/etsy/50/3',
		async: 'true',
		dataType: 'json',
		timeout: 1000, 
		success: function ( data )
		{ 
			etsy_prod = data;
			render_etsy_prod();
		}
	});
}

function render_hp_food()
{
	var html = '<table border="0"><tr>';
	
	for (var i = 0; i <= 2; i++)
		html = html+'<td id="step3-holder'+i+'" class="step3-holder"><img id="'+i+'" class="step3-images" src="' + hp_food[i].image + '" width="250px" height="250px" /></td>';
		
	html = html+'</tr></table>';
	$('#step3-choices').fadeTo('normal', 0, function(){
		$('#step3-choices').html(html).fadeTo('normal', 1);
		
		$('#step3-holder'+hp_food_sel).animate({backgroundColor: '#b5def2'}, 'fast');

		$('.step3-images').each(function() {
			$(this).click(function() {
				hp_food_sel = $(this).attr("id");

				$('.step3-holder').each(function() {
					$(this).animate({backgroundColor: '#eee'}, 'fast');
				});

				$('#step3-holder'+hp_food_sel).animate({backgroundColor: '#b5def2'}, 'fast');
			});
		});
	});
	

}

function request_hp_food()
{
	$.ajax({
		url: '/hp/New+York/food/1',
		async: 'true',
		dataType: 'json',
		timeout: 1000, 
		success: function ( data )
		{ 
			hp_food = data;
			render_hp_food();
		}
	});
}

function render_hp_hotel()
{
	var html = '<table border="0"><tr>';
	
	for (var i = 0; i <= 2; i++)
		html = html+'<td id="step4-holder'+i+'" class="step4-holder"><img id="'+i+'" class="step4-images" src="' + hp_food[i].image + '" width="250px" height="250px" /></td>';
		
	html = html+'</tr></table>';
	$('#step4-choices').fadeTo('normal', 0, function(){
		$('#step4-choices').html(html).fadeTo('normal', 1);
		
		$('#step4-holder'+hp_hotel_sel).animate({backgroundColor: '#b5def2'}, 'fast');

		$('.step4-images').each(function() {
			$(this).click(function() {
				hp_hotel_sel = $(this).attr("id");

				$('.step4-holder').each(function() {
					$(this).animate({backgroundColor: '#eee'}, 'fast');
				});

				$('#step4-holder'+hp_hotel_sel).animate({backgroundColor: '#b5def2'}, 'fast');
			});
		});
	});
}

function request_hp_hotel()
{
	$.ajax({
		url: '/hp/New+York/hotel/any',
		async: 'true',
		dataType: 'json',
		timeout: 1000, 
		success: function ( data )
		{ 
			hp_hotel = data;
			render_hp_hotel();
		}
	});
}

function handle_steps()
{
		if (step-1 >= 1)
			$('#step'+(step-1)).animate({color:'#999'}, 'fast');

		$("#step" + step).animate({color:'#000'}, 'fast');

		if (step+1 <= 5)
			$('#step'+(step+1)).animate({color:'#999'}, 'fast');
}

function toggle_pagination()
{
	if (step == 1)
	{
		$('#next-button').fadeTo('normal', 1);
		$('#prev-button').fadeTo('normal', 0);
	}
	else if (step == 5)
	{
		$('#next-button').fadeTo('normal', 0);
	}
	else
	{
		$('#prev-button').fadeTo('normal', 1);
		$('#next-button').fadeTo('normal', 1);
	}
}

$(document).ready(function() { 
	toggle_pagination();
	handle_steps();
	
	$('#step1-page').show('slide', {direction:'right'}, 500);
	
	$('#next-button').click(function() {
		if (step != 5)
			step++;
		else
			return;
			
		$('#step'+(step-1)+'-page').hide('slide', {direction:'left'}, 500);
		$('#step'+step+'-page').show('slide', {direction:'right'}, 500);

		toggle_pagination();
		handle_steps();		
	});
	
	$('#prev-button').click(function() {
		if (step != 1)
			step--;
		else
			return;
			
		$('#step'+(step+1)+'-page').hide('slide', {direction:'right'}, 500);
		$('#step'+step+'-page').show('slide', {direction:'left'}, 500);
		
		toggle_pagination();
		handle_steps();
	});
	
	$('.refresh-button').each(function() {
		$(this).click(function() {
			if (step == 1)
				request_etsy_prod();
			else if (step == 2)
				request_etsy_prod();
			else if (step == 3)
				request_hp_food();
			else if (step == 4)
				request_hp_hotel();
		});
	});
	
	request_hp_food();
	request_etsy_prod();	
	request_hp_hotel();
});