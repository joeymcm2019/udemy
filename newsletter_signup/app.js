const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.listen(process.env.PORT || 3000, function(req, res){
 console.log("Server up on port 3000");
});

app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data); 

    const url = "https://us10.api.mailchimp.com/3.0/lists/e435f28e83";

    const options = {
        method: "POST",
        auth: "joey:e8f2a4f03c7120b3827333d3e2ac29b0-us10"        
    };

    const request = https.request(url, options, function(response){
        response.on("data", function(data){
            var dataParsed = JSON.parse(data);
            if (dataParsed.error_count == "0"){
                console.log("SUCCESS");
                res.sendFile(__dirname + "/success.html");
            }
            else{
                console.log("Failure");
                res.sendFile(__dirname + "/failure.html");
            }
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req,res){
    res.redirect("/");
});


//api key
//e8f2a4f03c7120b3827333d3e2ac29b0-us10

// audience id: e435f28e83