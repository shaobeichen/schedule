<template>
  <div class="hello">
    <!-- <h2>排班系统</h2> -->
    <pre v-html="rules" />
    <br />
    <div>
      <label for="peopleTotal">请输入总人数:</label>
      <input type="number" id="peopleTotal" v-model="total" />
    </div>
    <br />
    <div>
      <label for="peopleCount">请输入排班数量:</label>
      <input
        type="text"
        id="peopleCount"
        placeholder="每天输入4个，总共输入28个，用英文逗号隔开，最后不用加逗号，为了防止你想重新排班的时候又要重新输入"
        v-model="quantity"
      />
    </div>

    <br />
    <button type="button" @click="ok">确定这样排班</button>
    <br />
    <br />
    <table id="table2" cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          <th />
          <th v-for="(item, index) in theadTitle" :key="index">{{ item }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, i) in tbodyTitle" :key="i">
          <td>{{ item }}</td>
          <td v-for="(ite, j) in theadTitle" :key="j">
            {{ tableItem(i, j) }}
          </td>
        </tr>
      </tbody>
    </table>
    <br />
    <table id="table3" cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          <th />
          <th v-for="(item, index) in theadTitle" :key="index">{{ item }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, i) in classData" :key="i">
          <td>{{ item.id }}</td>
          <td v-for="(ite, j) in statusType" :key="j">
            {{ item[ite] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      rules: `
      一个排班系统，周一到周日，每天有五个班次，分别是正0、正2、夜1、夜2、休息。
      总人数可以输入，可以暂定30人。
      每天每个班次里面的人数可以输入，每天总班次人数等于总人数。

      要求：
      1.每人每周 夜1班和夜2班次数<=3
      2.每人每周 休息班>=1
      3.前一天夜2班的人员不会安排到后一天正0里面
      
      `,
      total: 30,
      statusType: ['z0', 'z2', 'y1', 'y2', 'xx'],
      quantity:
        '8,4,4,8,6,9,5,4,10,2,9,5,4,10,2,9,5,4,10,2,8,5,3,9,5,8,4,3,9,6,8,4,3,9,6',
      theadTitle: ['正0班', '正2班', '夜1班', '夜2班', '休息班'],
      tbodyTitle: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      classData: [],
      endList: [],
    }
  },
  computed: {
    tableItem() {
      const { endList, theadTitle } = this
      return (i, j) => {
        return String(endList[i * theadTitle.length + j] || '')
      }
    },
    /**
     * 拆分后每班人数
     * 格式: [[8,4,4,8,9],[5,4,10,9,5]...]
     */
    chunkQuantity() {
      const { quantity } = this
      return this.chunk(quantity.split(',').map(Number), 5)
    },
  },
  mounted() {
    this.classData = JSON.parse(JSON.stringify(this.getBaseClassData()))
  },
  methods: {
    ok() {
      const { chunkQuantity, total, random, statusType, classData, quantity } =
        this

      const classDataTemp = JSON.parse(JSON.stringify(classData))

      const endList = []
      chunkQuantity.forEach((item, i) => {
        console.log(`第${i + 1}天`)
        let arr = []
        item.forEach((ite, j) => {
          const key = statusType[j]
          let idArr = []

          // 添加限制 每人每周 夜1班和夜2班次数<=3
          if (key === statusType[2] || key === statusType[3]) {
            let arrAndClassDataTemp = JSON.parse(JSON.stringify(arr))
            arrAndClassDataTemp.push(
              ...classDataTemp
                .filter((v) => +v.y1 + +v.y2 > 3)
                .map((v) => v.id),
            )
            arrAndClassDataTemp = Array.from(new Set(arrAndClassDataTemp))
            idArr = random(ite, total, arrAndClassDataTemp)
          } else {
            arr = Array.from(new Set(arr))
            idArr = random(ite, total, arr)
          }

          // 将已经分配的班次数据更新到classDataTemp中
          for (const it of classDataTemp) {
            for (const t of idArr) {
              if (it.id === t) it[key]++
            }
          }

          arr.push(...idArr)
          endList.push(...idArr)
        })
      })
      console.log('end', endList)

      this.classData = classDataTemp
      this.endList = quantity
        .split(',')
        .map(Number)
        .map((v) => endList.splice(0, v))
    },
    /**
     * 基础排班数据，包含id和五个班的状态
     * 格式: [{id:1,z0:0,z2:0...}...]
     */
    getBaseClassData() {
      const { statusType, total } = this
      const arr = Array.from({ length: total }, (v, i) => +i + 1)

      return arr.map((v) => {
        return {
          id: v,
          ...Object.fromEntries(
            statusType.map((v) => {
              return [[v], 0]
            }),
          ),
        }
      })
    },
    /**
     * 数组分割成多数组
     * @param  {Array} array 要分割的数组
     * @param  {Number} size  每个数组的个数
     * @return {Array}       返回一个数组
     */
    chunk(array, size) {
      let [start, end, result] = [null, null, []]
      for (let i = 0; i < Math.ceil(array.length / size); i++) {
        start = i * size
        end = start + size
        result.push(array.slice(start, end))
      }
      return result
    },
    /**
     * 生成10个1-100不重复的随机数
     * @param {Number} number 要生成的数量
     * @param {Number} max 最大数
     * @param {Array} exclude 排除
     */
    random(number = 1, max = 1, exclude = []) {
      exclude = JSON.parse(JSON.stringify(exclude))
      const arr = []
      while (arr.length < number) {
        const num = Math.ceil(Math.random() * max)
        if (!exclude.includes(num)) {
          arr.push(num)
          exclude.push(num)
        }
      }
      return arr
    },
  },
}
</script>
 
<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}

body {
  padding: 60px;
}

table {
  width: 100%;
  table-layout: fixed;
  text-align: center;
}

thead {
  width: 100%;
}

tr {
  width: 100%;
  height: 50px;
}

th {
  border: 1px solid #000000;
  word-break: break-word;
}

td {
  border: 1px solid #000000;
  word-break: break-word;
}

table input {
  width: 70%;
}

label {
  display: inline-block;
  width: 20%;
  text-align: right;
  margin-right: 20px;
}

input {
  width: 70%;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
}

button {
  margin-left: calc(15% + 25px);
  background: #8a8a8a;
  border: 0;
  color: #ffffff;
  padding: 10px;
  cursor: pointer;
}

button:hover {
  background: #6e6e6e;
  cursor: pointer;
}

h4,
li {
  margin-left: calc(15% + 25px);
}

h2 {
  text-align: center;
  margin-bottom: 30px;
}
</style>
