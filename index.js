const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { emit } = require('nodemon');
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



const uri = 'mongodb+srv://crud7:8OHFzyE3KmMu5CbJ@cluster0.o4gm5da.mongodb.net/?retryWrites=true&w=majority';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run(){
    try{
        await client.connect();

const database = client.db('container');
const userCollection = database.collection('data');


// view data

app.get('/getData', async(req,res) => {
    const query = userCollection.find();
    const filter = await query.toArray();
    res.send(filter)
})

// insert data

app.post('/users', async (req,res) => {
 const user = req.body;
 const result = await userCollection.insertOne(user);
 res.send(result);
})


// delete data

app.delete('/deleteUsers/:id',  async (req,res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)};
  const result = await userCollection.deleteOne(query)
  res.send(result);

})

// edit get data

app.get('/editGetData/:id', async(req,res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)};
  const result = await userCollection.findOne(query);
  res.send(result)
})


// put data

app.put('/putData/:id', async (req,res) => {
  const id = req.params.id;
  const updatedUser = req.body;
  const filter = {_id: new ObjectId(id)};
  const option = {upsert: true};
  const updateDoc = {
    $set:{
      name: updatedUser.name,
      email: updatedUser.email
         }
  }
const resutl = await userCollection.updateOne(filter,updateDoc,option);
res.send(resutl);

});

    }
    finally{

    }
}
run().catch(console.dir);



app.listen(port, () => {
console.log(`CRUD is running on port, ${port}`)
})