const express = require("express");
const app = express()
 
app.get('/', (req, res) => {
  res.send("Beatrix is on as always")
})
 
app.listen(3000, () => {
  console.log("Beatrix Project is Working!! hehe")
});
const MainClient = require("./nanospace.js");
const client = new MainClient();

client.connect()

module.exports = client; 
