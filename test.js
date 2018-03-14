var schedule =  require('./schedule')

schedule.scheduleJob('10 36 20 * * *', function() {
    console.log('here')
})