var schedule =  require('./schedule')

schedule.scheduleJob('20 * * * * *', function() {
    console.log('here20')
})
schedule.scheduleJob('10 * * * * *', function() {
    console.log('every minute!')
})

schedule.scheduleJob('15 * * * * *', function() {
    console.log('15!')
})

var CronTime = schedule.CronTime
var ct = CronTime.InitFromInput('1-10 * * * * *')
var testDate = new Date(Date.parse('2018-10-11 12:00:08'))
console.log(ct.between(testDate))

var every = schedule.scheduleJob('1-20 * * * * *', function() {
    console.log('here')
})

// 测试destory方法
setTimeout(function() {
    every.destory()
}, 60000)


