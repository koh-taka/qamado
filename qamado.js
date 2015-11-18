

$(function(){
  // ファイルパス
  var file_md = 'sample.md';
  // リストは数字にするか黒丸にするか
  var list_type_is_number = false;
  // ヘッダの最初は何にするか 1ならh1とh2を取得
  var header_start = 1;

  //ファイルを取得してhtmlにレンダリング
  $.get(file_md, function(read_md){
    var converter = new showdown.Converter({
      prefixHeaderId: true,
      headerLevelStart: header_start,
    });
    document.getElementById('qa_render').innerHTML = converter.makeHtml(read_md);

    //目次を作る
    var list_type = (list_type_is_number === true) ? 'ol' : 'ul';
    var header_next = header_start + 1;
    var selector_header = '#qa_render h' + header_start + ', #qa_render h' + header_next;

    var array_h = [];
    $(selector_header).each(function(count){
      var t = {
        tag: this.nodeName ,
        id: this.id ,
        text: this.innerHTML ,
      };
      array_h.push(t);
    });

    var list_h = '';
    $(array_h).each(function(count){
      if(this.tag === 'H1'){
        list_h += '<li class="lv-1"><a href="#' + this.id + '">' + this.text + "<\/a><\/li>\n";
      }else if(this.tag === 'H2'){
        list_h += '<li class="lv-2"><a href="#' + this.id + '">' + this.text + "<\/a><\/li>\n";
      }
    });

    var render_list = '<' + list_type + ' class="list-group">' + list_h + '<\/' + list_type + '>';

    $('#qa_chapter')
      .html(render_list)
      .addClass('panel panel-info');
     $('#qa_chapter li.lv-1')
       .addClass('list-group-item btn-default')
       .css('font-size', 'large');
     $('#qa_chapter li.lv-2').addClass('list-group-item');

    $('#qa_render').addClass('panel panel-info');
    $('#qa_render h' + header_start)
      .addClass('panel-heading')
      .css('margin-top', '0');
    $('#qa_render h' + header_next)
      .addClass('panel-heading')
      .css('margin', '0.5em').css('padding', '0.2em');
    $('#qa_render p')
      .addClass('panel-body')
      .css('margin', '0.5em');
  });
});
