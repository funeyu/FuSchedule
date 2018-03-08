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

const SheduleJob = function(cronTime, func) {
    if(!JobChainTail) {

    }
}

export default SheduleJob