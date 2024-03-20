let records = [];
window.exports = {
    "calc": { // 注意：键对应的是 plugin.json 中的 features.code
       mode: "list",  // 列表模式
       args: {
          // 进入插件应用时调用（可选）
          enter: (action, callbackSetList) => {
             // 如果进入插件应用就要显示列表数据
             callbackSetList([
              ...records.map( item => ({
                title: item.expression,
                description: ' = ' + item.value,
                expression: item.expression,
                value: item.value,
              }))
             ])
             // 引入js计算类，解决精度问题
             require('./calculator.js');
          },
          // 子输入框内容变化时被调用 可选 (未设置则无搜索)
          search: (action, searchWord, callbackSetList) => {
             // 获取一些数据
             // 执行 callbackSetList 显示出来
             console.log("searchWord" , searchWord )
             const weightMap = {
               "+": 1,
               "-": 1,
               "*": 2,
               "/": 2,
               "%": 2,
               "(": 3,
               ")": 3,
               "^": 4
             };
             function preProcess(str){
              str = str.replaceAll(' '  , '');
              str = str.startsWith('-') ? '0' + str : str;
              str = str.replace(/\(-/g , '(0-');
              str = str.replace(/\(\+/g , '(0+');
              str = str.replace(/--/g , '+');
              str = str.replace(/\+[\+]*/g , '+');
              str = str.replace(/\+-/g , '-');
              str = str.replace(/-\+/g , '-');
              return str;
            }

             function infix2Sufix(str){
               var array = [];
               var stack = [];
               var digit = '';
               const strArray  = str.split('');
               for( var i = 0 ; i < strArray.length; i++){
                 if( weightMap[strArray[i]] ){
                   if( stack.length === 0 || strArray[i] == '(' ){
                     stack.unshift(strArray[i]);
                   }else if( strArray[i] == ')' ){
                     while( stack[0] !== '('){
                       var temp = stack.shift();
                       array.push(temp);
                     } 
                     stack.shift();
                   }else if( weightMap[strArray[i]] <= weightMap[stack[0]] ){
                     if( stack[0] == '(' ){
                       stack.unshift(strArray[i]);
                     }else{
                       array.push( stack.shift() );
                       i--;
                       continue;
                     }
                   }else{
                     stack.unshift(strArray[i]);
                   }
                 }else{
                   digit += strArray[i] + '';
                   if( i == strArray.length - 1 || weightMap[strArray[i+1]] ){
                     array.push(Number(digit));
                     digit = '';
                   }
                 }
                 // console.log("array" , array );
                 // console.log("stack" , stack );
               }
               while(stack.length){
                 array.push( stack.shift() );
               }
               return array;
             }
             
             function calc( array ){
               var stack = [];
               var a , b , operator;
               for( var i = 0; i < array.length; i++ ){
                 if( typeof Number(array[i]) === 'number' && !isNaN(Number(array[i]))  ){
                   stack.unshift( Number(array[i]) );
                 }else{
                   operator = array[i];
                   switch(operator){
                     case '+':
                       b = stack.shift();
                       a = stack.shift();
                      //  var b_len = (b.toString().split('.')[1] || '').length;
                      //  var a_len = (a.toString().split('.')[1] || '').length;
                      //  var multiple = Math.pow(10 , Math.max(b_len , a_len) );
                      //  var b_num = b * multiple;
                      //  var a_num = a * multiple;
                      //  stack.unshift( ( a_num + b_num ) / multiple );
                       stack.unshift(math.add(a , b));
                       break;
                     case '-':
                       b = stack.shift();
                       a = stack.shift();
                      //  var b_len = (b.toString().split('.')[1] || '').length;
                      //  var a_len = (a.toString().split('.')[1] || '').length;
                      //  var multiple = Math.pow(10 , Math.max(b_len , a_len));
                      //  stack.unshift(( a * multiple - b * multiple ) / multiple );
                       stack.unshift(math.sub(a , b));
                       break;
                     case '*':
                       b = stack.shift();
                       a = stack.shift();
                      //  var b_len = (b.toString().split('.')[1] || '').length;
                      //  var a_len = (a.toString().split('.')[1] || '').length;
                      //  var multiple = Math.pow(10 , Math.max(b_len , a_len));
                      //  stack.unshift( (a * multiple) * (b * multiple) / ( multiple * multiple ) ) ;
                       stack.unshift(math.mul(a , b));
                       break;
                     case '/':
                       b = stack.shift();
                       a = stack.shift();
                      //  var b_len = (b.toString().split('.')[1] || '').length;
                      //  var a_len = (a.toString().split('.')[1] || '').length;
                      //  var multiple = Math.pow(10 , Math.max(b_len , a_len));
                      //  stack.unshift( ( a * multiple ) / (b * multiple) / ( multiple * multiple ) );
                       stack.unshift(math.div(a , b));
                       break;
                     case '%':
                       b = stack.shift();
                       a = stack.shift();
                       stack.unshift( a % b );
                       break;
                   }
                 }
               }
               return stack[0];
             }

             var expression = preProcess(searchWord);
             var result = calc( infix2Sufix( expression ) );

             if( !isNaN( result ) ){
               callbackSetList([
                  {
                     title: result,
                     description: searchWord + ' = ' + result,
                     icon:'', // 图标
                     key: 'result',
                     expression: searchWord,
                     value: result,
                  },
                  {
                    title: result,
                    description: "继续下一步计算",
                    icon:'', // 图标
                    key: "next",
                    expression: searchWord,
                    value: result,
                  },
                  ...records.map( item => ({
                    title: item.expression,
                    description: ' = ' + item.value,
                    expression: item.expression,
                    value: item.value,
                  }))
               ])
             }
          },
          // 用户选择列表中某个条目时被调用
          select: (action, itemData, callbackSetList) => {
             const { key , title , expression , value} = itemData;
             if( key === 'next' ){
               utools.setSubInputValue(title);
               records.unshift({
                value: title + '',
                expression: expression,
              })
              records = records.slice(0, 5);
             }else{
               if( key === 'result'){
                records.unshift({
                  value: title,
                  expression: expression,
                })
                records = records.slice(0, 5);
               }
               utools.copyText(value+'')
               utools.hideMainWindow();
               utools.outPlugin()
             }
          },
          // 子输入框为空时的占位符，默认为字符串"搜索"
          placeholder: "请输入正确的运算表达式"
       } 
    }
}


 