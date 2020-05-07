       // zipcode collector
       let zipcode = {};
       fetch('https://data.princegeorgescountymd.gov/resource/rv3k-ecwy.json')
        .then((data) => data.json())
        .then((data) => { 
          for(let i= 0; i<data.length;i++){
            zipcode[i]=data[i].zip_code;
          }
          return data;
        })
      
      // data point zipcode adder
      fetch('https://data.princegeorgescountymd.gov/resource/wb4e-w4nf.json')
        .then((data) => data.json())
        .then((data) => { 
          // console.log(data);
          for(let i= 0; i<=0;i++) {
            if(data[i].clearance_code_inc_type == "ACCIDENT"){
              let latitude = data[i].latitude;
              let long= data[i].longitude
              url ="http://api.geonames.org/findNearbyPostalCodesJSON?lat="+latitude+"&lng="+long+"&username=tyleigh";
              // str= str.replace(/[ ]/g,"+");
              // url ="http://www.google.com/search?hl=en&source=hp&q=" + str +"&aq=f&oq=&aqi=";
              // console.log(url);
              fetch(url)//searches the zipcode api
                .then((rep) => rep.json())
                .then(rep => {
                  let arr= JSON.stringify(rep).split(" ");
                  start=arr[1].search("postalCode")
                  let code = []
                  code.push(parseInt(arr[1].substring(start+13,start+18)));// gives the zipcode   
                  return code;
                });
           }
         }
       })
        // .then((data) => { 
        //   for(let i= 0; i<zipcode.length;i++){
            
        //   }
        //   return data;
        // })



