

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
//    document.getElementById('qa_render').innerHTML = converter.makeHtml(read_md);
    var conv_md = converter.makeHtml(read_md);
    var qa_render = new Vue({
      el: '#qa_render',
      data: {
        vue_render: conv_md
      }
    })

    //目次を作る
    var list_type = (list_type_is_number === true) ? 'ol' : 'ul';
    var header_next = header_start + 1;
    var selector_header = '#qa_render h' + header_start + ', #qa_render h' + header_next;

    //目次のデータを必要なものだけ配列に取得
    var array_h = [];
    $(selector_header).each(function(count){
      //走査中のheaderタグのレベル（階層）を判別
      var level = check_header(this.nodeName,header_start);

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
    //render_list = $.parseHTML(render_list);

    var qa_chapter = new Vue({
      el: '#qa_chapter',
      data: {
        vue_chapter: render_list
      }
    })

    $('#qa_chapter')
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

/**
 * 走査中のheaderタグのレベル（階層）を判別
 * @param   string nodename 走査中ノードのheaderタグ
 * @param   string h_start  ヘッダレベル１に該当するタグ
 * @returns int レベル
 */
function check_header(nodename,h_start){
  var h_next = h_start + 1;
  if(nodename === 'H' + h_start){
    return 1;
  }else if(nodename === 'H' + h_next){
    return 2;
  }else{
    return 2;
  }
}
