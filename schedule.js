class Job {
    constructor(preJob, jobFunc, cronTime) {
        this.jobFunc = jobFunc
        this.cronTime = cronTime
        this.preJob = preJob
        this.preJob.nextJob = this
        this.nextJob(null)
    }

    start() {
        this.jobFunc()
    }

    setNext(job) {
        this.nextJob = job;
        job.preJob = this
        return this
    }

    getNextJob() {
        return this.nextJob
    }

    getPreJob() {
        return this.preJob
    }

    destory() {
        // job队列中的head 是个空Job，一直存在不会被删除
        let preJob = this.getPreJob()
        let nextJob = this.getNextJob()
        preJob.setNext(nextJob)
    }
}

class CronTime {
    static InitFromDate(time) {
        if(!time instanceof Date)
            throw new Error('CronTime.init should receive Date!')
        let now = new Date()
        let nowInfo = {
            second: now.getSeconds(),
            minute: now.getMinutes(),
            hour: now.getHours(),
            day: now.getDate(),
            month: now.getMonth() + 1,
            week: now.getDay()
        }
        return new CronTime(time.getSeconds(), time.getMinutes(), time.getHours(), time.getDate(),
            time.getMonth() + 1, time.getDay())
    }

    static InitFromInput(inputString) {
        let spans = inputString.split(' ')

        this.beginParseInputTime(spans)

        let second = this.parseInputSecond()
        let minute = this.parseInputMinute()
        let hour = this.parseInputHour()
        let day = this.parseInputDay()
        let month = this.parseInputMonth()
        let week = this.parseInputWeek()

        return new CronTime(second, minute, hour, day, month, week)
    }

    /**
     * 两个CronTime之间的时间间隔，单位为毫秒
     */
    static Between(cronTime, dat) {

    }

    constructor(second, minute, hour, day, month, week) {
        this.second = second
        this.minute = minute
        this.hour = hour
        this.day = day
        this.month = month
        this.week = week
    }

    static beginParseInputTime(spans) {
        if(spans.length > 6 || spans.length < 5)
            throw new Error('the format of cronTime should be like : "* * * * * *" ')
        let spansString = spans.join('')
        if(spansString === '*****' || spansString === '******')
            throw new Error('should assign a field')
    }

    static parseInputSecond (spans) {
        let secondString = spans[0]
        if(spans.length === 5 || secondString === '*' ) {
            return
        }

        if(Number.isInteger(secondString * 1) && secondString * 1 < 60) {
            return secondString * 1
        }

        throw new Error('error when parsing Second!')
    }


    static parseInputMinute (spans) {
        let minuteString
        if(spans.length === 5)
            minuteString = spans[0]
        else
            minuteString = spans[1]

        if(minuteString === '*') {
            return
        }
        if(Number.isInteger(minuteString * 1) && minuteString * 1 < 60 && minuteString * 1 >= 0) {
            return minuteString * 1
        }

        throw new Error('error when parsing Minute!')
    }

    static parseInputHour (spans) {
        let hourString
        if(spans.length === 5)
            hourString = spans[1]
        else
            hourString = spans[2]

        if(hourString === '*') {
            return
        }
        if(Number.isInteger(hourString * 1) && hourString * 1 < 24 && hourString * 1 >= 0) {
            return hourString * 1
        }

        throw new Error('error when parsing Hour!')
    }

    static parseInputDay (spans){
        let dayString
        if(spans.length === 5)
            dayString = spans[2]
        else
            dayString = spans[3]

        if(dayString === '*') {
            return
        }

        if(Number.isInteger(dayString * 1) && dayString * 1 < 31 && dayString * 1 > 0) {
            return dayString * 1
        }

        throw new Error('error when parsing Day!')
    }

    static parseInputMonth (spans){
        let monthString
        if(spans.length === 5)
            monthString = spans[3]
        else
            monthString = spans[4]

        if(monthString === '*') {
            return
        }

        if(Number.isInteger(monthString * 1) && monthString * 1 < 13 && monthString * 1 > 0) {
            return monthString * 1
        }

        throw new Error('error when parsing Month!')
    }

   static parseInputWeek (spans) {
        let weekString
        if(spans.length === 5)
            weekString = spans[4]
        else
            weekString = spans[5]

        if(weekString === '*') {
            return
        }

        if(Number.isInteger(weekString * 1) && weekString * 1 < 8 && weekString * 1 >=0) {
            return weekString * 1
        }

        throw new Error('error when parsing Week!')
    }
}

const JobChainHead = new Job(null, function() {})

let JobChain

const FindNearestJobAndInterval = function() {

    return {
        interval: 90 * 1000,
        job: new Job
    }
}

const WorkEndless = function(pendingJob, span) {
    setTimeout(()=> {
        pendingJob.start()
        let {job, interval} = FindNearestJobAndInterval()
        WorkEndless(job, interval)
    }, span)
}

let IsInWork = false

const ScheduleJob = function(cronTime, func) {
    if(!JobChain) {
        JobChain = JobChainHead
    }

    let cronTimeInstance = new CronTime(cronTime)
    let jobInstance = new Job(JobChain, func, cronTimeInstance)

    if(!IsInWork) {
        IsInWork = true
        let {job, interval} = FindNearestJobAndInterval()
        WorkEndless(job, interval)
    }


    return jobInstance

}

export default ScheduleJob