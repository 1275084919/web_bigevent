$(function(){
    getUserInfo()
})
function getUserInfo(){
$.ajax({
    method:'GET',
    url:'/my/userinfo',
    //请求头对象就是登录是返回的密钥
    headers:{
        // 改去base那里了
        // Authorization:localStorage.getItem('token') || ''
    },
    success:function(res){
        if (res.status !==0){
            return layui.layer.msg('获取用户信息失败')
        }
        // 调用渲染头像token
        renderAvatar(res.data)
        // console.log(res.data)
    },//不论成功还是失败，最终都会调用 complete 回调函数
    //  complete:function(res){
    //     if (res.responseJSON.status === 1 || res.responseJSON.message === '身份认证失败!'){
    //         //  清空token
    //         localStorage.removeItem('token');
    //         // 转跳登录页
    //         location.href = './login.html'
    //      }
    //  }
})
}
$('#btnLoginout').on('click',function(){
layer.confirm('is not?', {icon: 3, title:'提示'}, function(index){
    // 清除toke
    localStorage.removeItem('token');
    // 转跳登录页
    location.href = './login.html'
    // 关闭提示框
    layer.close(index);
  });       
})
// 渲染用户头像
function renderAvatar(user){
    var name = user.nickname  || user.username;
    $('#welcome').html('欢迎&nbsp &nbsp'+name);
    if (!user.user_pic){
                // console.log('无头像')+渲染文本头像
        $('.layui-nav-img').hide()
        var firstname = name[0];
        $('.text-avatar').html(firstname);
    }else{
        console.log('have头像');
        $('.text-avatar').hide();
        $('.layui-nav-img').attr('src',user.user_pic).show();

    }
}

