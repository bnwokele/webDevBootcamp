
// These are our required libraries to make the server work.
// We're including a server-side version of Fetch to build on your client-side work
const express = require('express');
const fetch = require('node-fetch');

// Here we instantiate the server we're going to turn on
const app = express();


// Servers are often subject to the whims of their environment.
// Here, if our server has a PORT defined in its environment, it will use that.
// Otherwise, it will default to port 3000
const port = process.env.PORT || 3000;


// Our server needs certain features - like the ability to send and read JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// And the ability to serve some files publicly, like our HTML.
app.use(express.static('public'));

let zipcode = {};

function processDataForFrontEnd(req, res) {
  const crimeDateURL = 'https://data.princegeorgescountymd.gov/resource/wb4e-w4nf.json'
  //data point zipcode adder
  fetch(crimeDateURL)
  .then((data) => data.json())
  .then((data) => { 
    for(let i= 0; i< data.length;i++) {
      if(data[i].clearance_code_inc_type == "ACCIDENT"){
        let latitude = data[i].latitude; // get the lat and long of the accident incident
        let long= data[i].longitude 
        // api to change lat and long to zipcode
        let url ="http://api.geonames.org/findNearbyPostalCodesJSON?lat="+latitude+"&lng="+long+"&username=tyleigh";
        // let url ="http://api.geonames.org/findNearbyPostalCodesJSON?lat="+latitude+"&lng="+long+"&username=bnwokele";
        fetch(url)//make call to the zipcode api
          .then((rep) => rep.json())
          .then((rep) => {
            let arr= JSON.stringify(rep).split(" ");
            let start=arr[1].search("postalCode");
            let zip= parseInt(arr[1].substring(start+13,start+18));
            if (!(zip == NaN) && !(zip in zipcode)){zipcode[zip]=[]; }
              let temp = zipcode[zip];
              temp.push([latitude, long]);
              zipcode[zip] = temp;// gives the zipcode
              return zipcode;
          })
          .then((rep) => {
            if (i == 5 - 1){
              console.log(rep)
              res.send({rep}); // here's where we return data to the front end
            }
            })
          .catch((err) => {
            console.log(err);
            res.redirect('/error');
          });
      }
    }
  })
// .catch((err) => {
//   console.log(err);
//   res.redirect('/error');
// });
}

// This is our first route on our server.
// To access it, we can use a "GET" request on the front end
// by typing in: localhost:3000/api or 127.0.0.1:3000/api
app
.route('/api')
.get((req, res) => {processDataForFrontEnd(req, res)});
// .post((req, res) => {
//   console.log("/api post request", req.body);
//   if (!req.body.name) {
//     console.log(req.body);
//     res.status("418").send("something went wrong, additionally i am a teapot");
//   } else {
//     writeUser(req.body.name, dbSettings)
//     .then((result) => {
//       console.log(result);
//       res.send("your request was successful"); // simple mode
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   }
// })
// .put((req, res) => {
//   console.log("/api put request", req.body);
//   if (!req.body.name) {
//     console.log(req.body);
//     res.status("418").send("something went wrong, additionally i am a teapot");
//   } else {
//     writeUser(req.body.name, dbSettings)
//     .then((result) => {
//       console.log(result);
//       res.json( {response : "A successful request was made!!!"} ); // simple mode
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   }
// });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
