$(function(){
    // 点击取注册
    $('#link_reg').on('click',function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击取登录
    $('#link_login').on('click',function(){
        $('.reg-box').hide()
        $('.login-box').show()
    })
    // 通过layui调用form对象
    var form = layui.form
    var layer = layui.layer
    form.verify({
        pwd:[
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ],
          repwd :function(value){
            var pwd = $('.reg-box [name=password]').val()
            if(pwd !== value){
                return '两次密码不一致'
            }
          }
    })
})

// http://www.liulongbin.top:3007/
// 注册事件监听
$('#form_reg').on('submit', function(e) {
    // 先阻止默认提交行为
    e.preventDefault()
    var data = {
        username: $('#form_reg [name=username]').val(),
        password: $('#form_reg [name=password]').val()
      }
    $.post('/api/reguser',data,function(res){
        if (res.status !== 0) {
            return layer.msg(res.message)
        }
        layer.msg('注册成功，请登录！')
    })
})
// 登录事件监听
$('#form_login').on('submit',function(e){
        // 先阻止默认提交行为
    e.preventDefault()
    $.ajax({
        url:'/api/login',
        method:'POST',
        data: $(this).serialize(),
        success:function(res){
            if (res.status !== 0){
                return layer.msg(res.message)
            }
            localStorage.setItem('token', res.token)
            layer.msg('登陆成功，1秒后转跳主页')
            // 保存token后转跳主页
                location.href = 'index.html'
        }
    })
})

