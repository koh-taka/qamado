$(function(){
  // ファイルパス
  var file_md = 'qa.md';
  // リストは数字にするか黒丸にするか
  var list_type_is_number = false;
  // ヘッダの最初は何にするか 1ならh1とh2を取得
  var header_start = 1;
  var html_md = '';
  var render_list = '';

  $.ajax({
    url: file_md,
  }).done(function(read_md){
    var converter = new showdown.Converter({
      prefixHeaderId: true,
      headerLevelStart: header_start,
      simplifiedAutoLink: true,
      tables: true,
      tablesHeaderId: true,
    });

    html_md = converter.makeHtml(read_md);

    //目次を作る
    var list_type = (list_type_is_number === true) ? 'ol' : 'ul';
    var header_next = header_start + 1;
    var selector_header = '#qa_render h' + header_start + ', #qa_render h' + header_next;

    var parse_md = $(html_md);
    var list_h = '';

    parse_md.each(function(){
      if(this.id){

        //markdownの見出しを、階層レベルの値に変換
        var level = chkNodeName(this.nodeName, header_start);

        //liタグの中身を作成
        list_h += makeTagLi({
          lv: level ,
          id: this.id ,
          text: this.innerHTML
        });
      }
    });

    render_list = '<' + list_type + ' class="list-group panel panel-info">' + list_h + '<\/' + list_type + '>';

    document.getElementById('qa_render').innerHTML = html_md;
    document.getElementById('qa_chapter').innerHTML = render_list;

    var qa_r = $('#qa_render');

    qa_r.addClass('panel panel-info');
    qa_r.children('h' + header_start).addClass('panel-heading header_start');
    qa_r.children('h' + header_next).addClass('alert alert-info header_next');
    qa_r.children('table')
      .addClass('container table table-bordered table-stripped')
      .find('th').addClass('info');
  }).fail(function(data){
      document.getElementById('qa_render').innerHTML = 'エラー:Q&Aのファイルが読み込めません';
  });
});


/**
 * markdownの見出しを、階層レベルの値に変換
 * @param   {string} node_name h1,h2,h3...
 * @param   {int} h_start   configで指定した初期レベル
 * @returns {int} レベルの値 異常系でも2を出力
 */
function chkNodeName(node_name, h_start){
  var h_next = h_start + 1;
  if(node_name === 'H' + h_start){
    return 1;
  }else if(node_name === 'H' + h_next){
    return 2;
  }else{
    return 2;
  }
}


/**
 * liタグの中身を作成
 * @param   {object} t
 * @returns {string} li
 */
function makeTagLi(t){
  t = (t) ? t : {
          lv: 2 ,
          id: '' ,
          text: ''
        };

  var class_btn_def = (t.lv === 1) ? ' panel-heading' : '';
  return '<li class="lv-' + t.lv + class_btn_def + ' list-group-item"><a href="#' + t.id + '">' + t.text + "<\/a><\/li>\n";
}
