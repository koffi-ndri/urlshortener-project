require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const urlparser = require('url');
// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(cors());


let urlSchema = new mongoose.Schema({
    url: "string"
  });

  const Url = mongoose.model("Url", urlSchema);

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended: false}));
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res){
  console.log(req.body);
  //   res.json({original_url : 'https://freeCodeCamp.org', short_url : 1});
    const bodyUrl = req.body.url;
    const something = dns.lookup(urlparser.parse(bodyUrl).hostname, (error, address) =>{
      if(!address){
        res.json({error: "Invalid URL"});
      }else{
        const url = new Url({url: bodyUrl});
        url.save((err, data) =>{
          res.json({original_url: data.url, short_url: data.id });
        }); 
      }
      console.log("dns", error);
      console.log("address", address);
    });
    //res.json({greeting: req.body.url});
    console.log("something", something);
});

app.get("/api/shorturl/:id", (req, res) =>{
  const id = req.params.id;
  Url.findById(id, (err, data) =>{
    if(!data){
      res.json({error: err})
    }else{
      res.redirect(data.url);
    }
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
