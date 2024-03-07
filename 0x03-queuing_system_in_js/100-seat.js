import redis from 'redis';
import kue from 'kue';
import { promisify } from 'util';
import express from 'express';

const client = redis.createClient()
  .on('error', (err) => {
    console.log(`Redis client not connected to the server:${err}`);
  })
  .on('ready', () => {
    console.log('Redis client connected to the server');
  });

// Researve seats
function reserveSeat(number) {
  client.set('available_seats', number);
}

// Get current available seats
const asynGet = promisify(client.get).bind(client);
async function getCurrentAvailableSeats() {
  const data = await asynGet('available_seats');
  return data;
}

// Available seats
reserveSeat(50);
let reservationEnabled = true;

// create a kue
const queue = kue.createQueue();

const app = express();

app.get('/available_seats', async (req, res) => {
  res.json({ "numberOfAvailableSeats": await getCurrentAvailableSeats() });
});

app.get('/reserve_seat', (req, res) => {
  if (reservationEnabled == false) {
    res.json({ "status": "Reservation are blocked" });
    return;
  }
  const job = queue.create('reserve_seat').save(function(err) {
    if (err) {
      res.json({ "status": "Reservation failed" });
      return;
    } else {
      res.json({ "status": "Reservation in process" });
      return;
    }
  })
    .on('complete', (result) => {
      console.log(`Seat reservation job ${job.id} completed`);
    })
    .on('failed', (erromessage) => {
      console.log(`Seat reservation job ${job.id} failed: ${erromessage}`);
    });
});

app.get('/process', async (req, res) => {
  queue.process('reserve_seat', async (job, done) => {
    let seat = await getCurrentAvailableSeats();
    seat = Number(seat) - 1;
    reserveSeat(seat);
    if (seat == 0) {
      reservationEnabled = false;
    }
    if (seat >= 0) {
      done();
    }
    done(new Error('Not enough seats available'));
  });
  res.json({ "status": "Queue processing" });
  return;
});


app.listen(1245, () => {
  console.log('listening on port 1245');
});
