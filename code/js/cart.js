(function () {

    $(function () {
        /*数据操作方法*/


        function setData(data){
        let user = JSON.parse(localStorage.getItem("userData"))
        if(user){
            var url = "1003/userData/"+user.id;
        }else{
            var url = "1002/data"
        }
           


            $.get("http://localhost:1001/main3", function (data2) {
                let str = "";
                let oUl = document.createElement("ul");
                $(data).each(function (item) {
                    $(data2).each(function (index) {
                        if (data[item].id == data2[index].id) {
                            str += `
                        <li>
                            <a href="javasript:">
                                <input type="checkbox" class="ensure">
                                <img src="../${data2[index].src}" class="prodImg" />
                                
                                <span class="title">${data2[index].title}</span>
                                <span class="price" data-price="${data2[index].price}">￥${data2[index].price}</span>
                                <div class="numBtn">
                                <button class="addBtn"><i class="iconfont icon-jjia-"></i></button>
                                    <input type="text" class="addnum" value="${data[item].num}" />
                                <button class="subBtn"><i class="iconfont icon-ziyuan"></i></button>
                                </div>
                                <span class="allPrice" price-all="${data[item].price}">￥${data[item].price}</span>
                                <input class="delBtn" value="删除" data-id="${data[item].id}" />
                            </a>
                        </li>`
                        }
                    });
                });
                let btn = `<label class="allCheck">
                <input type="checkbox">全选</label>
                <input type="button" value="去结算" class="pay" />
                <p id="allPrice">总价：<span>￥0</span></p>
                `
                $(oUl).html(str + btn);
                //console.log(str);
                $('.content').html($(oUl));

                /*计算总价*/
                function execPrice(){
                    

                    
                    $.get("http://localhost:"+url, function (data) {
                        let arr = [];
                        if(user){
                            data = JSON.parse(data.cartData);
                        }
                        
                        $(data).each(function (item) {
                            if (data[item].price) {
                                arr.push(data[item].price);
                            }
                        })

                        
                        let mainPrice = 0;
                        $('.ensure').each(function (item) {
                            if ($(".ensure").eq(item).prop("checked")) {
                                mainPrice += Number(arr[item]);
                            }
                        })
                        $('#allPrice span').text("￥" + mainPrice);
                    })
                    
                }

                
                /*删除功能*/
                $('.delBtn').click(function () {
                    //console.log(url)
                    let id = $(this).attr("data-id");
                    //console.log(id);
                    if(user){
                        $.get("http://localhost:"+url,function(data){
                            data = JSON.parse(data.cartData);
                            //console.log(data)
                           data =  data.filter(function(item){
                               return item.id != id;
                           })

                             data = JSON.stringify(data);
                             console.log(data)
                            console.log(data);
                            $.ajax({
                                type: "patch",
                                url: "http://localhost:"+url,
                                data: {cartData:data},
                                success: function (data) {
                                    //location.reload();
                                    execPrice(); 
                                }
                            });
                        });
                        
                     }else{
                        $.ajax({
                            type: "Delete",
                            url: "http://localhost:"+url+ "/" + id,
                            data: {},
                            success: function (data) {
                                $.get("http://localhost:"+url, function (data) {
                                    
                                    execPrice();  
                                })
                            }
                        });
                    }
                    $(this).parent().parent().detach();
                });

                /*按钮*/
                    $('.addBtn').each(function (item) {
                        /*加选按钮*/
                        $(".addBtn").eq(item).click(function () {
                            $('.addnum').eq(item).val(+$('.addnum').eq(item).val() + 1);
                            //console.log(item);
                            let id = $('.delBtn').eq(item).attr('data-id');
                            let price = $('.price').eq(item).attr('data-price');
                            $('.allPrice').eq(item).text("￥" + $('.addnum').eq(item).val() * price);

                            $.get("http://localhost:"+url, function (data) {
                                if(user){
                                    data = JSON.parse(data.cartData);
                                    data[item].price = $('.addnum').eq(item).val() * price;
                                    data[item].num = $('.addnum').eq(item).val();
                                    
                                    data = JSON.stringify(data)
                                   console.log(data)
                                    $.ajax({
                                        type: "patch",
                                        url: "http://localhost:"+url,
                                        data: {cartData:data},
                                        success:execPrice
                                    });
                                }else{
                                $.ajax({
                                    type: "put",
                                    url: "http://localhost:"+url+ "/" + id,
                                    data: { num: $('.addnum').eq(item).val(), price: $('.addnum').eq(item).val() * price },
                                    success:execPrice
                                });
                                }

                            })
                        })

                    /*减选按钮*/
                    $('.subBtn').eq(item).click(function () {
                        console.log(item)
                        if ($('.addnum').eq(item).val() > 1) {
                            $('.addnum').eq(item).val(+$('.addnum').eq(item).val() - 1);

                            let price = $('.price').eq(item).attr('data-price');
                            let id = $('.delBtn').eq(item).attr('data-id');
                            $('.allPrice').eq(item).text("￥" + $('.addnum').eq(item).val() * price);

                            
                                $.get("http://localhost:"+url, function (data) {

                                if(user){
                                    data = JSON.parse(data.cartData);
                                    data[item].price = $('.addnum').eq(item).val() * price;
                                    data[item].num = $('.addnum').eq(item).val();
                                    
                                    data = JSON.stringify(data)
                                   console.log(data)
                                    $.ajax({
                                        type: "patch",
                                        url: "http://localhost:"+url,
                                        data: {cartData:data},
                                        success:execPrice
                                    });
                                }else{
                                    
                                
                                $.ajax({
                                    type: "put",
                                    url: "http://localhost:"+url+ "/" + id,
                                    data: { num: $('.addnum').eq(item).val(), price: $('.addnum').eq(item).val() * price },
                                    success:execPrice
                                });
                             }
                            })
                            }

                            


                        

                    });
                    /*数值*/
                    $('.addnum').eq(item).change(function () {

                        let price = $('.price').eq(item).attr('data-price');
                        let id = $('.delBtn').eq(item).attr('data-id');
                        console.log(item, price, id);
                        $('.allPrice').eq(item).text("￥" + $('.addnum').eq(item).val() * price);


                        $.get("http://localhost:"+url, function (data) {

                            if(user){
                                data = JSON.parse(data.cartData);
                                data[item].price = $('.addnum').eq(item).val() * price;
                                data[item].num = $('.addnum').eq(item).val();
                                
                                data = JSON.stringify(data)
                               console.log(data)
                                $.ajax({
                                    type: "patch",
                                    url: "http://localhost:"+url,
                                    data: {cartData:data},
                                    success:execPrice
                                });
                            }else{
                                $.ajax({
                                    type: "put",
                                    url: "http://localhost:1002/"+url+ "/" + id,
                                    data: { num: $('.addnum').eq(item).val(), price: $('.addnum').eq(item).val() * price },
                                    success:execPrice
                                });
    
                            }

                        })
                    });

                })

                /*全选按钮*/
                $('.allCheck input').click(function () {
                    $.get("http://localhost:"+url, function (data) {
                        let checked = $('.allCheck input').prop("checked");
                      
                        $('.ensure').prop("checked", checked);
                        
                        execPrice();
                    })

                })
                /*单选按钮*/
                $('.ensure').click(function () {
                    $.get("http://localhost:"+url, function (data) {
                       
                        let num1 = $('.ensure:checked').length;
                        let num2 = $('.ensure').length;

                        $('.allCheck input').prop("checked", num1 == num2);


                        execPrice();
                    })


                })
            })
        }


        let user = JSON.parse(localStorage.getItem("userData"));
        /*获取购物车数据*/
        if(user){
            $.get("http://localhost:1003/userData/"+user.id, function (data) {
           
            let cartData = JSON.parse(data.cartData)
            console.log(cartData);
             setData(cartData);
            })
        }else{
            $.get("http://localhost:1002/data", function (data) {
            setData(data);
            })
        }
       

    })
})();