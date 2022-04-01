$(function(){
  var layer = layui.layer
  var form = layui.form

  initArtCateList()

  // 获取文章分类的列表
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        console.log(res)
        var htmlStr = template('tpl-table',res)
        $('tbody').html(htmlStr)
            }
        })

        
    }


  // 为添加类别按钮绑定点击事件
var indexAdd = null
        $('#btnAddcate').on('click',function(){
          indexAdd = layer.open({
                type: 1,
                area: ['500px', '300px'],
                title: '添加文章分类'
                // content是使用哪一块的数据作为弹出层布局
                ,content: $('#dialog-add').html()
              });  
        })


// 通过代理的形式，为 form-add 表单绑定 submit 事件
$('body').on('submit', '#form-add', function(e){
  e.preventDefault()
  $.ajax({
    method: 'POST',
    url: '/my/article/addcates',
    data:$(this).serialize(),
    success: function(res) {
      if (res.status !== 0) {
        //提示失败返回信息
        return layer.msg(res.message)
      }
      initArtCateList()
      layer.msg('新增分类成功！')
      // 根据索引，关闭对应的弹出层
      layer.close(indexAdd)
    }
  })
})

  // 通过代理的形式，为 btn-edit 按钮绑定点击事件 并 设定窗口名为空，并自动获取对应数据填充入input框
     var indexEdit = null
$('tbody').on('click','.btn-edit',function(e){
  //  获取编辑事件相对应的ID值，后续需要对应修改或者删除
   var id = $(this).attr('data-id')
   console.log(id)
     // 弹出一个修改文章分类信息的层
   indexEdit = layer.open({
                type: 1,
                area: ['500px', '300px'],
                title: '修改文章分类',
                // content是使用哪一块的数据作为弹出层布局
                content: $('#dialog-edit').html()
              }); 
              $.ajax({
                method: 'GET',
                url: '/my/article/cates/' + id,
                success: function(res) {
                  // 使用了layui中的form功能，快速填充数据
                  form.val('form-edit', res.data)
                }
              })
  })


      // 通过代理给修改分类功能实现前后端交互，并实现数据修改
      $('body').on('submit','#form-edit',function(e){
        e.preventDefault()
        $.ajax({
          method:'POST',
          url:'/my/article/updatecate',
          data:$(this).serialize(),
          success:function(res){
            if (res.status !== 0) {
              return layer.msg(res.message)
            }
            layer.msg('更新分类数据成功！')
            initArtCateList()
            layer.close(indexEdit)
          }
        })
      })

      // 删除按钮功能的实现
      $('tbody').on('click',"#btn-delate",function(e){
        var id =$(this).attr('data-id')
        if (id<3){
          return layer.msg('前两条系统锁死不能删除')
        }
        layer.confirm('确认删除吗?', {icon: 7, title:'提示'}, function(index){
          $.ajax({
            method: 'GET',
            url: '/my/article/deletecate/' + id,
            success: function(res) {
              if (res.status !== 0) {
                return layer.msg('删除分类失败！')
              }
              layer.msg('删除分类成功！')
              // layer.close(index)
              initArtCateList()
            }
          })
        });
      })

})