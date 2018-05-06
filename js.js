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
 * 随机移除数组中的一个或多个项
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
 * 查看值在数组中出现的次数是否超过2次
 * @param arr
 * @param val
 */
function arrValNum3(arr, val) {
    let count = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            count++;
        }
    }
    if (count <= 2) {
        return true;
    } else {
        return false;
    }
}
