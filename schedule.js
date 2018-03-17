class Job {
    constructor(preJob, jobFunc, cronTime) {
        this.jobFunc = jobFunc
        this.cronTime = cronTime
        this.preJob = preJob
        if(preJob)
            this.preJob.nextJob = this
        this.setNext(null)
    }

    start() {
        this.jobFunc()
    }

    setNext(job) {
        this.nextJob = job;
        if(job)
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


const DaysInMonth = [
    31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
]

class CronTime {

    static InitFromInput(inputString) {
        let spans = inputString.split(' ')

        this.beginParseInputTime(spans)

        let second = this.parseInputSecond(spans)
        let minute = this.parseInputMinute(spans)
        let hour = this.parseInputHour(spans)
        let day = this.parseInputDay(spans)
        let month = this.parseInputMonth(spans)
        let week = this.parseInputWeek(spans)

        return new CronTime(second, minute, hour, day, month, week, spans)
    }

    findLongestTerm() {
        const mapsSixArray = [ 'second', 'minute', 'hour', 'day', 'month', 'week']
        let index = 0
        if(this.spans.length===6) {
            this.spans.forEach((s, i)=> {
                if(s && s !== '*')
                    index = i
            })
            return mapsSixArray[index]
        }
        this.spans.forEach((s, i)=> {
            if(s && s !== '*')
                index = i
        })
        return mapsSixArray[index + 1]
    }
    /**
     * CronTime与某个时间之间的时间间隔，单位为毫秒
     */
    between(date) {
        let interval = 0
        let hour = date.getHours()
        let minute = date.getMinutes()
        let second = date.getSeconds()

        let longestTerm = this.findLongestTerm()

        let nearestSecond
        if(typeof this.second !== 'undefined') {
            if(this.second.type === 'point') {
                nearestSecond = this.second.value
            }
            if(this.second.type === 'range') {
                if(this.second.min <= second && this.second.max >= second)
                    nearestSecond = second + 1
                else
                    nearestSecond = this.second.min

            }
            interval += nearestSecond - second
        }

        if(longestTerm === 'second')
            return interval > 0 ? interval : interval + 60

        let nearestMinute
        if(typeof this.minute !== 'undefined') {
            if(this.minute.type === 'point') {
                nearestMinute = this.minute.value
            } else if(this.minute.type === 'range') {
                if(minute >=this.minute.min && minute <= this.minute.max)
                    nearestMinute = minute
                else
                    nearestMinute = this.minute.min
            }
            interval += (nearestMinute - minute) * 60
            if(longestTerm === 'minute')
                return interval > 0 ? interval : interval + 60 * 60
        }
        if(typeof this.hour !== 'undefined'){
            interval += (this.hour - hour) * 3600
            if(longestTerm === 'hour')
                return interval > 0 ? interval : interval +  60 * 60 * 24
        }
    }

    constructor(second, minute, hour, day, month, week, spans) {
        this.second = second
        this.minute = minute
        this.hour = hour
        this.day = day
        this.month = month
        this.week = week

        this.spans = spans
    }

    static beginParseInputTime(spans) {
        if(spans.length > 6 || spans.length < 5)
            throw new Error('the format of cronTime should be like : "* * * * * *" ')
        let spansString = spans.join('')
        if(spansString === '*****' || spansString === '******')
            throw new Error('should assign a field')
    }

    static parseInputSecond (spans) {
        // 注意 输入的秒能有范围：1-20、 1,3,5、 /5
        let secondString = spans[0]
        if(spans.length === 5 || secondString === '*' ) {
            return
        }

        if(Number.isInteger(secondString * 1) && secondString * 1 < 60) {
            return { type: 'point', value: secondString * 1}
        }

        let splices
        // todo 校验输入是否正确
        if((splices = secondString.split('-')) && splices.length === 2) {
            return {type: 'range', min: splices[0] * 1, max: splices[1] * 1}
        }
        let dots
        // todo 校验输入是否正确
        if((dots = secondString.split(',')) && dots.length > 1) {
            return {type: 'dot', value: dots.filter(d=> d).map(d=> d * 1)}
        }

        let every
        // todo 校验输入是否正确
        if((every = secondString.split('\/')) && every.length === 2) {
            return {type: 'every', value: every[1] * 1}
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
            return {type: 'point', value: minuteString * 1}
        }
        let splices
        // todo 校验输入是否正确
        if((splices = minuteString.split('-')) && splices.length === 2) {
            return {type: 'range', min: splices[0] * 1, max: splices[1] * 1}
        }
        let dots
        // todo 校验输入是否正确
        if((dots = minuteString.split(',')) && dots.length > 1) {
            return {type: 'dot', value: dots.filter(d=> d).map(d=> d * 1)}
        }

        let every
        // todo 校验输入是否正确
        if((every = minuteString.split('\/')) && every.length === 2) {
            return {type: 'every', value: every[1] * 1}
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
            return {type: 'point', value: hourString * 1}
        }
        let splices
        // todo 校验输入是否正确
        if((splices = hourString.split('-')) && splices.length === 2) {
            return {type: 'range', min: splices[0] * 1, max: splices[1] * 1}
        }
        let dots
        // todo 校验输入是否正确
        if((dots = hourString.split(',')) && dots.length > 1) {
            return {type: 'dot', value: dots.filter(d=> d).map(d=> d * 1)}
        }

        let every
        // todo 校验输入是否正确
        if((every = hourString.split('\/')) && every.length === 2) {
            return {type: 'every', value: every[1] * 1}
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
    let next = JobChainHead;
    let now = new Date()
    let nearestTime, nearestJob
    while(next = next.getNextJob()) {
        let bet = next.cronTime.between(now)
        if(!nearestTime) {
            nearestTime = bet
            nearestJob = [next]
            continue
        }
        if(bet < nearestTime) {
            nearestTime = bet
            nearestJob = [next]
            continue
        } else if(bet === nearestTime) {
            nearestTime = bet
            nearestJob.push(next)
        }
    }

    return {
        interval: nearestTime * 1000,
        job: nearestJob
    }
}

const WorkEndless = function(pendingJob, span) {
    setTimeout(()=> {
        pendingJob.forEach(job=> job.start())
        let {job, interval} = FindNearestJobAndInterval()
        WorkEndless(job, interval)
    }, span)
}

let IsInWork = false

const ScheduleJob = function(cronTime, func) {
    if(!JobChain) {
        JobChain = JobChainHead
    }

    let cronTimeInstance = CronTime.InitFromInput(cronTime)
    let jobInstance = new Job(JobChain, func, cronTimeInstance)
    JobChain = jobInstance

    if(!IsInWork) {
        IsInWork = true
        setTimeout(()=> {
            let {job, interval} = FindNearestJobAndInterval()
            WorkEndless(job, interval)
        }, 0)

    }

    return jobInstance

}

const DaysInFeb = function(year) {
    if(year % 100 === 0) {
        if(year % 4 === 0) {
            return 29
        } else {
            return 28
        }
    } else if(year % 4 === 0) {
        return 29
    } else {
        return 28
    }
}

module.exports.scheduleJob = ScheduleJob

module.exports.CronTime = CronTime