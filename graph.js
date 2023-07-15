    var chartDataThrust = [];
    var chartDataExhaustVelocity = [];
    var chartDataMass = [];
    var chartDataPressure = [];
    var chartDataAcceleration = [];
    var chartDataVelocity = [];
    var chartDataHeight = [];
    function loadGraph(){
        // Thrust

        var dataSeriesThrust = {type : "line"};
        var dataPointsThrust = [];
        for(var i = 0; i < data.length; i++){
            dataPointsThrust.push({
                x : data[i].time,
                y : data[i].acc
            });
        }
        dataSeriesThrust.dataPoints = dataPointsThrust;
        chartDataThrust.push(dataSeriesThrust);
        var chartThrust = new CanvasJS.Chart("Thrust", {
            animationEnabled: true,
            zoomEnabled: true,
            title:{
                text: "Thrust vs Time" 
            },
            data: chartDataThrust
        });
        chartThrust.render();

        // Exhaust Velocity

        var dataSeriesExhaustVelocity = {type : "line"};
        var dataPointsExhaustVelocity = [];
        for(var i = 0; i < data.length; i++){
            dataPointsExhaustVelocity.push({
                x : data[i].time,
                y : data[i].acc
            });
        }
        dataSeriesExhaustVelocity.dataPoints = dataPointsExhaustVelocity;
        chartDataExhaustVelocity.push(dataSeriesExhaustVelocity);
        var chartExhaustVelocity = new CanvasJS.Chart("ExhaustVelocity", {
            animationEnabled: true,
            zoomEnabled: true,
            title:{
                text: "Exhaust Velocity vs Time" 
            },
            data: chartDataExhaustVelocity
        });
        chartExhaustVelocity.render();

        //  Pressure

        var dataSeriesPressure = {type : "line"};
        var dataPointsPressure = [];
        for(var i = 0; i < data.length; i++){
            dataPointsPressure.push({
                x : data[i].time,
                y : data[i].acc
            });
        }
        dataSeriesPressure.dataPoints = dataPointsPressure;
        chartDataPressure.push(dataSeriesPressure);
        var chartPressure = new CanvasJS.Chart("Pressure", {
            animationEnabled: true,
            zoomEnabled: true,
            title:{
                text: "Pressure vs Time" 
            },
            data: chartDataPressure
        });
        chartPressure.render();

        // Mass

        var dataSeriesMass = {type : "line"};
        var dataPointsMass = [];
        for(var i = 0; i < data.length; i++){
            dataPointsMass.push({
                x : data[i].time,
                y : data[i].acc
            });
        }
        dataSeriesMass.dataPoints = dataPointsMass;
        chartDataMass.push(dataSeriesMass);
        var chartMass = new CanvasJS.Chart("Mass", {
            animationEnabled: true,
            zoomEnabled: true,
            title:{
                text: "Mass vs Time" 
            },
            data: chartDataMass
        });
        chartMass.render();

        // Acceleration

        var dataSeriesAcceleration = {type : "line"};
        var dataPointsAcceleration = [];
        for(var i = 0; i < data.length; i++){
            dataPointsAcceleration.push({
                x : data[i].time,
                y : data[i].acc
            });
        }
        dataSeriesAcceleration.dataPoints = dataPointsAcceleration;
        chartDataAcceleration.push(dataSeriesAcceleration);
        var chartAcceleration = new CanvasJS.Chart("Acceleration", {
            animationEnabled: true,
            zoomEnabled: true,
            title:{
                text: "Acceleration vs Time" 
            },
            data: chartDataAcceleration
        });
        chartAcceleration.render();

        // Velocity

        var dataSeriesVelocity = {type : "line"};
        var dataPointsVelocity = [];
        for(var i = 0; i < data.length; i++){
            dataPointsVelocity.push({
                x : data[i].time,
                y : data[i].acc
            });
        }
        dataSeriesVelocity.dataPoints = dataPointsVelocity;
        chartDataVelocity.push(dataSeriesVelocity);
        var chartVelocity = new CanvasJS.Chart("Velocity", {
            animationEnabled: true,
            zoomEnabled: true,
            title:{
                text: "Velocity vs Time" 
            },
            data: chartDataVelocity
        });
        chartVelocity.render();

        // Height

        var dataSeriesHeight = {type : "line"};
        var dataPointsHeight = [];
        for(var i = 0; i < data.length; i++){
            dataPointsHeight.push({
                x : data[i].time,
                y : data[i].acc
            });
        }
        dataSeriesHeight.dataPoints = dataPointsHeight;
        chartDataHeight.push(dataSeriesHeight);
        var chartHeight = new CanvasJS.Chart("Height", {
            animationEnabled: true,
            zoomEnabled: true,
            title:{
                text: "Height vs Time" 
            },
            data: chartDataHeight
        });
        chartHeight.render();
        // for(let i = 0; i < ctx.length; i++){
        //     ctx[i] = document.getElementById(ctxNames[i]);
        // }
        // new Chart("Thrust", {
        //     type: "line",
        //     data: {
        //         labels: data.map(row => row.time),
        //         datasets: [
        //         {
        //             label: 'Thrust vs Time',
        //             data: data.map(row => row.acc)
        //         }
        //         ]
        //     },
        // });
        // new Chart("ExhaustVelocity", {
        //     type: "line",
        //     data: {
        //         labels: data.map(row => row.time),
        //         datasets: [
        //         {
        //             label: 'Exhaust Velocity vs Time',
        //             data: data.map(row => row.vel)
        //         }
        //         ]
        //     },
        //     options: {
        //         elements: {
        //             point:{
        //                 radius: 0
        //             }
        //         }
        //     }
        // });
        // new Chart("Pressure", {
        //     type: "line",
        //     data: {
        //         labels: data.map(row => row.time),
        //         datasets: [
        //         {
        //             label: 'Pressure vs Time',
        //             data: data.map(row => row.altitude),
        //         }
        //         ]
        //     },
        //     options: {
        //         elements: {
        //             point:{
        //                 radius: 0
        //             }
        //         }
        //     }
        // });
        // new Chart("Mass", {
        //     type: "line",
        //     data: {
        //         labels: data.map(row => row.time),
        //         datasets: [
        //         {
        //             label: 'Mass vs Time',
        //             data: data.map(row => row.altitude)
        //         }
        //         ]
        //     },
        //     options: {
        //         elements: {
        //             point:{
        //                 radius: 0
        //             }
        //         }
        //     }
        // });
        // new Chart("Acceleration", {
        //     type: "line",
        //     data: {
        //         labels: data.map(row => row.time),
        //         datasets: [
        //         {
        //             label: 'Acceleration vs Time',
        //             data: data.map(row => row.acc),
        //             fill: false,
        //             borderColor: 'rgb(75, 192, 192)',
        //             tension: 0.1
        //         }
        //         ]
        //     },
        //     options: {
        //         elements: {
        //             point:{
        //                 radius: 0
        //             }
        //         }
        //     }
        // });
        // new Chart("Velocity", {
        //     type: "line",
        //     data: {
        //         labels: data.map(row => row.time),
        //         datasets: [
        //         {
        //             label: 'Velocity vs Time',
        //             data: data.map(row => row.altitude)
        //         }
        //         ]
        //     },
        //     options: {
        //         elements: {
        //             point:{
        //                 radius: 0
        //             }
        //         }
        //     }
        // });
        // new Chart("Height", {
        //     type: "line",
        //     data: {
        //         labels: data.map(row => row.time),
        //         datasets: [
        //         {
        //             label: 'Height vs Time',
        //             data: data.map(row => row.altitude)
        //         }
        //         ]
        //     },
        //     options: {
        //         elements: {
        //             point:{
        //                 radius: 0
        //             }
        //         }
        //     }
        // });
    }