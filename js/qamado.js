$(function(){
  // ファイルパス
  var file_md = '../sample.md';
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
    var html_md = converter.makeHtml(read_md);

    //目次を作る
    var list_type = (list_type_is_number === true) ? 'ol' : 'ul';
    var header_next = header_start + 1;
    var selector_header = '#qa_render h' + header_start + ', #qa_render h' + header_next;

    //目次のデータを必要なものだけ配列に取得

    var parse_md = $(html_md);

    var array_h = [];

    parse_md.each(function(count){
      if(this.id){

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
      }
    });

    //目次のデータを文字列にする
    var list_h = '';
    array_h.forEach(function(val,count){
      var this_array = this[count];
      var class_btn_def = (this_array.lv === 1) ? ' btn-default' : '';
      list_h += '<li class="lv-' + this_array.lv + class_btn_def + ' list-group-item"><a href="#' + this_array.id + '">' + this_array.text + "<\/a><\/li>\n";
    }, array_h);
    var render_list = '<' + list_type + ' class="list-group panel panel-info">' + list_h + '<\/' + list_type + '>';

    document.getElementById('qa_render').innerHTML = html_md;
    document.getElementById('qa_chapter').innerHTML = render_list;

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
