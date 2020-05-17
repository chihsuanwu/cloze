var words = [];
var selected = [];

$(document).ready(function(){
	$("#number_start").val(1);
	$("#number_length").val(3);

	$("#number_start").on('input',function(){
		update_answer();
	});

	$("#number_length").on('input', function() {
    	update_answer();
    });

    $("#input").on('input', function() {
    	convert();
    });

    $("#btn_clear").click(function() {
    	$("#input").val('');
    	convert();
    });

    $(document).on('click', '.word', function() {
        const id = $(this).attr('id');

        if (selected.includes(id)) {
        	selected.splice(selected.indexOf(id), 1);
            const [i, j] = idToIJ(id);
			$(this).text(words[i][j] + ' ');
        	update_answer();
        } else {
        	selected.push(id);
        	selected.sort(function (a, b) {
        		const a_val = idToVlaue(a), b_val = idToVlaue(b);
    			if (a_val > b_val) 
       				return 1;
    			
    			if (b_val > a_val) 
        			return -1;
    			
    			return 0;
			})
        	update_answer();
        }
    });

    $("#btn_copy").click(function() {
    	var copy_str = '';

    	$("#main").children().each(function () {
            copy_str += $(this).attr('class') == 'word' ? $(this).text(): '\n';
    	});

    	copy_str += '\n\n';

    	$("#answer").children().each(function () {
			copy_str += $(this).text();
    	});

    	copyToClipboard(copy_str);
    });
});

function idToIJ(id) {
    const ij = id.split('-');
    return [ij[0], ij[1]]
};

function idToVlaue(id) {
    const ij = id.split('-');
    return parseInt(ij[0]) * 1000 + parseInt(ij[1]);
};

function copyToClipboard(str) {
  	const element = document.createElement('textarea');
  	element.value = str;
  	document.body.appendChild(element);
  	element.select();
  	document.execCommand('copy');
  	document.body.removeChild(element);
};

function update_answer(argument) {
	var answer = [];
	for (const [i, id] of selected.entries()) {
        const index = idToIJ(id);
		var word = words[index[0]][index[1]];

		const ends = ['...', '..', '.', '?', '!', '[', ']', ';', ':', ','];
		var isEnd = '';
		
		for (const end of ends) {
			if (word.endsWith(end)) {
				word = word.slice(0, word.length - end.length);
				isEnd = end;
				break;
			}
		}

		var add = parseInt($("#number_start").val());
		if (isNaN(add)) add = 1;

		var len = parseInt($("#number_length").val());
		if (isNaN(len)) len = 3;
		var under = '_'.repeat(len);
		
        $('#' + id).text('_' + (i+add) + under + isEnd + ' ');
    
        answer.push(word);
    }

    answer.sort();

	$("#answer").empty();
    for (var i = 0; i < answer.length; ++i) {
    	const ans_header = String.fromCharCode(65+i);
    	$("#answer").append('<span class="answer" id="'+ans_header + '">');
    	$('#'+ ans_header).text('(' + ans_header +')' +answer[i] + ' ');
    }
}

function convert() {
	var paragraph = $("#input").val();
	words = [];
	selected = [];

    const lines = paragraph.split('\n');
    for (const w of lines) 
    	words.push(w.split(' '));
    
    update_all();
    update_answer();
}

function update_all() {
	$("#main").empty();
	for (var i = 0; i < words.length; ++i) {
    	for (var j = 0; j < words[i].length; ++j) {
    		const id = i +'-'+ j
    		$("#main").append('<span class="word" id="'+ id + '">');
    		$('#'+ id).text(words[i][j] + ' ');
    	}
    	$("#main").append('<br />')
    }
}
