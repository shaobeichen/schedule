/**
 * 从一个给定的数组arr中,随机返回num个不重复项
 */
function getArrayItems(arr, ranNum) {
    let result = [];
    for (let i = 0; i < ranNum; i++) {
        let ran = Math.floor(Math.random() * arr.length);
        result.push(arr.splice(ran, 1)[0]);
    }
    return result;
}

/**
 * 使用循环的方式判断一个元素是否存在于一个数组中
 * @param {Object} arr 数组
 * @param {Object} value 元素值
 */
function isInArray(arr, value) {
    for (var i = 0; i < arr.length; i++) {
        if (value === arr[i]) {
            return true;
        }
    }
    return false;
}

/**
 * 移除数组中的一个项
 */
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

/**
 * 数组切割成每4个一个新数组
 * @param arr1 原始数组
 */
function numSplit(arr1) {
    let arr2 = [];
    let a1 = [];
    for (let i = 0; i < arr1.length; i++) {
        if ((i + 1) % 4 == 0) {
            a1.push(arr1[i]);
            arr2.push(a1);
            a1 = [];
        } else {
            a1.push(arr1[i]);
        }
    }
    return arr2;
}

/**
 * 删除num个数组中的项，返回剩余的数组
 * @param peopleTotalArr
 * @param num
 */
function getArrayItemsReturn(peopleTotalArr, num) {
    let temp = getArrayItems(peopleTotalArr, num);
    for (let i = 0; i < temp.length; i++) {
        peopleTotalArr.remove(temp[i]);
    }
    return peopleTotalArr;
}

/**
 * 深拷贝
 * @param obj
 * @returns {*}
 */
function deepClone(obj) {
    var newObj = obj instanceof Array ? [] : {};
    //obj属于基本数据类型,直接返回obj
    if (typeof obj !== 'object') {
        return obj;
    } else {
        //obj属于数组或对象，遍历它们
        for (var i in obj) {
            newObj[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i];
        }
    }
    return newObj;
}

/**
 * 查看值在数组中出现的次数是否超过3次
 * @param arr
 * @param val
 */
function arrValNum3(arr, val) {
    let count = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
            count++;
        }
    }
    if (count >= 3) {
        return true;
    } else {
        return false;
    }
}

/**
 * yb(夜班) 除去夜班人上过3次的人然后分配到数组里
 * @param num 循环几次，即arr1[i][j]
 * @param arr 可以分配的人数组
 * @param y12Arr 夜班上过3次的人
 */
function yb(num, arr, y12Arr) {
    let arrpush = [];
    for (let h = 0; h < num; h++) {
        let ran = Math.floor(Math.random() * arr.length);
        let ranVal = arr[ran];
        while (arrValNum3(y12Arr, ranVal)) {
            ran = Math.floor(Math.random() * arr.length);
            ranVal = arr[ran];
        }
        arrpush.push(arr.splice(ran, 1)[0]);
    }
    return arrpush;
}

/**
 * 除去休息过的人然后分配到数组里
 * @param num 循环几次，即arr1[i][j]
 * @param arr 可以分配的人数组
 * @param xxArr 休息过的人
 */
function xxed(num, arr, xxArr) {
    let arrpush = [];
    for (let k = 0; k < num; k++) {
        let ran = Math.floor(Math.random() * arr.length);
        let ranVal = arr[ran];
        while (isInArray(xxArr, ranVal)) {
            ran = Math.floor(Math.random() * arr.length);
            ranVal = arr[ran];
        }
        arrpush.push(arr.splice(ran, 1)[0]);
    }
    return arrpush;
}

/**
 * 显示到表格中去
 * @param eq1 tr的第几行
 * @param eq2 td的第几列
 * @param html1
 */
function htmltable(eq1, eq2, html1) {
    let html = $('#table2 tbody').find('tr').eq(eq1).find('td').eq(eq2).html();
    if (html) {
        $('#table2 tbody').find('tr').eq(eq1).find('td').eq(eq2).html(`${html},${html1}`);
    } else {
        $('#table2 tbody').find('tr').eq(eq1).find('td').eq(eq2).html(`${html1}`);
    }
}

/**
 * 去重
 * @param 去重前的数组
 * @returns 去重后的数组
 */
function rmDup(arr) {
    return Array.from(new Set(arr));
}

/**
 * 判断去重后的夜班人是否已经被分配掉了
 * @param arr
 * @param parr
 * @returns {Array}
 */
function rmDupy12ArrFun(arr, parr) {
    let arrpush = [];
    for (let k = 0; k < arr.length; k++) {
        let ran = Math.floor(Math.random() * arr.length);
        let ranVal = arr[ran];
        while (isInArray(parr, ranVal)) {
            ran = Math.floor(Math.random() * arr.length);
            ranVal = arr[ran];
        }
        arrpush.push(arr.splice(ran, 1)[0]);
    }
    return arrpush;
}