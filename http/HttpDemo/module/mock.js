const fs = require('fs')
const path = require('path')

let dataCache = null

// 获取 mock 数据
function loadData() {
  if (!dataCache) {
    data = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../mock/data.json'), 'utf-8')
    )
    // const reports = data.dailyReports // 数组格式的数据
    const reports = data
    dataCache = {}
    // 把数组数据转换成以日期为key的JSON格式并缓存起来
    reports.forEach((report) => {
      dataCache[report.updatedDate] = report
    })
  }
  return dataCache
}

// 获取所有有疫情记录的日期
function getCoronavirusKeyIndex() {
  return Object.keys(loadData())
}
// 获取当前日期对应的疫情数据
function getCoronavirusByDate(date) {
  const dailyData = loadData()[date] || {}
  if (dailyData.countries) {
    // 按照各国确诊人数排序
    dailyData.countries.sort((a, b) => {
      return b.confirmed - a.confirmed
    })
  }
  return dailyData
}

module.exports = {
  getCoronavirusByDate,
  getCoronavirusKeyIndex,
}
