import kue from 'kue';

function createPushNotificationsJobs(jobs, queue) {
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }
  for (const elem of jobs) {
    const job = queue.create('push_notification_code_3', elem).save(function(err){
      if (!err) {
        console.log(`Notification job created: ${job.id}`);
      }
    })
      .on('complete', (result) => {
        console.log(`Notification job ${job.id} completed`);
      })
      .on('failed', (erromessage) => {
        console.log(`Notification job ${job.id} failed: ${erromessage}`);
      })
      .on('progress', (progress, data) => {
        console.log(`Notification job ${job.id} ${progress}% complete`);
      });
  }
}
module.exports = createPushNotificationsJobs;
