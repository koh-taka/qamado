

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
      simplifiedAutoLink: true,
      tables: true,
      tablesHeaderId: true,
    });
    document.getElementById('qa_render').innerHTML = converter.makeHtml(read_md);

    //目次を作る
    var list_type = (list_type_is_number === true) ? 'ol' : 'ul';
    var header_next = header_start + 1;
    var selector_header = '#qa_render h' + header_start + ', #qa_render h' + header_next;

    //目次のデータを必要なものだけ配列に取得
    var array_h = [];
    $(selector_header).each(function(count){
      if(this.nodeName === 'H' + header_start){
        var level = 1;
      }else if(this.nodeName === 'H' + header_next){
        var level = 2;
      }else{
        var level = 2;
      }

      var t = {
        lv: level ,
        id: this.id ,
        text: this.innerHTML ,
      };
      array_h.push(t);
    });

    //目次のデータを文字列にする
    var list_h = '';
    $(array_h).each(function(count){
      list_h += '<li class="lv-' + this.lv + '"><a href="#' + this.id + '">' + this.text + "<\/a><\/li>\n";
    });

    var render_list = '<' + list_type + ' class="list-group">' + list_h + '<\/' + list_type + '>';
    render_list = $.parseHTML(render_list);


    $('#qa_chapter')
      .html(render_list)
      .addClass('panel panel-info');
    $('#qa_chapter li.lv-1')
      .addClass('list-group-item btn-default');
    $('#qa_chapter li.lv-2')
      .addClass('list-group-item');

    $('#qa_render')
      .addClass('panel panel-info');
    $('#qa_render h' + header_start)
      .addClass('panel-heading header_start');
    $('#qa_render h' + header_next)
      .addClass('panel-heading header_next');
    $('#qa_render p')
      .addClass('panel-body');
    $('#qa_render table')
      .addClass('container table table-bordered table-stripped');
    $('#qa_render table th')
      .addClass('info');
  });
});
