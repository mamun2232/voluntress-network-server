// pass : bFrg6Qfam1OyAo8F
const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
var jwt = require('jsonwebtoken');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middlewire 
app.use(express.json())
app.use(cors())



const uri = "mongodb+srv://mamun:bFrg6Qfam1OyAo8F@volentress-network.p12fd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const VoluntressCollection = client.db("voluntress").collection("service")

async function run() {
  try {
    await client.connect();
    const VoluntressCollection = client.db("voluntress").collection("service")
    const bookingCollection = client.db("booking").collection("order")
    const regstionCollection = client.db("voluntres").collection("person")

    // read data 
    app.get('/service', async (req, res) => {
      const query = {}
      const cursor = VoluntressCollection.find(query)
      const service = await cursor.toArray()
      res.send(service)
    })

    // post data 
    app.post('/booking', async (req, res) => {
      const order = req.body
      const result = await bookingCollection.insertOne(order)
      res.send({ success: 'Your Order successfull' })
    })

    // order data read 
    app.get('/order', async (req, res) => {
      const query = {}
      const cursor = bookingCollection.find(query)
      const order = await cursor.toArray()
      res.send(order)

    })
    // delet order 
    app.delete('/order/:id', async (req, res) => {
      const id = req.params.id
      console.log(id);
      const query = { _id: ObjectId(id) }
      const result = await bookingCollection.deleteOne(query)
      res.send(result)
    })

    // voluntres registon 
    app.post('/person', async (req, res) => {
      const order = req.body
      const tokeninfo = req.headers.authorization
      const [email, accussToken] = tokeninfo.split(" ")

      // const decoded = jwt.verify(accussToken, process.env.ACCESS_TOKEN);
      // console.log(decoded) //
      const decoded = verifay(accussToken)
      if (email == decoded.email) {
        const result = await regstionCollection.insertOne(order)
        res.send({ success: 'Your Registion SuccessFull' })

      }
      else {
        res.send({ success: 'Unauthrize Access' })
      }


    })

    // volentres register list read 
    app.get('/person', async (req, res) => {
      const query = {}
      const cursor = regstionCollection.find(query)
      const order = await cursor.toArray()
      res.send(order)

    })
    // jwt token create 
    app.post('/login', async (req, res) => {
      const email = req.body
      const accessToken = jwt.sign(email, process.env.ACCESS_TOKEN);

      res.send({ accessToken })
    })

    // const verify token 

    const verifay = (token) => {
      let email;
      jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
          email = 'Unvalid Email'

        }
        if (decoded) {
          console.log(email);
          email = decoded
        }
      });
      return email

    }

    // delet api 
    app.delete('/person/:id', async (req, res) => {
      const id = req.params.id
      console.log(id);
      const query = { _id: ObjectId(id) }
      const result = await regstionCollection.deleteOne(query)
      res.send(result)
    })


  }

  finally {

  }

}
run().catch(console.dir)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})