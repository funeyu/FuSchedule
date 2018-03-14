var schedule =  require('./schedule')

schedule.scheduleJob('20 * * * * *', function() {
    console.log('here')
})
schedule.scheduleJob('10 * * * * *', function() {
    console.log('every minute!')
})