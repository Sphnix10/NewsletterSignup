const express = require("express");
const bodyParser = require("body-Parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/Signup.html");
});
app.post("/", function(req, res) {
  const firstname = req.body.fname;
  const lastname = req.body.lname;
  const email = req.body.email;
  console.log(firstname, lastname, email);

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstname,
        LNAME: lastname
      },
    }]
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us14.api.mailchimp.com/3.0/lists/39692c2bed";

  const options = {
    method: "POST",
    auth: "Arvind:44095ed9cfe48b8fb6ba343485d9747a-us14"
  };
  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
      // res.send("successful");
    } else {
      res.sendFile(__dirname + "/failure.html");
      // res.send("failure");
    }


    response.on("data", function(data) {

      console.log(JSON.parse(data));
    })
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res) {
  res.redirect("/")
})
app.listen (process.env.PORT || 3000, function() {
  console.log("server is running on port 3000");
});
