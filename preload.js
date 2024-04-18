let records = [];
window.exports = {
    "calc": { // 注意：键对应的是 plugin.json 中的 features.code
       mode: "list",  // 列表模式
       args: {
          // 进入插件应用时调用（可选）
          enter: (action, callbackSetList) => {
            const { type , payload } = action || {};
            if( type === 'regex' ){
              const expression = payload;
              setTimeout( () => {
                utools.setSubInputValue(expression);
              } , 0 )
            }             
            callbackSetList([
              ...records.map( item => ({
                title: item.expression,
                description: ' = ' + item.value,
                expression: item.expression,
                value: item.value,
              }))
            ])
          },
          // 子输入框内容变化时被调用 可选 (未设置则无搜索)
          search: (action, searchWord, callbackSetList) => {

            console.log("searchWord" , searchWord )
             // 执行 callbackSetList 显示出来
             const Calc = require('./Calc.js');
             var calc = new Calc();
             var result = calc.count(searchWord);
      
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


 