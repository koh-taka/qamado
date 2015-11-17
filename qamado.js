$(function(){
  var file_md = 'sample.md';
  $.get(file_md, function(read_md){
    var mark_text = read_md;
        converter = new showdown.Converter({
          prefixHeaderId: true
        });
        mark_html = converter.makeHtml(mark_text);
    document.getElementById('qa_render').innerHTML = mark_html;
  });
});
