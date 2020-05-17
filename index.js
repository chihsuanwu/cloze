var words = [];
var selected = [];

$(document).ready(function(){
    // Get value on button click and show alert
	$("#number_start").val(1);
	$("#number_length").val(5);

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

    $(document).on('click', '.word', function(){
        const id = $(this).attr('id');
        const ij = id.split('-');
		const i = ij[0];
        const j = ij[1];

        if (selected.includes(id)) {
        	selected.splice(selected.indexOf(id), 1);
			$(this).text(words[i][j] + ' ');
        	update_answer();
        } else {
        	selected.push(id);
        	selected.sort(function (a, b) {
        		const aij = a.split('-');
        		const bij = b.split('-');
        		const a_val = parseInt(aij[0]) * 1000 + parseInt(aij[1]);
        		const b_val = parseInt(bij[0]) * 1000 + parseInt(bij[1]);
    			if (a_val > b_val) {
       				return 1;
    			}
    			if (b_val > a_val) {
        			return -1;
    			}
    			return 0;
			})
        	update_answer();
        
        }
        console.log(selected)
    });

    $("#btn_copy").click(function() {
    	var copy_str = '';

    	$("#main").children().each(function () {
    		console.log(this);
    		if ($(this).attr('class') == 'word') {
				copy_str += $(this).text();
    		} else {
    			copy_str += '\n';
    		}
    		
    	});

    	copy_str += '\n\n';

    	$("#answer").children().each(function () {
			copy_str += $(this).text();
    	});

    	copyToClipboard(copy_str);
    });
});

function copyToClipboard(str) {
  	const el = document.createElement('textarea');
  	el.value = str;
  	document.body.appendChild(el);
  	el.select();
  	document.execCommand('copy');
  	document.body.removeChild(el);
};

function update_answer(argument) {
	var answer = [];
	for (var i = 0; i < selected.length; i++) {
        
		const id = selected[i];
        const ij = id.split('-');
		const ii = ij[0];
        const jj = ij[1];

		var word = words[ii][jj];

		const end = ['...', '..', '.', '?', '!', '[', ']', ';', ','];
		var isEnd = -1;
		
		for (var j = 0; j < end.length; j++) {
			if (word.endsWith(end[j])) {
				word = word.slice(0, word.length - end[j].length);
				isEnd = j;
				break;
			}
		}

		var add = parseInt($("#number_start").val());
		if (isNaN(add)) add = 1;

		var len = parseInt($("#number_length").val());
		if (isNaN(len)) len = 5;
		var under = '';
		for (var j = 0; j < len; j++) {
			under += '_';
		}
		
		if (isEnd == -1) {
			$('#' + id).text((i+add)+'.' + under + ' ');
		} else {
			$('#' + id).text((i+add)+'.' + under + end[isEnd] + ' ');
		}
        

        answer.push(word);
    }

    answer.sort()

	$("#answer").empty();
    for (var i = 0; i < answer.length; i++) {
    	const ans_header = String.fromCharCode(65+i);
    	$("#answer").append('<span class="answer" id="'+ans_header + '">');
    	$('#'+ ans_header).text(ans_header +'.' +answer[i] + ' ');
    }
}

function convert() {
	var paragraph = $("#input").val();
	words = [];
	selected = [];

    const lines = paragraph.split('\n');
    console.log(lines)
    for (var i = 0; i < lines.length; i++) {
    	words[i] = lines[i].split(' ')
    }
   
    
    update_all();
}

function update_all() {
	$("#main").empty();
	for (var i = 0; i < words.length; i++) {
    	for (var j = 0; j < words[i].length; j++) {
    		const id = i +'-'+ j
    		$("#main").append('<span class="word" id="'+ id + '">');
    		$('#'+ id).text(words[i][j] + ' ');
    	}
    	$("#main").append('<br />')
    }
}
