function compare() {
    this.findLen = 5; // 查块大小，如果你希望更准确可以把这个值改大一点比如50行
    this.jsonSort = function (obj) {
        let names = [];
        let newObj = {};

        if (Array.isArray(obj)) {
            let list = [];
            for (let i = 0; i < obj.length; i++) {
                list.push(this.jsonSort(obj[i]));
            }
            list.sort();
            return list;
        } else {
            for (let o in obj) {
                names.push(o);
            }
            names.sort();
            for (let i = 0; i < names.length; i++) {
                let n = names[i];
                if ("function" != typeof obj[n]) {
                    if ("object" == typeof obj[n]) {
                        if (obj[n]) {
                            newObj[n] = this.jsonSort(obj[n]);
                        }
                    } else {
                        newObj[n] = obj[n];
                    }
                }
            }
        }

        return newObj;
    };
    this.json2Lines = function (obj) {
        let jsonVal = JSON.stringify(obj, null, '\t');
        let lines = [];
        let lineStr = "";

        for (let i = 0; i < jsonVal.length; i++) {
            if ('\t' == jsonVal.charAt(i) || '\n' == jsonVal.charAt(i)) {
                let s = lineStr.trim();
                if (s.length > 0) {
                    lines.push(lineStr.trim());
                }
                lineStr = "";
            } else {
                lineStr += jsonVal.charAt(i);
            }
        }

        lines.push(lineStr);
        return lines;
    };
    this.difference = function (leftStr, rightStr) {
        let count = 0, tmpCount = 0;
        for (let i = 0; i < leftStr.length && i < rightStr.length; i++) {
            if (leftStr.charAt(i) == rightStr.charAt(i)) {
                tmpCount++;
            } else {
                count += tmpCount;
                tmpCount = 0;
            }
        }

        if (tmpCount > 0) {
            count += tmpCount;
        }

        return count / Math.max(leftStr.length, rightStr.length) * 100;
    };
    this.compareFind = function (index, start, left, right) {
        let val = {
            right: start,
            series: 0,
            find: false
        };
        if (index < left.length && start < right.length) {
            let score = this.difference(left[index], right[start]);
            if (score > 60) {
                let rtn = this.compareFind(index + 1, start + 1, left, right);
                val.find = true;
                val.series += rtn.series + 1;
            }
        }

        return val;
    };
    this.compareNext = function (s1, s2, left, right, result) {
        let diff = {
            left: 0,
            series: 0,
            right: 0,
            find: false
        };
        for (let i = s1; i - s1 < this.findLen && i < left.length; i++) {
            let len = this.compareFind(i, s2, left, right);
            if (diff.series < len.series) {
                diff.left = i;
                diff.series = len.series;
                diff.right = len.right;
            }
        }

        if (diff.series > 0) {
            for (let i = s1; i < diff.left; i++) {
                result[i] = "<span style='background-color: pink'>" + left[i] + "</span>"; // 标记新增的部分
            }

            let r = diff.right;
            for (let i = diff.left; i < diff.left + diff.series; i++) {
                let score = this.difference(left[i], right[r++]);
                if (score < 100) {
                    result[i] = "<span style='background-color: yellow'>" + left[i] + "</span>"; // 标记修改的部分
                } else {
                    result[i] = left[i]; // 相同的部分
                }
            }
            diff.find = true;
        } else {
            // result.push("<span style='background-color: pink'>" + left[s1] + "</span>"); // 标记新增的部分
            if (s2 + 1 < right.length) {
                let f = this.compareNext(s1, s2 + 1, left, right, result);
                return {
                    series: f.series,
                    left: f.left,
                    right: f.right,
                    find: f.find
                }
            } else {
                diff.left = s1 + 1;
                diff.right = s2;
            }
        }

        return {
            series: diff.series,
            left: diff.left + diff.series,
            right: diff.right + diff.series,
            find: diff.find
        };
    };
    this.compareJson = function (left, right) {
        let result = [];
        let liftLine = this.json2Lines(left);
        let rightLine = this.json2Lines(right);
        let lIndex = 0, rIndex = 0;
        while (lIndex < liftLine.length) {
            let diff = this.compareNext(lIndex, rIndex, liftLine, rightLine, result);
            if (!diff.find) {
                result[lIndex] = "<span style='background-color: pink'>" + left[lIndex] + "</span>"; // 标记新增的部分
            }
            lIndex = diff.left;
            rIndex = diff.right;
            // break;
        }

        return result;
    };
    this.jsonToCompare = function (left, right) {
        try {
            //json对象排序
            let l = this.jsonSort(JSON.parse(left));
            let r = this.jsonSort(JSON.parse(right));
            let res = this.compareJson(l, r);
            return res.join(" ");
        } catch (e) {
            console.log(e)
        }
        return left;
    }
}

let compare1 = new compare();

console.log(compare1.jsonToCompare(JSON.stringify({
    "code": 110239,
    "name": "延庆县",
    "parent": 110000,
    "pinyin": "yanqing",
    "ceshi": 1324,
    "simpleName": "延庆",
    "counties": []
}), JSON.stringify({
    "code": 110229,
    "name": "延庆县",
    "parent": 110000,
    "pinyin": "yanqing",
    "simpleName": "延庆",
    "type": "COUNTY",
    "ceshi": 1324,
    "counties": []
})))
