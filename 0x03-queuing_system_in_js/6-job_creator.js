import kue from 'kue';

const queue = kue.createQueue();

const obj = {
  'phoneNumber': '09066424595',
  'message': 'I am working as you can see',
  }
const job = queue.create('push_notification_code', obj).save(function(err) {
  if(!err){
    console.log(`Notification job created: ${job.id}`);
  } else {
    console.log('Notification job failed');
  }
});
job.on('complete', () => {
  console.log('Notification job completed');
});
