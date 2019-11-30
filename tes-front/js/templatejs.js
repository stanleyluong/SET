<script type="text/javascript">
$(document).ready(function() {
	var key_map = {
		'81': [0,0], '87': [0, 1], '69': [0,2], '82': [0, 3], '84': [0,4], '89': [0, 5], '85': [0, 6],
		'65': [1,0], '83': [1, 1], '68': [1,2], '70': [1, 3], '71': [1,4], '72': [1, 5], '74': [1, 6],
		'90': [2,0], '88': [2, 1], '67': [2,2], '86': [2, 3], '66': [2,4], '78': [2, 5], '77': [2, 6]
	};
	$(window).keydown(function(event){
		if (event.keyCode == '51') {
			var url = $('#add_cards').attr('href');
			if (url) {
				location.href = url;
			}
		}
		if (event.keyCode in key_map) {
			$('#board tr:eq(' +key_map[event.keyCode][0] + 
					') td:eq(' + key_map[event.keyCode][1] +')').trigger('click');
		}
	});
	$("#board td").click(function () {
		$("td.find").removeClass('find');
		if ($(this).hasClass('selected')) {
			$(this).removeClass('selected');
			$('[name=card['+$(this).attr('id')+']]').val('0');
		} else {
			$('[name=card['+$(this).attr('id')+']]').val('1');
			$(this).addClass('selected');
		}
		if ($("td.selected").length == 3) {
			$("#set_form").submit();
		}
	});
	$("#duration").everyTime(1000, function(i) {
	
		$(this).text(i+21);
	});
	
});
</script>