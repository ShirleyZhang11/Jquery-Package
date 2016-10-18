//将$封装

function Squery(selector){
  this.selectAll(selector);
  // this.elements = [],//存储找到的节点
}
Squery.prototype ={
  //处理参数，将重复的封装
  hundleParams:function(arg){
    var node = typeof(arg)==='string' ? $.selectAll(arg):arg;
      //不是一个数组
    if(!node.length){
        node =[node];
     }
    return node;
  },

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
   on:  function(/*dom,*/type,fn){

    // var node = $.hundleParams(dom); 
    node = this.elements;
    for (var i = 0; i < node.length; i++) {
      addEvent(node[i],type,fn)
    }
    function addEvent(element,type,fn){
      //判断是否支持addEventListener
     if(element.addEventListener){    
         element.addEventListener(type,fn);
     }else{
      //IE
      element.attachEvent('on'+type,fn);
     }
    }
    
   },

  click:function(dom,fn){
       this.on(dom,'click',fn);
    },
   //鼠标移入
  mouseenter:function(dom,fn){
      this.on(dom,'mouseenter',fn);
    },
 
   //移除事件
   off: function(dom,type,fn){
    var node = $.hundleParams(dom); 
    for (var i = 0; i < node.length; i++) {
      removeEvent(node[i],type,fn)
    }
    function removeEvent(element,type,fn){
       //判断是否支持removeEventListener
       if(element.removeEventListener){
        element.removeEventListener(type,fn,false);
       }else{
        element.detachEvent('on'+type,fn);
       }
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
  class: function(cls,context){ //添加一个参数作为父元素
    
    var node = context || document;

    if (node.getElementsByClassName) {
            return node.getElementsByClassName(cls);
    }
    //找到页面中所有的元素*
    var nodeList = node.getElementsByTagName('*');
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
   tag: function(tag,context){
     var node = context ||document;
     return node.getElementsByTagName(tag);
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

  //层级选择器
  level:function(selector) {
      var parents =[];
      var temp = [];
      var arr = selector.split(' ');

     arr.forEach(function(element,index){
      //如果parents为空，则传入document
      if(!parents.length){
        parents.push(document);
      }   
      
      var firstChar = element.charAt(0);

      switch(firstChar){

          case '#':
          //一定要清空，不然temp中会重复，因为temp中保存的是上一次找到的节点
             temp =[];
             temp.push($.id(element.substring(1)));
           //将本次找到的节点，放入到parents中，以备下次查询
             parents = temp;
           break;

          case '.': //.box
            temp=[];
            //拿出所有的父亲  temp[box]
            for(var i = 0;i<parents.length;i++){
              //找出parents[i]下面的所有类目为box的节点
              var r = $.class(element.substring(1),parents[i]); 
              //将r数组中的内容全部保存到temp中           
              Array.prototype.push.apply(temp,r);
            }
            parents = temp;
           break;

          default:
           temp=[];//.box #item
           for(var i =0;i<parents.length;i++){
            //找出parents[i]下面的所有标签名为...的节点
            var r = $.tag(element,parents[i]);
            Array.prototype.push.apply(temp,r);
           }
           parents = temp;
          break;
        }
      });
     //最后放回temp,不管循环了多少次，最后temp总是保存了最后一次找到的内容
     return temp;
    },

   //组合加选择
  selectAll: function(selector){
    if (document.querySelectorAll) {

       this.elements=document.querySelectorAll(selector);
        return this;
      }
    var result = [];
    var arr = selector.split(',');
   // .box div p,.demo h1 
    arr.forEach(function(elememt,index){
      //使用层级选择器获取到指定的元素
      var temp = $.level(elememt);
      for(var i=0;i<temp.length;i++){
        //将获取到的元素存入到result
        result.push(temp[i]);
      }

    });
    // return result;
    this.elements=result;
    return this;
   },
 //css样式
  css:function(/*element,*/key,value) {
   /*
    var node = typeof(element)==='string' ? $.selectAll(element):element;
      //不是一个数组
    if(!node.length){
        node =[node];
     }
     */ 
     node = this.elements;
    for (var i = 0; i < node.length; i++) {
            //设置
        if(value){
          setStyle(node[i],key,value);
        }else{
          return getStyle(node[0],key);
        }
      }
      return this; //返回的是$对象
     //console.log(this) ;

     //获取计算后的样式//如果没有传入value值，则代表获取
       function getStyle(dom, key) {
            if (dom.currentStyle) {
                return dom.currentStyle[key];
            } else {
                return getComputedStyle(dom, null)[key];
            }
        }
        function setStyle(dom, key, value) {
            dom.style[key] = value;
        }
    }
}
//在这里new对象
function $(selector){
  return new Squery(selector);
}