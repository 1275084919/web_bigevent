$(function(){
    layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    
    // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function(date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

    // 定义一个查询的的参数对象，以便于
    // 将来请求数据方便调整
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
      }

      // 自填表格数据列表
    initTable()
    function initTable(){
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data:q,
            success:function(res){
                // console.log(res)
                if(res.status !==0){
                    return layer.msg('获取列表失败')
                }
                // 使用模板引擎渲染数据，后对DOM元素操作
                var htmlStr = template('tpl-table',res)
                // console.log(htmlStr)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    // 自填充筛选下拉履历表
    initCate()
    function initCate(){
      $.ajax({
        method:'GET',
        url:'/my/article/cates',
        success:function(res){
          if(res.status !==0){
            return layer.msg('获取列表失败')
        }
        var htmlStr = template('tpl-cate',res)
        // console.log(htmlStr)
        $('#cate_id').html(htmlStr)
        // 由于分类列表在开始已经渲染完成，需要手动触发更新渲染
        form.render()
        }
      })
    }

    // 筛选
    $('#form-search').on('submit',function(e){
      e.preventDefault()
      var cate_id = $('[name="cate_id"]').val()
      var status = $('[name="state"]').val()
      q.cate_id = cate_id
      q.state = status
      initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total){
      layui.use('laypage', function(){
        var laypage = layui.laypage;
        
        //执行一个laypage实例
        laypage.render({
          elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
          ,count: total //数据总数，从服务端得到
          ,limit:q.pagesize  //每页显示多少条
          ,curr:q.pagenum  //默认选中哪一页
          ,limits:[2,4,6,8,10]
          ,layout:['count','limit','refresh','prev', 'page', 'next','skip']
          // layui提供的方法，curr是页码值
          ,jump:function(obj,first){
            //  console.log(obj.curr)
            q.pagenum = obj.curr
            q.pagesize = obj.limit
            if( !first){
              // initTable()会调用回renderPage(total)，导致死循环
              initTable()
            }
          }
        });
      });
    }

    // 删除文章的方法
    $('tbody').on('click','.btn-delete',function(){
      var id = $(this).attr('data-id')
      var len =$('.btn-delete').length
      layer.confirm('确认删除吗?', {icon: 7, title:'提示'}, function(res){
        $.ajax({
          method:"GET", 
          url:'/my/article/delete/'+id,
          success:function(res){
            layer.msg(res.message)
            if (len === 1){
              console.log(len)
              q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
            }
            initTable()
          }
          })
          
      })
      
    })


})