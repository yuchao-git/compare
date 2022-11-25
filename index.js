class Compare {
    constructor(left, right) {
        this.leftStr = this.lineStr(left);
        this.rightStr = this.lineStr(right);
        this.searchLimitNum = 200;
        this.diff();
    }
    lineStr(str) {
        let arr = [];
        let s = '';
        for (let i = 0; i < str.length; i++) {
            const char = str.charAt(i);
            if (char == '\n') {
                arr.push(s);
                s = '';
            } else if (i == str.length - 1) {
                s += char;
                arr.push(s);
                s = '';
            } else {
                s += char
            }
        }
        return arr;
    }
    diffLeftLine(lIndex, rIndex) {
        if (rIndex > lIndex + this.searchLimitNum) {
            return {
                rIndex,
                flag: false
            }
        }

        if (this.leftStr[lIndex] !== this.rightStr[rIndex]) {
            rIndex++;
            return this.diffLeftLine(lIndex, rIndex);
        } else {
            return {
                rIndex,
                flag: true
            }
        }
    }
    diff() {
        let rIndex = 0;
        let lIndex = 0;
        let findMap = {};
        for (; lIndex < this.leftStr.length; lIndex++) {

            let lResult = this.diffLeftLine(lIndex, rIndex);
            if (lResult.flag) {
                findMap[lResult.rIndex] = true;
                rIndex = lResult.rIndex + 1;
            }else{
            // 左边边的算删除
                this.leftStr[lIndex] = `<span style="background-color:red">${this.leftStr[lIndex]}</span>`
            }
        }
        
        this.rightStr.forEach((item,index) => {
            if (!findMap[index]) {
                // 右边的算新增
                this.rightStr[index] = `<span style="background-color:green">${this.rightStr[index]}</span>`
            }
        })
    }
}
let $left = document.querySelector('#left')
// $left.value = JSON.stringify({
//     "code": 110239,
//     "name": "延庆县",
//     "parent": 110000,
//     "pinyin": "yanqing",
//     "ceshi": 1324,
//     "simpleName": "延庆",
//     "counties": []
// }, null, '\t')

let $right = document.querySelector('#right')
// $right.value = JSON.stringify({
//     "code": 110229,
//     "name": "延庆县",
//     "parent": 110000,
//     "pinyin": "yanqing",
//     "ceshi1": 13245,
//     "simpleName": "延庆",
//     "type": "COUNTY",
//     "counties": []
// }, null, '\t')

let $compare = document.querySelector('#compare')

$compare.onclick = function () {
    let compare = new Compare($left.value, $right.value);
    let $l = document.querySelector('.result-l');
    let $r = document.querySelector('.result-r');

    $l.innerHTML = compare.leftStr.join('<br/>');
    $r.innerHTML = compare.rightStr.join('<br/>');
}