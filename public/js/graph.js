var ctx1 = null;
var ctx2 = null;
var ctx3 = null;
function loadGraph(){
    ctx1 = document.getElementById('Acceleration');
    ctx2 = document.getElementById('Velocity');
    ctx3 = document.getElementById('Altitude');
    new Chart("Acceleration", {
        type: "line",
        data: {
            labels: data.map(row => row.time),
            datasets: [
            {
                label: 'Acceleration (m/s^2) over time',
                data: data.map(row => row.acc)
            }
            ]
        },
        options:{}
    });
    new Chart("Velocity", {
        type: "line",
        data: {
            labels: data.map(row => row.time),
            datasets: [
            {
                label: 'Velocity (m/s) over time',
                data: data.map(row => row.vel)
            }
            ]
        },
        options:{}
    });
    new Chart("Altitude", {
        type: "line",
        data: {
            labels: data.map(row => row.time),
            datasets: [
            {
                label: 'Altitude (m) over time',
                data: data.map(row => row.altitude)
            }
            ]
        },
        options:{}
    });
}