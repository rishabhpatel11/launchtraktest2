    var chartDataPressure = [];
    var chartDataAcceleration = [];
    var chartDataVelocity = [];
    var chartDataHeight = [];
    var chartPressure;
    function loadGraph(){

        // Acceleration

        var dataSeriesAcceleration = {type : "line", name: "acceleration", showInLegend: true,};
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

        var dataSeriesVelocity = {type : "line", name: "velocity", showInLegend: true};
        var dataPointsVelocity = [];
        for(var i = 0; i < data.length; i++){
            dataPointsVelocity.push({
                x : data[i].time,
                y : data[i].vel
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

        var dataSeriesHeight = {type : "line", name: "height", showInLegend: true,};
        var dataPointsHeight = [];
        for(var i = 0; i < data.length; i++){
            dataPointsHeight.push({
                x : data[i].time,
                y : data[i].altitude
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

        // Combined

        var dataSeriesPressure = {type : "line"};
        var dataPointsPressure = [];
        for(var i = 0; i < data.length; i++){
            dataPointsPressure.push({
                x : data[i].time,
                y : data[i].press
            });
        }
        dataSeriesPressure.dataPoints = dataPointsPressure;
        chartDataPressure.push(dataSeriesPressure);
        chartPressure = new CanvasJS.Chart("Pressure", {
            animationEnabled: true,
	        exportEnabled: true,
            zoomEnabled: true,
            title:{
                text: "Acceleration, Velocity, Height vs Time" 
            },
            toolTip: {
                shared: true
            },
            legend:{
                cursor:"pointer",
                itemclick: toggleDataSeries
            },
            data: [dataSeriesAcceleration, dataSeriesHeight, dataSeriesVelocity]
        });
        chartPressure.render();
    }
    function toggleDataSeries(e) {
        if(typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        }
        else {
            e.dataSeries.visible = true;            
        }
        chartPressure.render();
    }