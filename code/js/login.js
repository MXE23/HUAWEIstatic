;(function($){


let userReg = /0?(13|14|15|18|17)[0-9]{9}/;
        let psdReg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
        let reg1 = /[a-z]/;
        let reg2 = /[A-Z]/;
        let reg3 = /[0-9]/; 

        $('.user input').on("input",function(){
            if(!userReg.test($('.user input').val())){
                $('.user p').css("display","block").text('请输入正确的用户名格式');
            }else{
                $('.user p').css("display","none").text('');
            }
        })

        $('.psd input').on("input",function(){
            let count1 = 0,count2 = 0,count3 =0;
            if(reg1.test($('.psd input').val())){
                count1 = 1;
            }
            if(reg2.test($('.psd input').val())){
                count2 = 1;
            }
            if(reg3.test($('.psd input').val())){
                count3 = 1;
            }
            switch(count1+count2+count3){
                case 1:
                    $('.psd p').css({"display":"block","background":"#ed3302"}).text('强度：低');
                break;
                case 2:
                    $('.psd p').css({"display":"block","background":"#f78115"}).text('强度：中');
                break;
                case 3:
                    $('.psd p').css({"display":"block","background":"#6ba001"}).text('强度：强');
                break;
            }
        })

        $('.psd input').blur(function(){
            if($('.psd input').val().length < 6 || $('.psd input').val().length > 20){
                $('.psd p').css({"display":"block","background":"#ed3302"}).text('密码长度应在6~20之间！');
            }else{
                $('.psd p').css({"display":"none"})
            }
            emptyItem($('.psd input'))
        })

        $('.user input').blur(function(){
            emptyItem($('.user input'));
        })


        function emptyItem(jq){
            if(jq.val().length == 0){
                jq.next().css({"display":"block","background":"#ed3302"}).text("该内容不能为空！");
            }
        }

        $('.login input').click(function(){
            if(!userReg.test($('.user input').val())){
                $('.user p').css("display","block").text('请输入正确的用户名格式');
            }
            if($('.psd input').val().length < 6 || $('.psd input').val().length > 20){
                $('.psd p').css({"display":"block","background":"#ed3302"}).text('密码长度应在6~20之间！');
            }
           if($('.psd input').val().length >= 6 && $('.psd input').val().length <= 20 && userReg.test($('.user input').val())){
                $.get("http://localhost:1003/userData",function(data){
                    let flag = false;
                    $(data).each(function(item){
                        if(data[item].id == $('.user input').val()){
                            flag = true;
                            if(data[item].psd == $('.psd input').val()){
                                alert("登录成功!");
                                let userData = JSON.stringify({name:data[item].name,id:data[item].id,psd:data[item].psd})
                                localStorage.setItem("userData",userData);
                                location.href = "http://localhost:8080"
                            }else{
                                alert("密码错误!");
                            }
                        }
                    })
                    if(!flag){
                        alert("该用户名不存在!");
                    }
                })
           }
        })
    })(jQuery);