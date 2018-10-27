(function (window,Vue) {
	/**isFinish为true 则表示完成 有横线 有completed
	 * isFinish为false  则表示没完成 没有横线
	 * 所以可以绑定动态:class={}值为对象 completed 是由isFinish来决定的 为true则有横线
	 */

	// 1.自己准备一个数组
	// var arr = [
	// 	{
	// 		id:1,
	// 		content:'abc',
	// 		isFinish:true
	// 	},
	// 	{
	// 		id:2,
	// 		content:'abc',
	// 		isFinish:false
	// 	},
	// 	{
	// 		id:3,
	// 		content:'abc',
	// 		isFinish:true
	// 	}
	// ]
	// 2 因为用的是vue 所以所有的数据都在data中声明 在data中把数组添加进去
	// 3 section和footer区域决定显示和不显示 
	//   如果dataList.length===0则第二个section和footer就不显示
	// 4 列表渲染
	// 5 数据联动 input标签添加v-model属性  可以实现数据双向绑定效果 视图改变数据改变 数据改变视图改变
	// 6 添加todo 方法写在methods中
	// 7 持久化存储  删除要存   新增要存 isFinish改变要存  内容改变要存 只要数组有变化 数组里的每一项都要存
	// watch 监听dataList的变化  要开启deep：true深度监听  可以检测到isFinish的变化
	// 8 计算isFinish里有多少个为false的 根据当前显示的false 情况显示左下角几个没有完成的
	// 9 渲染右下角的全选按钮  如果全为false  就隐藏   如果有一个为true就显示 completed===dataList.length则表示全为false 
//     10 删除一个  根据index从数组里 用splice方法  传入index  删除个数1
//     11 删除所有  遍历所有为true  的 返回新数组删除
	new Vue({
		el:'#app',
		data:{
			dataList:JSON.parse(window.localStorage.getItem('dataList')) || [],
			newTodo:''
		},
		// 自定义属性  获取光标
		directives:{
			focus:{
				inserted:function(el){
					el.focus();
				}
			}
		},
		methods:{
			// 添加todo
			addTodo(){
				// 非空验证
				if(!this.newTodo.trim()) return;
				// 把新建的对象放入数据中
				this.dataList.push({
					// 排好序去最后的一项id+1就是我们需要的id 如果没有数据  则id为1
					id:this.dataList.length?this.dataList.sort((a,b)=> a.id-b.id)[this.dataList.length-1]['id']+1:1,
					content:this.newTodo.trim(),
					isFinish:false
				});
				// 清空文本框
				this.newTodo=''
			},
			// 删除一个
			delTodo(i){
				this.dataList.splice(i,1);
			},
			// 删除所有
			delAllTodo(){
			  this.dataList=this.dataList.filter(item=>!item.isFinish);
			}
			
		},
		watch:{
			dataList:{
				handler(newArr){
					// 把数据变化的存入localstorage
					window.localStorage.setItem('dataList',JSON.stringify(newArr));
				},
				deep:true
			}
		},
		computed:{
			completed(){
			const array = this.dataList.filter(item=> item.isFinish===false);
			return array.length;
			},
			// 全选反选
			// 完整写法
			allTodo:{
				get(){
					// 遍利每一项  如果都为true 才返回true 
					return	this.dataList.every(items=>items.isFinish);
				},
				set(val){
					this.dataList.forEach(items=>items.isFinish=val);
				}
			}
		}
	})
})(window,Vue);
