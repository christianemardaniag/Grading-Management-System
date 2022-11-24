$(document).ready(function () {

});

// CHART #1: GRADE PER YEAR LEVEL
var ctxChart1 = document.getElementById('chart1').getContext('2d');
var chart1 = new Chart(ctxChart1, {
    type: 'bar',
    plugins: [ChartDataLabels],
    data: {
        labels: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
        datasets: [{
            label: ["Passed"],
            data: [87, 97, 76, 84],
            backgroundColor: ['#eeb902', '#f79c06', '#bb7e00', '#76320d'],
        }]
    }, options: {
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
            datalabels: {
                anchor: 'end',
                align: 'bottom',
                color: 'white'
            }
        }, scales: {
            y: { min: 50, max: 100 }
        }
    },
});

// CHART #2: GRADE PER SUBJECT
var ctxChart2 = document.getElementById('chart2').getContext('2d');
var chart2 = new Chart(ctxChart2, {
    type: 'line',
    plugins: [ChartDataLabels],
    data: {
        labels: ["IT 107", "PCM 101", "MMW 101", "UTS 101", "PAL101", "PE 11", "NSTP 11"],
        datasets: [{
            data: [87, 97, 76, 84, 67, 84, 94],
            backgroundColor: ['#eeb90215'],
            borderColor: '#eeb902',
            fill: true,
            tension: 0.4
        }
        ]
    }, options: {
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
            datalabels: {
                anchor: 'start',
                align: 'bottom',
                color: 'black'
            }
        }, scales: {
            y: {
                min: 50,
                max: 100,
            },
        },
        pointBackgroundColor: "#eeb902",
        radius: 7,
    },
});

