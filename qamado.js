$(function(){

  // ファイルパス
  var file_md = 'sample.md';
  // リストは数字にするか黒丸にするか
  var list_type_is_number = false;

  //ファイルを取得してhtmlにレンダリング
  $.get(file_md, function(read_md){
    var converter = new showdown.Converter({
      prefixHeaderId: true
    });
    document.getElementById('qa_render').innerHTML = converter.makeHtml(read_md);

    //目次を作る
    var mark_chapter = '';
    var currentlevel = 0;
    var list_type = (list_type_is_number === true) ? 'ol' : 'ul';
    $('#qa_render h1, #qa_render h2').each(function(idcount){
      idcount++;
      this.id = "chapter-" + idcount;

      var check_node = this.nodeName.toLowerCase();
      if(check_node == "h1") { var level = 1; }
      else if(check_node == "h2") { var level = 2; }

      while(currentlevel < level){
        mark_chapter += '<' + list_type + ' class="chapter">';
        currentlevel++;
      }
      while(currentlevel > level){
        mark_chapter += '<\/' + list_type + '>';
        currentlevel--;
      }
      mark_chapter += '<li><a href="#' + this.id + '">' + $(this).html() + "<\/a><\/li>\n";
    });
    while(currentlevel > 0) {
      mark_chapter += '<\/' + list_type + '>';
      currentlevel--;
    }
    $("#qa_chapter").html(mark_chapter);
  });
});
