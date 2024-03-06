import kue from 'kue';

const blacklist = [4153518780, 4153518781];

function sendNotification(phoneNumber, message, job, done) {
  // Track progress here
  let progress = 0;

  // Function to update progress
  function updateProgress(percent) {
    progress = percent;
    job.progress(progress, 100); // Update job progress
  }

  // Emit initial progress
  updateProgress(progress);

  job.on('progress', (currentProgress, data) => {
    // Update progress if different from the current progress
    if (currentProgress < 50) {
      updateProgress(currentProgress);
    }  else {
      console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
    }
  });

  if (blacklist.includes(phoneNumber)) {
    done(new Error(`Phone number ${phoneNumber} is blacklisted`))
  }
}

const queue = kue.createQueue();

queue.process('push_notification_code_2', 2, (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.message, job, done)
});
