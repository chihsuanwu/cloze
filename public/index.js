$(document).ready(function(){
	let words = [];
	let selected = [];

	$("#number_start").val(1);
	$("#number_length").val(3);

	$("input").on('input',function(){
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
            const [i, j] = id.split('-');
			$(this).text(words[i][j] + ' ');
        } else {
        	selected.push(id);
        	selected.sort(function (a, b) {
        		return idToValue(a) - idToValue(b)
			});
        }
        update_answer();
    });

	function idToValue(id) {
        const [i, j] = id.split('-');
        return parseInt(i) * 1000 + parseInt(j);
    };

    function convert() {
    	words = [];
    	selected = [];

        const lines =  $("#input").val().split('\n');
        for (const w of lines) 
        	words.push(w.split(' '));
        
        setup_html();
        update_answer();
    }

    function remove_end(word) {
		for (const end of ['...', '..', '.', '?', '!', '[', ']', ';', ':', ',']) 
    		if (word.endsWith(end)) 
    			return [end, word.slice(0, word.length - end.length)];

    	return ['', word];
    }

    function update_answer() {
    	let answer = [];
    	
        for (const id of selected) {
        	const [_, word] = remove_end(words[id.split('-')[0]][id.split('-')[1]]);
        	answer.push(word);
        }
		answer.sort();

		for (let i = 0; i < selected.length; ++i) {
    		const id = selected[i];
    		const [end, word] = remove_end(words[id.split('-')[0]][id.split('-')[1]]);
    		
    		let add = parseInt($("#number_start").val());
    		if (isNaN(add)) add = 1;

    		let len = parseInt($("#number_length").val()) - 2;
    		if (isNaN(len)) len = 1;
    		const under = '_'.repeat(len);

    		let ans = $("#show_answer").is(':checked')? String.fromCharCode(65 + answer.indexOf(word)) : '_';

            $('#' + id).text('_(' + (i+add) + ')' + '_' + ans + under + end + ' ');
        }

    	$("#answer").empty();
        for (let i = 0; i < answer.length; ++i) {
        	const ans_header = String.fromCharCode(65+i);
        	$("#answer").append('<span class="answer" id="'+ans_header + '">');
        	$('#'+ ans_header).text('(' + ans_header +')' +answer[i] + ' ');
        }
    }

    function setup_html() {
    	$("#main").empty();
    	for (let i = 0; i < words.length; ++i) {
        	for (let j = 0; j < words[i].length; ++j) {
        		const id = i +'-'+ j
        		$("#main").append('<span class="word" id="'+ id + '">');
        		$('#'+ id).text(words[i][j] + ' ');
        	}
        	$("#main").append('<br />');
        }
    }

    $("#btn_copy").click(function() {
    	let copy_str = '';

    	$("#main").children().each(function () {
            copy_str += $(this).attr('class') == 'word' ? $(this).text(): '\n';
    	});

    	copy_str += '\n\n';

    	$("#answer").children().each(function () {
			copy_str += $(this).text();
    	});

    	copyToClipboard(copy_str);
    });

    
    function copyToClipboard(str) {
      	const element = document.createElement('textarea');
      	element.value = str;
      	document.body.appendChild(element);
      	element.select();
      	document.execCommand('copy');
      	document.body.removeChild(element);
    };
});
