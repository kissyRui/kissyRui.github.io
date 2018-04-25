function initAction () {
	$('.draggable').draggable({ revert: 'valid' })
	$('.droppable').droppable({
      hoverClass: 'boxHover',
      drop: function( event, ui ) {
        	var dragType = ui.draggable.attr('data-type')
        	var dropType = $(this).attr('data-type')
        	if (dragType == dropType) {
        		ui.draggable.css('visibility', 'hidden')
        		$(this).append('<li class="' + dragType + '"></li>')
        	}
      }
    })
}

function createRandomTypes () {
	var baseTypes = ['r-0', 'r-1', 'b-0', 'b-1']
	var html = ''
	$('.region-item').empty()
	$('#J_lists').empty()
	for (var i = 0; i < 12; i++) {
		var randomIndex = Math.floor(Math.random() * 4)
		var randomType = baseTypes[randomIndex]
		html += '<li class="draggable ' + randomType + '" data-type="' + randomType + '"></li>'
	}
	$('#J_lists').append(html)
}

$(document).ready(function() {
	createRandomTypes()
	initAction()
	$('.replay-btn').click(function() {
		createRandomTypes()
		initAction()
	})
})