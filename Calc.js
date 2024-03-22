const Operation = require('./Operation.js');
class Calc{
    constructor(){
        // 操作符优先级
        this.operatorPriorityMap = {
            "+": 1,
            "-": 1,
            "*": 2,
            "/": 2,
            "%": 2,
            "^": 3,
            "(": 4,
            ")": 4,
        }
        this.originExpression = '';
        this.expression = '';
        // 中缀表达式
        this.infixList = [];
        // 后缀表达式
        this.suffixList = [];
        // 计算结果
        this.result;
    }

    count(expression){
        this.originExpression = expression;
        this.expression = this.preProcess(this.originExpression);
        if( !this.originExpression || !this.expression ) return '';
        this.infixList = this.expression?.split('') || [];
        this.suffixList = this.infix2Sufix(this.infixList);
        this.result = this.calc(this.suffixList);
        return this.result;
    }

    // 表达式预处理，删除多余空格和符号
    preProcess(expression){
        expression = expression.replaceAll(' '  , '');
        expression = expression.startsWith('-') ? '0' + expression : expression;
        expression = expression.replace(/\(-/g , '(0-');
        expression = expression.replace(/\(\+/g , '(0+');
        expression = expression.replace(/--/g , '+');
        expression = expression.replace(/\+[\+]*/g , '+');
        expression = expression.replace(/\+-/g , '-');
        expression = expression.replace(/-\+/g , '-');
        return expression;
    }

    // 算法实现：
    // 首先需要准备一个作为临时存储运算符的栈operatorStack，一个作为输入逆波兰式的集合postFixList，逐序进行如下步骤：
    // （1）若取出的字符是操作数，则分析出完整的运算数，该操作数直接送入postFixList
    // （2）若取出的字符是运算符，则将该运算符与operatorStack栈栈顶元素比较，如果该运算符优先级(不包括括号运算符)大于operatorStack栈栈顶运算符优先级，则将该运算符进operatorStack栈，否则，将operatorStack栈的栈顶运算符弹出，送入postFixList 中，直至operatorStack栈栈顶运算符低于（不包括等于）该运算符优先级，最后将该运算符送入operatorStack栈。
    // （3）若取出的字符是“（”，则直接送入operatorStack栈顶。
    // （4）若取出的字符是“）”，则将距离operatorStack栈栈顶最近的“（”之间的运算符，逐个出栈，依次送入postFixList ，此时抛弃“（”。
    // （5）重复上面的1~4步，直至处理完所有的输入字符
    // 中缀表达式转后缀表达式（逆波兰表达式）
    infix2Sufix(infixList){
        var digit = '';
        var suffixList = [];
        var operatorStack = [];
        for( var i = 0 ; i < infixList.length; i++){
            if( this.operatorPriorityMap[infixList[i]] ){
            if( operatorStack.length === 0 || infixList[i] == '(' ){
                operatorStack.unshift(infixList[i]);
            }else if( infixList[i] == ')' ){
                while( operatorStack[0] !== '('){
                var temp = operatorStack.shift();
                suffixList.push(temp);
                } 
                operatorStack.shift();
            }else if( this.operatorPriorityMap[infixList[i]] <= this.operatorPriorityMap[operatorStack[0]] ){
                if( operatorStack[0] == '(' ){
                operatorStack.unshift(infixList[i]);
                }else{
                suffixList.push( operatorStack.shift() );
                i--;
                continue;
                }
            }else{
                operatorStack.unshift(infixList[i]);
            }
            }else{
            digit += infixList[i] + '';
            if( i == infixList.length - 1 || this.operatorPriorityMap[infixList[i+1]] ){
                suffixList.push(Number(digit));
                digit = '';
            }
            }
        }
        while(operatorStack.length){
            suffixList.push( operatorStack.shift() );
        }
        return suffixList;
    }

    calc(suffixList){
        var stack = [];
        var a , b , operator;
        for( var i = 0; i < suffixList.length; i++ ){
          if( typeof Number(suffixList[i]) === 'number' && !isNaN(Number(suffixList[i]))  ){
            stack.unshift( Number(suffixList[i]) );
          }else{
            operator = suffixList[i];
            switch(operator){
              case '+':
                b = stack.shift();
                a = stack.shift();
                stack.unshift(Operation.add(a , b));
                break;
              case '-':
                b = stack.shift();
                a = stack.shift();
                stack.unshift(Operation.sub(a , b));
                break;
              case '*':
                b = stack.shift();
                a = stack.shift();
                stack.unshift(Operation.mul(a , b));
                break;
              case '/':
                b = stack.shift();
                a = stack.shift();
                stack.unshift(Operation.div(a , b));
                break;
              case '%':
                b = stack.shift();
                a = stack.shift();
                stack.unshift( a % b );
                break;
              case '^':
                b = stack.shift();
                a = stack.shift();
                stack.unshift( Math.pow(a , b));
                break;
            }
          }
        }
        return stack[0];
    }
}

module.exports = Calc;