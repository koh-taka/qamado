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
    var mark_chapter = '';
    var currentlevel = 0;
    var list_type = (list_type_is_number === true) ? 'ol' : 'ul';
    var header_next = header_start + 1;
    var selector_header = '#qa_render h' + header_start + ', #qa_render h' + header_next;
    $(selector_header).each(function(idcount){
      idcount++;
      this.id = 'chapter-' + idcount;
      //隣接要素のpにはidを割り振る
      $(this).next('p').attr( 'id' , 'answer-' + idcount);

      var check_node = this.nodeName.toLowerCase();
      if(check_node == 'h' + header_start) { var level = 1; }
      else if(check_node == 'h' + header_next) { var level = 2; }

      while(currentlevel < level){
        mark_chapter += '<' + list_type + ' class="chapter">';
        currentlevel++;
      }
      while(currentlevel > level){
        mark_chapter += '<\/' + list_type + '>';
        currentlevel--;
      }
      mark_chapter += '<li class="lv-' + level + '"><a href="#' + this.id + '">' + $(this).html() + "<\/a><\/li>\n";
    });
    while(currentlevel > 0) {
      mark_chapter += '<\/' + list_type + '>';
      currentlevel--;
    }

    $('#qa_chapter')
      .html(mark_chapter)
      .addClass('panel panel-info');
    $('#qa_chapter ' + list_type)
      .addClass('list-group');
     $('#qa_chapter li.lv-1').addClass('list-group-item btn-info');
     $('#qa_chapter li.lv-1 a').css('color', 'white').css('font-size', 'large');
     $('#qa_chapter li.lv-2').addClass('list-group-item');

    $('#qa_render').addClass('panel panel-info');
    $('#qa_render h' + header_next).addClass('panel-heading');
    $('#qa_render p').addClass('panel-body');
  });
});
