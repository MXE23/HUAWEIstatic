
//export default indexMain; 
$(function () {


	; (function ($) {
		$('#top_banner-s1').click(function () {
			$('.top_banner-s').css('display', "none");
		})


		/*轮播*/
		function move(i) {
			$('.top_banner1 li').eq(i).stop().fadeIn().siblings().stop().fadeOut();
			$('.banner_point span').eq(i).css("background", "#FFF").siblings().css("background", "none")
		}


		var i = 0;
		var timer = setInterval(function () {
			i++;
			if (i == $('.top_banner1 li').length) {
				i = 0;
			}
			move(i);
		}, 3000);
		/*移入移出事件*/
		function domhover(dom) {
			dom.hover(function () {
				clearInterval(timer);

			}, function () {
				timer = setInterval(function () {
					i++;
					if (i == $('.top_banner1 li').length) {
						i = 0;
					}
					move(i);
				}, 3000);
			})
		}

		domhover($('.top_banner'));
		//domhover($('.hov'));
		// domhover($('.banner_point span'));
		// domhover($('.banner_nav'));
		// domhover($('.banner_nav-a'));
		/*圆点*/
		$('.banner_point span').mouseover(function () {
			let index = $(this).index();
			console.log(index);
			move(index);
		})

		/*左右按钮*/
		$('.banner_nav-a a').eq(0).click(function () {
			i--;
			if (i < 0) {
				i = $('.top_banner1 li').length - 1;
			}
			move(i);
		})
		$('.banner_nav-a a').eq(1).click(function () {
			i++;
			if (i == $('.top_banner1 li').length) {
				i = 0;
			}
			move(i);

		})
	})(jQuery);

	function indexMain() {
		/* 二级菜单*/
		; (function ($) {
			$('.nav_a').hover(function () {
				$(this).css("background", "#FFF");
				$(this).find('div').css("display", "block");
				$(this).find('i').css("background-position-x", "-85px");
			}, function () {
				$(this).find('div').css("display", "none");
				$(this).find('i').css("background-position-x", "-71px");
				$(this).css("background", "#f9f9f9");
			})

			$('.banner_nav2').hover(function () {
				$(this).find('.banner_nav1').css({ "display": "block" })
				$(this).css("background", "#FFF");
			}, function () {
				$(this).find('.banner_nav1').css("display", "none");
				$(this).css("background", "rgba(255, 255, 255, 0.7)");
			})
		})(jQuery);

		/*购物车按钮*/

		$('.cart_btn ,#cart').click(function () {
			window.open('http://localhost:8080/html/cart.html');
		});


		$('.cart_btn').hover(function () {

			let user = JSON.parse(localStorage.getItem("userData")); 
    
			if(user){
				var url = "1003/userData/"+user.id;
			}else{
				var url = "1002/data"
			}


			$(this).css("background", "#FFF");
			$('.cartList').css("display", "block");
			$.get("http://localhost:" + url, function (data) {
				if(user){
					data = JSON.parse(data.cartData);
				}
				$.get("http://localhost:1001/main3", function (data2) {
					let str = "";
					let oUl = document.createElement("ul");
					$(data).each(function (item) {
						$(data2).each(function (index) {
							if (data[item].id == data2[index].id) {
								str += `
							<li>
								<a href="">
									<img src="${data2[index].src}" />
									<div>
										<p>${data2[index].title}</p>
										<span>×${data[item].num}</span>
										<span class="price">￥${data2[index].price}</span>
									</div>
								</a>
							</li>`
							}
						});
					});
					let btn = '<input type="button" value="去结算" class="pay" />'
					$(oUl).html(str + btn);
					//console.log(str);
					$('.cartList').html($(oUl));
				})
				$.get("http://localhost:" + url, function (data) {
					let num = 0;
						if(user){
							data = JSON.parse(data.cartData);
						}
					$(data).each(function (item) {
						if (data[item].num) {
							num += Number(data[item].num);
						}
					})
					//console.log(num);
					$(".prodnum").text("(" + num + ")");
				})


			})
			$('.pay').click(function () {
				window.open('http://localhost:8080/html/cart.html')
			})

		}, function () {
			$(this).css("background", "#F2F2F2");
			$('.cartList').css("display", "none");
		})
	}
	indexMain();




	/*公告*/
	$.get("http://localhost:1001/announce", function (data) {

		let oDiv = document.createElement("div");
		for (let i = 0; i < data.length; i++) {
			oDiv.innerHTML += `<p>${data[i]}<p>`;
		}
		$(".banner_nav_a3").append($(oDiv));

		let count = 0;
		setInterval(function () {
			count++;
			if (count == data.length) {
				count = 0;
			}
			$(oDiv).stop().animate({ top: -10 - count * 30 });
		}, 2000);
	})
	/* 轮播图数据 */
	$.get("http://localhost:1001/banner", function (data) {
		let str = ""
		$(data).each(function (item) {
			str += `<li><img src = "${data[item].src}"></li>`
		})
		$(".top_banner1").html(str);
	})
	/*商品列表*/
	$.get(" http://localhost:1001/main3", function (data) {
		let str = "";
		let oUl = document.createElement("ul");
		for (let item = 0; item < 8; item++) {
			if (data[item].type == "hot") {
				var sp = `<span class="hot">${data[item].label}</span>`
			} else if (data[item].type == "cold") {
				var sp = `<span class="cold">${data[item].label}</span>`
			} else {
				var sp = "";
			}

			str += `
			<li>
		        <a href="javascript:;" class="detail" data-id="${data[item].id}">
		        	${sp}
		            <img src="${data[item].src}" alt="">
		            <h3>${data[item].title}</h3>
		            <p>${data[item].intro} </p>
		            <h4>￥${data[item].price}</h4>
		        </a>
	         </li>
			`

		}
		oUl.innerHTML = str;
		$('.main-a3').html($(oUl));


		$(".detail").click(function () {
			let attr = $(this).attr("data-id");
			window.open('/html/detail.html?id=' + attr);
		})
	})

	/*手机页*/
	$.get("http://localhost:1001/phone", function (data) {
		let str = "";
		let advt = '<li><a href="javascript:;"><img src="src/img/advert2.png" alt=""></a></li>';
		let cName = "";
		$(data).each(function(item){
			str += `
			<li class="${cName}">
				<a href="javascript:;" class="detail" data-id="${data[item].id}">
					<img src="${data[item].src}" alt="" />
					<h3>${data[item].title}</h3>
					<h4>${data[item].intro}</h4>
					<p>¥${data[item].price}</p>
				</a>
			</li>
			`
		})
		
		$(".phoneList").html(advt);
		$('.phoneList').html($('.phoneList').html()+str);

		//console.log(str);

		$(".detail").click(function () {
			let attr = $(this).attr("data-id");
			window.open('/html/detail.html?id=' + attr);
		})
	})
 


	/* 楼梯 */

	$(".box-right1 a").hover(function () {
		$(this).find('span').css("display", "block");
	}, function () {
		$(this).find('span').css("display", "none");
	})

	window.onscroll = function () {
		let st = $('html').scrollTop();
		let arr = [$(".phone").offset().top, $(".computer").offset().top, $(".main-pb1").offset().top, $(".main-zn1").offset().top];

		if (st >= $('.main-c1').offset().top - 300 && st < $('.main-d').offset().top) {
			$('.box-right').stop().fadeIn();
		} else {
			$('.box-right').stop().fadeOut();
		}

		for (let i = 0; i < arr.length; i++) {
			if (st >= arr[i] - 300 && st < arr[i] + 325) {
				$('.box-right li').eq(i).find("i").css({ "display": "block" })
					.end().siblings().find("i").css({ "display": "none" })
				$('.box-right li').eq(i).find("a").css("color", "#000")
					.end().siblings().find("a").css("color", "#AAA")
			}
			$('.box-right li').eq(i).click(function () {
				$('html').stop().animate({ scrollTop: arr[i] }, 500);
			})
		}


	}

	/* 广告列表接口 */
	$.get("http://localhost:1001/advertList", function (data) {
		let str = ""
		$(data).each(function (item) {
			str += ` <li><a href="javascript:;"><img src="${data[item]}" alt=""></a></li>`
		})
		$('.advertList').html(str);
	})


		/*左右轮播 */
		; (function () {
			let count = 0;
			$('.rightBtn').click(function () {
				count++;
				if (count == 1) {
					$('.rightBtn').css("display", "none");
				}
				$('.main-b2 ul').stop().animate({ "left": -1200 * count })
				if ($('.main-b2 ul').css("left") != 0) {
					$('.leftBtn').css("display", "block");
				}
			})
			$('.leftBtn').click(function () {
				count--;
				if (count == 0) {
					$('.leftBtn').css("display", "none");
				}
				$('.main-b2 ul').stop().animate({ "left": 1200 * count })
				if ($('.main-b2 ul').css("left") != 0) {
					$('.rightBtn').css("display", "block");
				}
			})
		})();



	/* 搜索框接口 */
	(function () {

		$('.searchItem').on('input', function () {
			let url = "https://suggest.taobao.com/sug?code=utf-8&q=" + $('.searchItem').val() + "&callback=?"

			$('.searchTxt1,.searchTxt2').css('display', 'none');

			if ($('.searchItem').val().length == 0) {
				$('.box_a').css('display', 'none');
			} else {
				$('.box_a').css('display', 'block');
			}


			$.getJSON(url, function (data) {
				//console.log(data);
				let str = "";
				$(data.result).each(function (item) {
					str += `<li><a href="">${data.result[item][0]}</a></li>`
				})
				$('.box_a ul').html(str);

			})
		})
		$('.searchItem').blur(function () {
			$('.box_a').css('display', 'none');
			$('.searchTxt1,.searchTxt2').css('display', 'block');
		})
	})();

	/*回到顶部*/
	; (function ($) {
		$("#goTop").click(function () {
			$("html").stop().animate({ scrollTop: 0 }, 800);
		});
	})(jQuery);


	/*推荐列表*/


	$.get("http://localhost:1001/recommen", function (data) {
		let str = "";
		$(data).each(function (item) {
			if (data[item].type == "hot") {
				var sp = `<span class="hot">${data[item].label}</span>`
			} else if (data[item].type == "cold") {
				var sp = `<span class="cold">${data[item].label}</span>`
			} else {
				var sp = "";
			}
			str += `
		<li>
		<a href="javascript:;" class="detail" data-id="${data[item].id}">
			<div>
				${sp}
				<img src="${data[item].src}" alt="">
				<h5>${data[item].intro}</h5>
			</div>

			<div>
				<p>${data[item].title}</p>
				<h4>￥${data[item].price}</h4>
			</div>
		</a>
	</li>
		`;
		})
		$(".recommenList").html(str);
		$(".detail").click(function () {
			let attr = $(this).attr("data-id");
			location.href = '/html/detail.html?id=' + attr;
		})
	})


	/*导航二级*/
	$('.banner_nav2').hover(function () {
		let index = $(this).index();
		$('.twoList').css("display", "none");
		$('.twoList').eq(index).css("display", "block");
	}, function () {
		$('.twoList').css("display", "none");
	})

	/*$(function(){})的另外一半*/


	/*登录模块*/
	let user = JSON.parse(localStorage.getItem("userData"));
	if (user) {
		$(".loginItem").html("欢迎" + user.name + '<a href="javascript:" class="logout">   注销</a>');
	} else {
		let str = `您好！请<a href="javascript:" class="login">登录</a> / 
	<a href="/html/register.html">注册</a>`;
		$(".loginItem").html(str);
	}

	$(".login").click(function(){
		$(".mainTab").css("display","block");
	})
	$('.logout').click(function () {
		localStorage.removeItem("userData");
		location.reload();
	})
	$(".cancel").click(function(){
		$(".mainTab").css("display","none");
	})

})

