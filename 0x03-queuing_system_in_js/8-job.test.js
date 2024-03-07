import kue from 'kue';
import chai from 'chai';
import createPushNotificationsJobs from './8-job.js';

const queue = kue.createQueue();
const expect = chai.expect;

before(function() {
 queue.testMode.enter();
});


afterEach(function() {
  queue.testMode.clear();
});

after(function() {
  queue.testMode.exit();
});

describe('Test queue', function() {
  it('should test that the job is created', function() {
    queue.createJob('push notify', {
        phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account'
    }).save();
    queue.createJob('push notify', {
        phoneNumber: '4153518785',
    message: 'This is the code 4321 to verify your account'
    }).save();
    expect(queue.testMode.jobs.length).to.equal(2);
    expect(queue.testMode.jobs[0].type).to.equal('push notify');
    expect(queue.testMode.jobs[0].data).to.deep.equal({
        phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account'
    });
  });
  it(' should display error if job is not an array', function() {
    queue.create('push notify 2', []).save();
    expect(queue.testMode.jobs).to.be.an('array');
  });
});
