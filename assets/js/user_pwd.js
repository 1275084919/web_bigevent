$(function(){
    var form =layui.form
    var layer =layui.layer

    form.verify({
        pwd:[
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ] ,
          samepwd:
              function(value){
                  if (value === $('[name=oldPwd]').val()){
                      return '密码不能和旧密码相同'
                  }
              },
            repwd:function(value){
                if (value != $('[name=newPwd]').val()){
                    return '请确认两次密码输入一致'
                }
            }
    })
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/updatepwd',
            data: $(this).serialize(),
            success:function(res){
                if (res.status != 0){
                   return layer.msg(res.message)
                }
                layer.msg(res.message)
                $('#resetpwd').click()
            }
        })
    })
})