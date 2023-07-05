var port, textEncoder, writableStreamClosed, writer = -1;
    // 0 = Load Files, 1 = Open File
    var mode = 0;
    const filenames = [];
    var next = 0;
    var printFile = false;
    var currentDataString = "";
    var data = [];
    var rawData = "";
    async function connectSerial() {
        try {
            port = await navigator.serial.requestPort();
            await port.open({ baudRate: document.getElementById("baud").value });
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
        document.getElementById("dataHolder").innerHTML = currentDataString;
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
        const body = {
            userId: 1,
            title: "test",
            data: currentDataString,
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
        //var dataArray = document.getElementById("serialResults").innerText.split('\n');
        var dataArray = rawData.split('\n');
        console.log(dataArray.length);
        console.log(dataArray[20]);
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
                        d = d + 1;
                    }
                }
            }
        console.log("Data length: " + data.length);
        console.log(data[0]);
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
    async function listenToPort() {
        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable.getReader();

        // Listen to data coming from the serial device.
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                // Allow the serial port to be closed later.
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
    document.getElementById("baud").value = (localStorage.baud == undefined ? 115200 : localStorage.baud);