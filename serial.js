    var port, textEncoder, writableStreamClosed, writer = -1;
    // 0 = Load Files, 1 = Open File
    var mode = 0;
    const filenames = [];
    var next = 0;
    var printFile = false;
    var currentDataString = "";
    var data = [];
    var rawData = "";
    var localText = "";
    var valuesOfInterest = [];
    async function connectSerial() {
        try {
            port = await navigator.serial.requestPort();
            //await port.open({ baudRate: document.getElementById("baud").value });
            await port.open({ baudRate: 115200 });
            let settings = {};

            settings.dataTerminalReady = true;
            settings.requestToSend = true;
            if (Object.keys(settings).length > 0) await port.setSignals(settings);
  
            
            textEncoder = new TextEncoderStream();
            writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
            writer = textEncoder.writable.getWriter();
            await listenToPort();
        } catch (e){
            alert("Serial Connection Failed" + e);
        }
    }
    async function sendSerialLine() {
        dataToSend = document.getElementById("lineToSend").value;
        dataToSend = dataToSend + "\r";
        //appendToTerminal("> " + dataToSend);
        await writer.write(dataToSend);
        if (dataToSend.trim().startsWith('\x03')) echo(false);
        document.getElementById("lineToSend").value = "";
    }
    async function refreshFiles() {
        dataToSend = "L";
        mode = 0;
        dataToSend = dataToSend + "\r";
        //appendToTerminal("> " + dataToSend);
        await writer.write(dataToSend);
        if (dataToSend.trim().startsWith('\x03')) echo(false);
    }
    async function viewFileData(){
        dataToSend = "B";
        mode = 1;
        dataToSend = dataToSend + "\r";
        //appendToTerminal("> " + dataToSend);
        await writer.write(dataToSend);
        if (dataToSend.trim().startsWith('\x03')) echo(false);
        await delay(1000);
        openFile();
        await delay(3000);
        dumpFile();
        await delay(2000);
        mode = 0;
        //currentDataString = serialResultsDiv.innerText;
        currentDataString = rawData;
        console.log("Done Loading Data");
        //document.getElementById("dataHolder").innerHTML = currentDataString;
        //var dataArray = document.getElementById("serialResults").innerText.split('\n');
        var dataArray = rawData.split('\n');
        createDataArray(dataArray);
    }
    async function openFile(){
        dataToSend = localStorage.filename;
        dataToSend = dataToSend.substring(3,6);
        dataToSend = dataToSend + "\r";
        //appendToTerminal("> " + dataToSend);
        await writer.write(dataToSend);
        if (dataToSend.trim().startsWith('\x03')) echo(false);
    }
    async function dumpFile(){
        dataToSend = "H";
        dataToSend = dataToSend + "\r";
        //appendToTerminal("> " + dataToSend);
        await writer.write(dataToSend);
        if (dataToSend.trim().startsWith('\x03')) echo(false);
    }
    async function downloadFileData(){
        //await save(localStorage.filename + ".txt",currentDataString);
        let dbfilename = prompt("Enter a filename");
        const body = {
            userId: 1,
            title: dbfilename,
            data: currentDataString,
            completed: false
        };
        $.post("/", body, (data, status) => {
            console.log(data);
        });
    }
    async function getDatabaseFilenames(){
        const body = {
            userId: 1,
            title: -1,
            data: [],
            completed: false
        };
        $.post("/", body, (data, status) => {
            console.log(data);
        });
    }
    function save(filename, data) {
        const blob = new Blob([data], {type: 'text/csv'});
        if(window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        }
        else{
            const elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(blob);
            elem.download = filename;        
            document.body.appendChild(elem);
            elem.click();        
            document.body.removeChild(elem);
        }
    }
    async function viewTable(){
        console.log("generate table");
        let table = document.querySelector("table");
        generateTableHead(table, Object.keys(data[0]))
        generateTable(table, data);
    }
    function generateTableHead(table, data) {
        let thead = table.createTHead();
        let row = thead.insertRow();
        for (let key of data) {
            let th = document.createElement("th");
            let text = document.createTextNode(key);
            th.appendChild(text);
            row.appendChild(th);
        }
    }
    function generateTable(table, data) {
        for (let element of data) {
            let row = table.insertRow();
            for (key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
            }
        }
    }
    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
    function clearData(){
        //serialResultsDiv.innerHTML = '';
        currentDataString = '';
        rawData = '';
        printFile = false;
    }
    function useLocalData(){
        var dataArray = localText.split('\n');
        createDataArray(dataArray);

    }
    function createDataArray(dataArray){
        console.log(dataArray.length);
        console.log(dataArray[20]);
        var initial_acceleration = 0;
        var a_i = 0;
        var initial_altitude = 0;
        var d = 0;
        var start_thrust_time = 0;
        var end_thrust_time = 0;
        var started_thrust = false;
        var ended_thrust = false;
        var thrust_time = 0;
        var previous_time = 0.0;
        var previous_acceleration = 0.0;
        var velocity = 0.0;
        var coast_time = 0.0;
        var apogee_time = 0.0;
        var apogee_altitude = 0.0;
        var max_altitude = 0;
        var min_altitude = 0;
        var max_altitude_time = 0;
        var max_thrust = 0;
        var avg_thrust = 0;
        var avg_thrust_count = 0;
        var max_highG_accel_mag = 0;
        var total_flight_time = 0;
        var end_of_flight_time = 0;
        var top_speed = 0;
        var decent_speed = 0;
        for(let i = 0; i < dataArray.length - 5; i++){
                var lineArray = dataArray[i].split(',');
                //console.log(lineArray.length);
                if(lineArray.length > 11){
                    if(lineArray[0].match(/^\d/)){

                        var current_time = lineArray[0]/1000000;

                        // Acceleration = sqrt(ax^2 + ay^2 + az^2)

                        let x = lineArray[4];
                        let y = lineArray[5];
                        let z = lineArray[6];
                        let pitch = lineArray[2];
                        let roll = lineArray[1];
                        let yaw = lineArray[3];

                        // Convert angles to radians
                        let pitchRad = pitch * Math.PI / 180.0;
                        let rollRad = roll * Math.PI / 180.0;
                        let yawRad = yaw * Math.PI / 180.0;

                        // Calculate direction of acceleration
                        let accX = x * Math.cos(pitchRad) * Math.cos(yawRad) + y * (Math.cos(rollRad) * Math.sin(pitchRad) * Math.cos(yawRad) - Math.sin(rollRad) * Math.sin(yawRad)) + z * (Math.sin(rollRad) * Math.sin(yawRad) + Math.cos(rollRad) * Math.sin(pitchRad) * Math.cos(yawRad));
                        let accY = x * Math.cos(pitchRad) * Math.sin(yawRad) + y * (Math.cos(rollRad) * Math.sin(pitchRad) * Math.sin(yawRad) + Math.sin(rollRad) * Math.cos(yawRad)) + z * (-Math.sin(rollRad) * Math.cos(yawRad) + Math.cos(rollRad) * Math.sin(pitchRad) * Math.sin(yawRad));
                        let accZ = -x * Math.sin(pitchRad) + y * Math.sin(rollRad) * Math.cos(pitchRad) + z * Math.cos(rollRad) * Math.cos(pitchRad);
                        var accel = Math.sqrt(x*x + y*y + z*z);

                        if(pitchRad < 0 ){
                            accel *= -1;
                        }

                        if(d == 0){
                            initial_acceleration = accel;
                        }
                        

                        // Velocity
                        var deltaTime = current_time - previous_time;
                        var deltaV = (deltaTime/2.0)*(previous_acceleration + accel);
                        velocity += deltaV;


                        // Altitude
                        var seaLevelPressure = 101325.0
                        var pressure = lineArray[7];
                        var temperature = parseFloat(lineArray[8]);
                        //let altitude = ((39.37 + 273.15)/.0065);
                        var altitude = ((1.0 - Math.pow((pressure / seaLevelPressure), (1.0 / 5.257))) * ((temperature + 273.15)/.0065));
                        if(d == 0){
                            initial_altitude = altitude;
                            console.log("Initial Altitude: " + initial_altitude);
                        }
                        altitude -= initial_altitude;

                        // Points of Interest

                        // Thrust Time
                        if( accel > 15.0 && !started_thrust){
                            start_thrust_time = current_time;
                            started_thrust = true;
                        }

                        if(started_thrust && !ended_thrust){
                            if(Math.abs(accel) > max_thrust){
                                max_thrust = Math.abs(accel);
                            }
                            avg_thrust = avg_thrust + Math.abs(accel);
                            avg_thrust_count = avg_thrust_count + 1;
                            if(accel < 9.80 ){
                                end_thrust_time = current_time;
                                console.log("Start thrust time: " + start_thrust_time);
                                console.log("End thrust time: " + end_thrust_time);
                                console.log("Total thrust time: " + (end_thrust_time - start_thrust_time));
                                ended_thrust = true;
                                thrust_time = end_thrust_time - start_thrust_time;

                                avg_thrust = avg_thrust / avg_thrust_count;
                            }
                        }

                        // Apogee Altitude
                        if(d == 0){
                            min_altitude = altitude;
                        }
                        if(thrust_time > 0){
                            if(altitude > max_altitude){
                                max_altitude = altitude;
                                max_altitude_time = current_time;
                            }
                        }

                        // Max High G Accel Magnitude
                        var hgx = lineArray[9];
                        var hgy = lineArray[10];
                        var hgz = lineArray[11];
                        var highG_accel_mag = Math.sqrt((hgx*hgx) + (hgy*hgy) + (hgz*hgz));
                        if(highG_accel_mag > max_highG_accel_mag){
                            max_highG_accel_mag = highG_accel_mag;
                            end_of_flight_time = current_time;
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
                            vel : velocity, 
                            altitude : altitude,
                            }
                        )
                        d = d + 1;
                        previous_acceleration = accel;
                        previous_time = lineArray[0]/1000000;
                    }
                }
            }
        decent_speed = apogee_altitude / (total_flight_time - apogee_time);
        top_speed = avg_thrust*thrust_time;
        total_flight_time = end_of_flight_time - start_thrust_time;
        apogee_altitude = max_altitude - min_altitude;
        apogee_time = max_altitude_time - start_thrust_time;
        coast_time = apogee_time - thrust_time;
        console.log("Data length: " + data.length);
        console.log(data[0]);
    }
    function previewFile() {
        const [file] = document.querySelector("input[type=file]").files;
        const reader = new FileReader();
      
        reader.addEventListener(
          "load",
          () => {
            localText = reader.result;
            useLocalData();
          },
          false,
        );
      
        if (file) {
          reader.readAsText(file);
        }
      }
    async function listenToPort() {
        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable.getReader();

        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                console.log('[readLoop] DONE', done);
                reader.releaseLock();
                break;
            }
            if(mode == 0){
                //console.log("Done loading files\n");
                //console.log(value);
                await delay(500);
                var list = document.getElementById('filenames');
                const fileArray = value.split(" ");
                fileArray.forEach(function(item){
                    if(!filenames.includes(item) && item.startsWith("ltk")){
                        item = item.substring(0,10);
                        var option = document.createElement('option');
                        option.value = item;
                        list.appendChild(option);
                        filenames.push(value);
                    }
                });
            }
            if(mode == 1){
                if(value.startsWith('@')){
                    printFile = !printFile;
                    await delay(100);
                }
                else if(printFile){
                    appendToTerminal(value);
                }
            }
        }
    }
    async function appendToTerminal(newStuff) {
        rawData += newStuff;
    }
    //document.getElementById("baud").value = (localStorage.baud == undefined ? 115200 : localStorage.baud);