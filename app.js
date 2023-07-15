'use strict';
const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql');

//app.set('view engine', 'pug');
//app.use('/static', express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createConnection({
  host: "database-2.cqn8cvpne99t.us-east-1.rds.amazonaws.com",
  port: "3306",
  user: "admin",
  password: "TableTop",
  database: "launchtrak",
});

/* connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }

  console.log('Connected to the MySQL server.');
  //let createTable = "create table if not exists launchtrak(filename varchar(255),time float,roll float,pitch float,yaw float,ax float,ay float,az float,press float,temp float,hgx float,hgy float,hgz float,a float,v float)";
  let createTable = "CREATE TABLE IF NOT EXISTS `sample_data` (`id` int(10) NOT NULL,`first_name` varchar(250) NOT NULL,`last_name` varchar(250) NOT NULL,`age` varchar(30) NOT NULL,`gender` varchar(30) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=latin1;"
  let insertTable = "INSERT INTO `sample_data` (`id`, `first_name`, `last_name`, `age`, `gender`) VALUES(1, 'John', 'Smith', '26', 'Male'),(2, 'Donna', 'Hubber', '24', 'Female'),(3, 'Peter', 'Parker', '28', 'Male'),(4, 'Tom', 'Muddy', '32', 'Male'),(6, 'Lisa', 'Ray', '26', 'Female');"
  let alterTable = "ALTER TABLE `sample_data` ADD PRIMARY KEY (`id`);"
  let autoInc = "AUTO_INCREMENT for table `sample_data`"
  let alterTable2 = "ALTER TABLE `sample_data` MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;"
  connection.query(createTable, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
    console.log("SQL Command Executed");
  });

  connection.end(function(err) {
    if (err) {
      return console.log(err.message);
    }
  });
}); */

var port = 3000;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

 
app.get("/", (req, res) => {
 res.sendFile(path.join(__dirname+'/index.html'));
});

app.post("/", (req, res) => {
    if(req.body.data != undefined){
      console.log(req.body.title);
      console.log(req.body.data);
      if(req.body.title == -1){
        let sql = "SELECT DISTINCT name FROM uid;";
        connection.connect(function(err) {
          if (err) {
            return console.error('error: ' + err.message);
          }
          console.log('Connected to the MySQL server.');
          connection.query(sql, function(err, results, fields) {
            if (err) {
              console.log(err.message);
            }
            console.log("Got filenames");
            console.log(results);
          });
          connection.end(function(err) {
            if (err) {
              return console.log(err.message);
            }
          });
        });
      }
      var data=[];
      var temp=[];
      var dataArray = req.body.data.split('\n');
      for(let i = 0; i < dataArray.length - 5; i++){
          var lineArray = dataArray[i].split(',');
          //console.log(lineArray.length);
          let d = 0;
          if(lineArray.length > 11){
              if(lineArray[0].match(/^\d/)){
                  let accel = Math.sqrt(lineArray[4]*lineArray[4] + lineArray[5]*lineArray[5] + lineArray[6]*lineArray[6]);
                  if(lineArray[4] < 0 ){
                      accel *= -1;
                  }
                  let prevVelocity = 0;
                  if(d > 0){
                      prevVelocity = data[d - 1].v;
                  }
                  data.push(
                      {
                      time : lineArray[0]/1000000,
                      roll : lineArray[1],
                      pitch: lineArray[2],
                      yaw : lineArray[3],
                      ax : lineArray[4],
                      ay : lineArray[5],
                      az : lineArray[6],
                      press : lineArray[7],
                      temp : lineArray[8],
                      hgx: lineArray[9],
                      hgy : lineArray[10],
                      hgz : lineArray[11],
                      acc : accel,
                      vel : accel*lineArray[0]/1000000 + prevVelocity, 
                      altitude : ((Math.pow((1013.25/(lineArray[7]/100)), (1/5.257)) - 1.0) * (lineArray[8] + 273.15)),
                      }
                  )
                  if(d == 0){
                      temp.push(lineArray[0]/1000000);
                      for(let t = 1; t < 12; t++){
                          temp.push(lineArray[t]/1000000);
                      }
                  }
                  d = d + 1;
              }
          }
      }
      let createTable = "CREATE TABLE IF NOT EXISTS `uid` (`time` DOUBLE, `roll` DOUBLE, `pitch` DOUBLE, `yaw` DOUBLE, `ax` DOUBLE, `ay` DOUBLE, `az` DOUBLE, `press` DOUBLE, `temp` DOUBLE, `hgx` DOUBLE, `hgy` DOUBLE, `hyz` DOUBLE, `name` VARCHAR(30)) ENGINE=InnoDB DEFAULT CHARSET=latin1;"
      let insertTable = "INSERT INTO `uid` (`time`, `roll`, `pitch`, `yaw`, `ax`, `ay`, `az`, `press`, `temp`, `hgx`, `hgy`, `hyz`, `name`) VALUES ('" + temp[0] + "', '" + temp[1] + "', '" + temp[2] + "', '" + temp[3] + "', '" + temp[4] + "', '" + temp[5] + "', '" + temp[6] + "', '" + temp[7] + "', '" + temp[8] + "', '" + temp[9] + "', '" + temp[10] + "', '" + temp[11] + "', '" + req.body.title + "');"
      connection.connect(function(err) {
          if (err) {
            return console.error('error: ' + err.message);
          }
          console.log('Connected to the MySQL server.');
          connection.query(createTable, function(err, results, fields) {
            if (err) {
              console.log(err.message);
            }
            console.log("Table Created");
          });
          for(let i = 0; i < 100; i++){
              insertTable = "INSERT INTO `uid` (`time`, `roll`, `pitch`, `yaw`, `ax`, `ay`, `az`, `press`, `temp`, `hgx`, `hgy`, `hyz`, `name`) VALUES ('" + data[i].time + "', '" + data[i].roll + "', '" + data[i].pitch + "', '" + data[i].yaw + "', '" + data[i].ax + "', '" + data[i].ay + "', '" + data[i].az + "', '" + data[i].press + "', '" + data[i].temp + "', '" + data[i].hgx + "', '" + data[i].hgy + "', '" + data[i].hgz + "', '" + req.body.title + "');"
              connection.query(insertTable, function(err, results, fields) {
                  if (err) {
                  console.log(err.message);
                  }
                  console.log("Table Created");
              });
          }
          connection.end(function(err) {
            if (err) {
              return console.log(err.message);
            }
          });
        });
    }
    res.sendFile(path.join(__dirname+'/index.html'));
});
 
app.listen(port, () => {
 console.log("Server listening on port " + port);
});