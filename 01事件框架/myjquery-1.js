var $ = {
	//事件代理
   delegate: function(context,subNode,type,fun){ //父元素,子元素,事件类型,函数
           //给context添加事件
        context.addEventListener(type,function(event){
          //如果subNode与event.target.nodeName(目标元素的标签名相同)
          //或者subNode与event.target.className(目标元素的类名)
             if(event.target.nodeName.toLowerCase()==subNode ||
             	event.target.className ==subNode.subString(1)){ 
             	//事件发生时，调用fn方法,同时改变fn函数中的作用域this
               fun.call(event.target);//作用域变成目标元素
             }
           });
     },
     //去掉字符串的空格
   trim: function(str){
     	return str.replace(/^\s+|\s+$/g,'');
     },

    //添加事件
   on:  function(dom,type,fn){
   	//判断是否支持addEventListener
   	if(dom.addEventListener){
   		dom.addEventListener(type,function(event){
        //更改fn方法的作用域，同时传递事件对象
        fn.call(dom,$.getEvent(event));
        
      },false); //false取消冒泡
   	}else{
   		//IE
   		dom.attachEvent('on'+type,fn);
   	}
   },


    click:function(dom,fn){
       this.on(dom,'click',fn);
    },

    mouseenter:function(dom,fn){
      this.on(dom,'mouseenter',fn);
    },
 
   //移除事件
   off: function(dom,type,fn){
     //判断是否支持removeEventListener
     if(dom.removeEventListener){
      dom.removeEventListener(type,fn,false);
     }else{
      dom.detachEvent('on'+type,fn);
     }
   },

   //获取事件对象
   getEvent: function(event){
   	 return event||window.event;
   },
   //获取目标元素
   getTarget:function(event){
   	var event = event||window.event;
   	return event.target||event.srcElement;
   },
   //阻止冒泡
   stopPropa:function(event){
   	 var event = event||window.event;
   	 if(event.stopPropagation){
   		event.stopPropagation();
   	 }else{
   	 	event.cancleBubble = true;
   	 }
   },
   //阻止默认事件
   preventDe : function(event){
   	 var event = event||window.event;
   	 if(event.preventDefault){
   	 	event.preventDefault();
   	 }else{
   	 	event.returnValue = true;
   	 }
   }



}