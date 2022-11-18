$(document).ready(function () {
    
});

var ctxstudentProgressChart = document.getElementById('studentProgress').getContext('2d');
var studentProgressChart = new Chart(ctxstudentProgressChart, {
    type: 'doughnut',
    data: {
        // labels: ["Passed", "Failed"],
        datasets: [{
            data: [20, 50],
            backgroundColor: ['#eeb902', '#fbff0024'],
        }]
    }, options: {
        plugins: {
            legend: { display: false },
            title: { display: false }
        }
    },
});
