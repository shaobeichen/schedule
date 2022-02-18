# 排班算法

（目前还未算出）

一个排班系统，周一到周日，

每天有五个班次，分别是正0、正2、夜1、夜2、休息。

总人数可以输入，可以暂定30人。序号为1-30

要求：

1. 每人每周 夜1班和夜2班次数<=3
2. 每人每周 休息班>=1
3. 前一天夜2班的人员不会安排到后一天正0里面


案例：
以下数字为每日每班人数
| 日期 | 正0 | 正2 | 夜1 | 夜2 | 休息 | 每日人数小计  |
|  ----  | ----  | ----  | ----  | ----  | ----  | ----  |
| 周一 | 6人 |  8人 |   8人   | 4人  |  4人 |   30人  |
| 周二 | 3人 |  9人 |   10人  | 4人  |  4人 |   30人  |
| 周三 | 3人 |  9人 |   10人  | 4人  |  4人 |   30人  |
| 周四 | 2人 |  9人 |   10人  | 4人  |  5人 |   30人  |
| 周五 | 5人 |  8人 |   9人   | 3人  |  5人 |   30人  |
| 周六 | 6人 |  8人 |   9人   | 3人  |  4人 |   30人  |
| 周日 | 6人 |  8人 |   9人   | 3人  |  4人 |   30人  |




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
