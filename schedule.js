class Job {
    constructor(preJob, jobFunc, cronTime) {
        this.jobFunc = jobFunc
        this.cronTime = cronTime
        this.preJob = preJob
        this.preJob.nextJob = this
        this.nextJob(null)
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

    remove() {
        // job队列中的head 是个空Job，一直存在不会被删除
        let preJob = this.getPreJob()
        let nextJob = this.getNextJob()

        preJob.setNext(nextJob)
    }
}

const JobChainHead = new Job(null, function() {})

let JobChainTail

class CronTime {
    constructor(cronTime) {
        this.cronTime = cronTime
        this.spans = cronTime.split(' ')

        this.beginParseTime()

        this.parseSecond()

        this.parseMinute()

        this.parseHour()

        this.parseDay()

        this.parseMonth()


    }

    beginParseTime() {
        if(this.spans.length > 6 || this.spans.length < 5)
            throw new Error('the format of cronTime should be like : "* * * * * *" ')
    }

    parseSecond () {
        let secondString = this.spans[0]
        if(this.spans.length === 5 || secondString === '*' ) {
            this.second = null
            return this
        }

        if(Number.isInteger(secondString * 1) && secondString * 1 < 60) {
            this.second = secondString * 1
            return this
        }

        throw new Error('error when parsing Second!')
    }


    parseMinute () {
        let minuteString
        if(this.spans.length === 5)
            minuteString = this.spans[0]
        else
            minuteString = this.spans[1]

        if(minuteString === '*') {
            this.minute = null
            return this
        }
        if(Number.isInteger(minuteString * 1) && minuteString * 1 < 60 && minuteString * 1 >= 0) {
            this.minute = minuteString * 1
            return this
        }

        throw new Error('error when parsing Minute!')
    }

    parseHour () {
        let hourString
        if(this.spans.length === 5)
            hourString = this.spans[1]
        else
            hourString = this.spans[2]

        if(hourString === '*') {
            this.hour = null
            return this
        }
        if(Number.isInteger(hourString * 1) && hourString * 1 < 24 && hourString * 1 >= 0) {
            this.hour = hourString * 1
            return this
        }

        throw new Error('error when parsing Hour!')
    }

    parseDay (){
        let dayString
        if(this.spans.length === 5)
            dayString = this.spans[2]
        else
            dayString = this.spans[3]

        if(dayString === '*') {
            this.day = null
            return this
        }

        if(Number.isInteger(dayString * 1) && dayString * 1 < 31 && dayString * 1 > 0) {
            this.day = dayString * 1
            return this
        }

        throw new Error('error when parsing Day!')
    }

    parseMonth (){
        let monthString
        if(this.spans.length === 5)
            monthString = this.spans[3]
        else
            monthString = this.spans[4]

        if(monthString === '*') {
            this.month = null
            return this
        }

        if(Number.isInteger(monthString * 1) && monthString * 1 < 13 && monthString * 1 > 0) {
            this.month = monthString * 1
            return this
        }

        throw new Error('error when parsing Month!')
    }

    parseWeek () {
        let weekString
        if(this.spans.length === 5)
            weekString = this.spans[4]
        else
            weekString = this.spans[5]

        if(weekString === '*') {
            this.week = null
            return this
        }

        if(Number.isInteger(weekString * 1) && weekString * 1 < 8 && weekString * 1 >=0) {
            this.week = weekString * 1
            return this
        }

        throw new Error('error when parsing Week!')
    }
}

const SheduleJob = function(cronTime, func) {
    if(!JobChainTail) {

    }
}

export default SheduleJob