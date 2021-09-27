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
    <table id="table1" cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          <th />
          <th v-for="(item, index) in theadTitle" :key="index">{{ item }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, i) in tbodyTitle" :key="i" class="hover">
          <td>{{ item }}</td>
          <td
            v-for="(ite, j) in theadTitle"
            :key="j"
            :class="{
              red: table1ItemClass(i, j),
              enlarge: table1ItemEnlargeClass(i, j),
            }"
          >
            {{ tableItem(i, j) }}
          </td>
        </tr>
      </tbody>
    </table>
    <br />
    <table id="table2" cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          <th />
          <th v-for="(item, index) in theadTitle" :key="index">{{ item }}</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(item, i) in classData"
          :key="i"
          class="hover"
          :class="{ pink: table2RowClickId === item.id }"
          @click="table2RowClick(item.id)"
        >
          <td>{{ item.id }}</td>
          <td
            v-for="(ite, j) in statusType"
            :key="j"
            :class="{
              red: ite === 'xx' && item.xx < 1,
              red: (ite === 'y1' || ite === 'y2') && item.y1 + item.y2 > 3,
            }"
          >
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
      quantity:
        '6,8,8,4,4,3,9,10,4,4,3,9,10,4,4,2,9,10,4,5,5,8,9,3,5,6,8,9,3,4,6,8,9,3,4',
      statusType: ['xx', 'z0', 'y2', 'y1', 'z2'],
      theadTitle: ['休息班', '正0班', '夜2班', '夜1班', '正2班'],
      tbodyTitle: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      classData: [],
      endList: [],
      table2RowClickId: 0,
    }
  },
  computed: {
    table1ItemClass() {
      const { tableItem } = this
      return (i, j) => {
        return (
          tableItem(i, j)
            .split(',')
            .filter((v) => v).length &&
          tableItem(i, j)
            .split(',')
            .filter((v) => !v).length
        )
      }
    },
    table1ItemEnlargeClass() {
      const { endList, theadTitle, table2RowClickId } = this
      return (i, j) => {
        return endList[i * theadTitle.length + j]?.includes(table2RowClickId)
      }
    },
    tableItem() {
      const { endList, theadTitle } = this
      return (i, j) => {
        return String(endList[i * theadTitle.length + j] || '')
      }
    },
    /**
     * 拆分后每班人数
     * 格式: [[6,4,8,8,4],[2,4,10,9,5]...]
     */
    chunkQuantity() {
      const { quantity } = this
      return this.chunk(quantity.split(',').map(Number), 5)
    },
  },
  methods: {
    init() {
      this.classData = this.deepClone(this.getBaseClassData())
      this.endList = []
    },
    ok() {
      this.init()
      const { chunkQuantity, total, random, statusType, classData, quantity } =
        this

      const classDataTemp = this.deepClone(classData)

      // 最终展示在表格列表的数据
      const endList = []
      // 休息班的总数据
      let xxList = []
      // 夜2班的总数据，用来在第二天正0班比对上一天的数据
      let y2List = []

      chunkQuantity.forEach((item, i) => {
        // 表示哪些已经分配过了
        let arr = []

        item.forEach((ite, j) => {
          const key = statusType[j]
          let idArr = []
          const y2YesterdayList = y2List[i - 1] || []

          // 添加限制 每人每周 休息班>=1
          if (key === 'xx' && xxList.length <= total) {
            let arrAndXxList = this.deepClone(arr)
            arrAndXxList.push(...xxList)
            arrAndXxList = Array.from(new Set(arrAndXxList))

            // 有可能会出现已分配人数超过需要分配人数 比如休息的人数这周已经25个人了，但是现在最后一周的休息班需要分配6人
            const allocatedQuantity = total - arrAndXxList.length
            if (allocatedQuantity < ite) {
              idArr = random(allocatedQuantity, total, arrAndXxList, i, j)
              idArr.push(
                ...random(ite - allocatedQuantity, total, arrAndXxList, i, j),
              )
            } else {
              idArr = random(ite, total, arrAndXxList, i, j)
            }
          }

          // 添加限制 前一天夜2班的人员不会安排到后一天正0里面
          else if (key === 'z0' && y2YesterdayList.length) {
            let arrAndY2YesterdayList = this.deepClone(arr)
            arrAndY2YesterdayList.push(...y2YesterdayList)

            arrAndY2YesterdayList = Array.from(new Set(arrAndY2YesterdayList))

            idArr = random(ite, total, arrAndY2YesterdayList, i, j)
          }

          // 添加限制 每人每周 夜1班和夜2班次数<=3
          else if (key === 'y1' || key === 'y2') {
            let arrAndClassDataTemp = this.deepClone(arr)
            arrAndClassDataTemp.push(
              ...classDataTemp
                .filter((v) => +v.y1 + +v.y2 > 3)
                .map((v) => v.id),
            )
            arrAndClassDataTemp = Array.from(new Set(arrAndClassDataTemp))
            idArr = random(ite, total, arrAndClassDataTemp, i, j)
          }

          // 正常随机分配
          else {
            arr = Array.from(new Set(arr))
            idArr = random(ite, total, arr, i, j)
          }

          // 将已经分配的班次数据更新到classDataTemp中
          for (const it of classDataTemp) {
            for (const t of idArr) {
              if (it.id === t) it[key]++
            }
          }

          // 将当天夜2班的人存起来
          if (key === 'y2') {
            y2List[i] = [...idArr]
          }

          arr.push(...idArr)
          endList.push(...idArr)
        })

        // 分配完每天的数据后统计下之前的休息班数据
        xxList = [
          ...classDataTemp
            .filter((v) => +v.xx > 1 || +v.xx === 1)
            .map((v) => v.id),
        ]
      })

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
    random(number = 1, max = 1, exclude = [], i, j) {
      if (max - exclude.length < number)
        console.warn(
          '警告 exclude 数据不正确',
          i,
          j,
          number,
          max,
          exclude.length,
        )

      const arr = []

      let totalArr = Array.from(Array(max), (v, i) => i + 1)

      exclude.map((v) =>
        totalArr.splice(
          totalArr.findIndex((x) => x === v),
          1,
        ),
      )

      while (arr.length < number) {
        const num = Math.ceil(
          Math.random() * (totalArr.length - 1 < 0 ? 0 : totalArr.length - 1),
        )

        arr.push(totalArr[num])

        totalArr.splice(num, 1)
        if (arr.length === max) break
      }
      return arr
    },
    /**
     * 深拷贝（局限）
     */
    deepClone(value) {
      return JSON.parse(JSON.stringify(value))
    },
    table2RowClick(id) {
      this.table2RowClickId = id
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

.red {
  background: rgb(255, 163, 163);
  color: #ffffff;
  font-weight: bold;
}
.enlarge {
  color: red;
  font-size: 20px;
  font-weight: bold;
}
.hover {
  &:hover {
    background: rgb(219, 219, 219);
  }
}
.pink {
  background: rgb(255, 220, 220);
}
</style>
