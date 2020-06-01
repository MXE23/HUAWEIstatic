


;(function($){

    $(function(){
        let id = getQueryVariable("id")
        $.get("http://localhost:1001/main3",function(data){
            $(data).each(function(item){
                if(data[item].id == id){
                    $('.allPrice').text(data[item].price);
                     let str = `
                    
                   
                    <div class="box">
                        <div class="zoom"></div>
                        <img class="smallSize" src="../${data[item].src}" />
                    </div>
                    
                    `; 
                    let intro = ` <h3>${data[item].title}</h3><p class="price">价格${data[item].price}</p>`;
    
                    $("#deConnect").html(str);
                    $(".bigSize").html(`<img src="../${data[item].src}" />`);
                    
                    
                    $("#base").prepend(intro);
    
                   
    
                    $('.add').click(function(){
                        $('#addnum').val(+$('#addnum').val()+1);
                        $('.allPrice').text($('#addnum').val() * data[item].price);
                    });
                    
                    $('.sub').click(function(){
                        if($('#addnum').val() > 1){
                             $('#addnum').val(+$('#addnum').val()-1);
                             $('.allPrice').text($('#addnum').val() * data[item].price);
                        }
                    });
    
                    $('#addnum').change(function(){
                        $('.allPrice').text($('#addnum').val() * data[item].price);
                    });
    
                    $(".addCart").click(function(){
                        let user = JSON.parse(localStorage.getItem("userData")); 
    
                        if(user){
                            var url = "1003/userData/"+user.id;
                        }else{
                            var url = "1002/data"
                        }
    
                        $.get("http://localhost:"+url,function(data){ 
							console.log(data)
                            if(data.cartData){
                                var cartData =  JSON.parse(data.cartData);
                            }else{
                                var cartData = [];
                            }
    
                            console.log(cartData);
                            if(cartData != ""){
                               //console.log(cartData)
                                $(cartData).each(function(item){
                                    if(cartData[item].id == id){
                                        
                                        let num = Number(cartData[item].num);
                                        let price = Number(cartData[item].price);
    
                                        cartData[item].num = num+Number($('#addnum').val());
                                        cartData[item].price = Number($('.allPrice').text())+price;
                                           console.log( cartData[item].num,cartData[item].price) 
                                            let obj = JSON.stringify(cartData);
                                            $.ajax({
                                            type:"patch",
                                            url:"http://localhost:"+url,
                                            data:{cartData:obj}
                                        });
                                    } else{
                                        console.log("aa");
                                        let obj = {id:id,num:$('#addnum').val(),price:+$('.allPrice').text()}
                                        cartData.push(obj);
                                        cartData = JSON.stringify(cartData);
                                        $.ajax({
                                            type:"patch",
                                            url:"http://localhost:"+url,
                                            data:{cartData:cartData}
                                        });
                                    }
                                })
                            
                            }else{
                                console.log("aa");
                                let obj = [{id:id,num:$('#addnum').val(),price:+$('.allPrice').text()}]
                                obj = JSON.stringify(obj);
                                $.ajax({
                                    type:"patch",
                                    url:"http://localhost:"+url,
                                    data:{cartData:obj}
                                });
                            }
                            
                        })
                        
                    });
                }
            })
            /*放大镜*/ 
            $(".box").hover(function(){
                $(".zoom").css("display","block");
                $('.bigSize').css("display","block");
            },
            function(){
                $(".zoom").css("display","none");
                $('.bigSize').css("display","none");
            });
            $(".box").mousemove(function(e){
                let x = e.pageX - $(".box").offset().left - $(".zoom").outerWidth()/2;
                let y = e.pageY - $(".box").offset().top - $(".zoom").outerHeight()/2;
               
                let mw = $(".box").outerWidth() - $(".zoom").outerWidth();
                let mh = $(".box").outerHeight() - $(".zoom").outerHeight();
              
                x = x < 0 ? 0 : x > mw ? mw : x;
                y = y < 0 ? 0 : y > mh ? mh : y;
                
                $(".zoom").css({"left":x,"top":y}); 
                $('.bigSize img').css({"left":-x*2,"top":-y*2});
            })
    
        });
    
    
    });
    
    
    
    
    })(jQuery);