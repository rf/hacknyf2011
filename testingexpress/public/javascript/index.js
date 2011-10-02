var step = 1;

$(document).ready(function() { 
	toggle_pagination();
});

function toggle_pagination()
{
	if (step == 1)
	{
		$('.next-button').fadeTo('normal', 1);
		$('.prev-button').fadeTo('normal', 0);
	}
	else if (step == 5)
	{
		$('.next-button').fadeTo('normal', 0);
	}
	else
	{
		$('.prev-button').fadeTo('normal', 1);
		$('.next-button').fadeTo('normal', 1);
	}
}