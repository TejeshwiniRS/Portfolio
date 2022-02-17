const express = require("express");
const ejs = require("ejs");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
const dbURI =
  "mongodb+srv://Tejeshwini:Teju%402000@cluster0.iz0me.mongodb.net/personal_blog?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log("connected to db "))
  .catch((err) => console.log(err));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());
const schema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: [true, "Please check your entry,no email specified!"],
  },
  msg: {
    type: String,
    required: [true, "Please check your entry,no message given"],
  },
  
});
const contactdb = mongoose.model("contactdb", schema);
const entry1 = new contactdb({
  name: "tejeshwini",
  email: "tejuswetha20@gmail.com",
  msg: "Sample msg",
});
const entry2 = new contactdb({
  email: "xyz@yahoo.com",
  msg: "Default msg",
});
app.get("/", function (req, res) {
  res.render("home");
});
const defaultentry = [entry1, entry2];
app.get("/resume", function (req, res) {
  res.render("resume");
});
app.get("/contact", function (req, res) {
  res.render("contact",{flag:0});
});
app.post("/contact1", function (request, response) {
  console.log("POST");
  response.send("POST");
  console.log(request.body); //This prints the JSON document received (if it is a JSON document)
  const entry = new contactdb(request.body);

  entry.save()
    .then((result) => {
      console.log(result);
    })

    .catch((err) => {
      console.log(err);
    });

  console.log(request.body);
});
app.post("/display",function(req,res){
  console.log(req.body);
  var mail=req.body.checkmail;
  console.log(mail);
  contactdb.find({email:mail},  function (err, docs) {
    console.log(docs[0].msg);
    res.render("contact", {usermsg:docs[0].msg,flag:1});
  });
  /*const query = contactdb.find();
  query.setOptions({ lean : true });
  query.collection(contactdb.collection);
  query.where('mail').equals(mail);
  console.log(query[0].email +" "+query[0].msg);
  contactdb.find((err, document) => {
    console.log(document);*/
   // console.log(query);
  //res.render("contact", {newListItems:query });
  //});*/
});
app.listen(process.env.PORT ||3000);
