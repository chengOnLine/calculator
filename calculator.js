(function(){
    class Calculator{
        /**
         * 加法运算
         * @param {number} num1
         * @param {number} num2
         * @returns {*}
         */
        add(num1, num2) {
            num1 = Number(num1);
            num2 = Number(num2);
            let dec1, dec2, times;
            try { dec1 = this.countDecimals(num1)+1; } catch (e) { dec1 = 0; }
            try { dec2 = this.countDecimals(num2)+1; } catch (e) { dec2 = 0; }
            times = Math.pow(10, Math.max(dec1, dec2));
            const result = (this.mul(num1, times) + this.mul(num2, times)) / times;
            return this.getCorrectResult("add", num1, num2, result);
        }
        
        /**
         * 减法运算
         * @param {number} num1
         * @param {number} num2
         * @returns {number}
         */
        sub(num1, num2) {
            num1 = Number(num1);
            num2 = Number(num2);
            let dec1, dec2, times;
            try { dec1 = this.countDecimals(num1)+1; } catch (e) { dec1 = 0; }
            try { dec2 = this.countDecimals(num2)+1; } catch (e) { dec2 = 0; }
            times = Math.pow(10, Math.max(dec1, dec2));
            const result = Number((this.mul(num1, times) - this.mul(num2, times)) / times);
            return this.getCorrectResult("sub", num1, num2, result);
        }
        
        /**
         * 除法运算
         * @param {number} num1
         * @param {number} num2
         * @returns {number}
         */
        div(num1, num2) {
            num1 = Number(num1);
            num2 = Number(num2);
            let t1 = 0, t2 = 0, dec1, dec2;
            try { t1 = this.countDecimals(num1); } catch (e) { }
            try { t2 = this.countDecimals(num2); } catch (e) { }
            dec1 = this.convertToInt(num1);
            dec2 = this.convertToInt(num2);
            const result = this.mul((dec1 / dec2), Math.pow(10, t2 - t1));
            return this.getCorrectResult("div", num1, num2, result);
        }
        /**
         * 乘法运算
         * @param {number} num1
         * @param {number} num2
         * @returns {number}
         */
        mul(num1, num2) {
            num1 = Number(num1);
            num2 = Number(num2);
            let times = 0, s1 = num1.toString(), s2 = num2.toString();
            try { times += this.countDecimals(s1); } catch (e) { }
            try { times += this.countDecimals(s2); } catch (e) { }
            const result = this.convertToInt(s1) * this.convertToInt(s2) / Math.pow(10, times);
            return this.getCorrectResult("mul", num1, num2, result);
        }
        
        /**
         * 计算小数位的长度
         * @param {*} num
         * @returns {number}
         */
        countDecimals(num) {
            let len = 0;
            try {
                num = Number(num);
                let str = num.toString().toUpperCase();
                if (str.split('E').length === 2) { // 科学记数法
                    let isDecimal = false;
                    if (str.split('.').length === 2) {
                        str = str.split('.')[1];
                        if (parseInt(str.split('E')[0]) !== 0) {
                            isDecimal = true;
                        }
                    }
                    let x = str.split('E');
                    if (isDecimal) {
                        len = x[0].length;
                    }
                    len -= parseInt(x[1]);
                } else if (str.split('.').length === 2) { // 十进制
                    if (parseInt(str.split('.')[1]) !== 0) {
                        len = str.split('.')[1].length;
                    }
                }
            } catch(e) {
                throw e;
            } finally {
                if (isNaN(len) || len < 0) {
                    len = 0;
                }
                return len;
            }
        }
        
        /**
         * 将小数转成整数
         * @param {*} num
         * @returns {*}
         */
        convertToInt (num) {
            num = Number(num);
            let newNum = num;
            let times = this.countDecimals(num);
            let temp_num = num.toString().toUpperCase();
            if (temp_num.split('E').length === 2) {
                newNum = Math.round(num * Math.pow(10, times));
            } else {
                newNum = Number(temp_num.replace(".", ""));
            }
            return newNum;
        }
        
        /**
         * 确认我们的计算结果无误，以防万一
         * @param {string} type
         * @param {number} num1
         * @param {number} num2
         * @param {number} result
         * @returns {number}
         */
        getCorrectResult(type, num1, num2, result) {
            let temp_result = 0;
            switch (type) {
                case "add":
                    temp_result = num1 + num2;
                    break;
                case "sub":
                    temp_result = num1 - num2;
                    break;
                case "div":
                    temp_result = num1 / num2;
                    break;
                case "mul":
                    temp_result = num1 * num2;
                    break;
            }
            if (Math.abs(result - temp_result) > 1) {
                return temp_result;
            }
            return result;
        }
    }

    var math = new Calculator();
    if( !window.math ){
        window.math = math;   
    }
})();

