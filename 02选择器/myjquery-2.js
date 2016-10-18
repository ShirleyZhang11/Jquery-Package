//修改了class和tag选择器

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
      //使用此种方法就没办法移除事件了
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
   },

   //类选择器
  //兼容性不好：document.getElementsByClassName('')   
  class: function(cls){

    
    //找到页面中所有的元素*
    var nodeList = document.getElementsByTagName('*');
    //创建空数组，准备存放找到的元素
    var result = [];
    //循环找到的所有标签
    for(var i=0;i<nodeList.length;i++){
      //取出标签的类目//className是原本在html标签中写的class="box selected"
      var classname = nodeList[i].className; 
      //如果存在类名
      if(classname){
        //classname = box selected 
        //将元素的类名分割成数组
        var arr = classname.split(' ');
        //循环类名数组
       for(var j=0;j<arr.length;j++){
            if(arr[j]==cls){
          //将符合条件的元素加入到数组
          result.push(nodeList[i]);
        }
      }
      }      
    }
    return result;
   },

   //id 
   id :function(id){
     return document.getElementById(id);
   },

   //tag
   tag: function(tag){
     return document.getElementsByTagName(tag);
   },
 
   //组合选择器
  group: function(selector) {
     var result = [];
    //分割字符串
     var arr = selector.split(','); 
    //循环数组
     arr.foreach(function(element,index){
      //取出第一个字符
      var firstChar = element.charAt(0);
      switch(firstChar){
        //类名
        case '.':
          //数组
              var r1 = $.class(element.substring(1));
              //将一个数组加到另一个数组里面的方法
              Array.prototype.push.apply(result,r1);
             //或者调用外面的方法
              //handelArr(r1)
         break;
         //id
        case '#':
           //id不是数组将其转成数组
              var r2 = [$.id(element.substring(1))]; 
              Array.prototype.push.apply(result,r2);
              //handelArr(r2)
         break;
           //tag
          default:
             //数组
           var r3 = $.tag(element);
           Array.prototype.push.apply(result,r3);
           //handelArr(r3)
          break;
      }

    });
    // function handleArr(array){
    //  for(var i=0;i<array.length;i++){
    //    result.push(array[i]);
    //  }
    // }
    return result;
  },



}