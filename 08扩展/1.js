//污染全局环境
function $() {
	alert(1);
}
function $1(){

}

//方法一:将所有的方法放在对象里,只有一个book污染而已
var book ={
	$:function(){

	},
	$1:function(){

	}
}
//提供给别人也用就直接用book. 
book.$();

//2、方法二:将所有的方法放在自执行函数里
(function(){
 	function $() {
		alert(1);
	}

	function $1(){

	}
	//提供给外面用，外面直接就可以用$();
	window.$=$;
	window.wxhl = $; //外面直接写wxhl();调用
})();

