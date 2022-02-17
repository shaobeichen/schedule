# 排版算法

（目前还未算出）

一个排班系统，周一到周日，

每天有五个班次，分别是正0、正2、夜1、夜2、休息。

总人数可以输入，可以暂定30人。

要求：

1. 每人每周 夜1班和夜2班次数<=3
2. 每人每周 休息班>=1
3. 前一天夜2班的人员不会安排到后一天正0里面


案例：
以下数字为每日每班人数
| 日期 | 正0 | 正2 | 夜1 | 夜2 | 休息 | 每日人数小计  |
|  ----  | ----  | ----  | ----  | ----  | ----  | ----  |
| 周一 | 6  |  8 |   8   | 4  |  4 |   30  |
| 周二 | 3  |  9 |   10  | 4  |  4 |   30  |
| 周三 | 3  |  9 |   10  | 4  |  4 |   30  |
| 周四 | 2  |  9 |   10  | 4  |  5 |   30  |
| 周五 | 5  |  8 |   9   | 3  |  5 |   30  |
| 周六 | 6  |  8 |   9   | 3  |  4 |   30  |
| 周日 | 6  |  8 |   9   | 3  |  4 |   30  |




## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
