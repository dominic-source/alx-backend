import kue from 'kue';
import express from 'express';
import redis from 'redis';
import { promisify } from 'util';


const listProducts = [
  {'Id': 1, 'name': 'Suitcase 250', 'price': 50, 'stock': 4},
  {'Id': 2, 'name': 'Suitcase 450', 'price': 100, 'stock': 10},
  {'Id': 3, 'name': 'Suitcase 650', 'price': 350, 'stock': 2},
  {'Id': 4, 'name': 'Suitcase 1050', 'price': 550, 'stock': 5},
];

function getItemById(id) {
  for (const product of listProducts){
    if (product.Id == id) {
      return product;
    }
  }
  return null;
};

// start express app
const app = express();

// start redis client
const client = redis.createClient()
  .on('error', (err) => {
    console.log(`Redis client not connected to the server:${err}`);
  })
  .on('ready', () => {
    console.log('Redis client connected to the server');
  });

function reserveStockById(itemId, stock) {
  client.set(itemId, stock);
};

const getAsync = promisify(client.get).bind(client);

async function getCurrentReservedStockById(itemId) {
  try {
    const data = await getAsync(itemId);
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

app.get('/list_products', (req, res) => {
  let list = [];
  for (const data of listProducts) {
    const obj = {"itemId": data.Id,
	    "itemName": data.name,
	    "price": data.price,
	    "initialAvailableQuantity": data.stock};
    list.push(obj);
  }
  res.json(list);
});

app.get('/list_products/:itemId', async (req, res) => {
  const product = getItemById(req.params.itemId);
  if (product == null) {
    res.json({"status":"Product not found"});
    return;
  }
  //reserveStockById(req.params.itemId, product.stock);
  const stock = await getCurrentReservedStockById(req.params.itemId);
  if (stock == null) {
     product['currentQuantity'] = product.stock;
  } else {
    product['currentQuantity'] = Number(stock);
  }
  res.json(product);
});

app.get('/reserve_product/:itemId', (req, res) => {
  const id = req.params.itemId;
  const product = getItemById(id);
  if (product == null) {
    res.json({"status":"Product not found"});
    return;
  }
  const stock = await getCurrentReservedStockById(id);
  if (Number(stock) < 1) {
    res.json({"status":"Not enough stock available","itemId":id});
    return;
  }
});

app.listen(1245, () => {
  console.log('listen on port 1245');
});

