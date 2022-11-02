$(document).ready(function () {
    // $.ajax({
    //     type: "post",
    //     url: "../dashboard/process.dashboard.php",
    //     data: { respondentChart: true },
    //     dataType: "JSON",
    //     success: function (response) {
    //         var resp = 0;
    //         $.each(response, function (i, data) {
    //             resp += parseInt(data.total);
    //             addData(studentsPerYearLevelChart, data.strand, data.total);
    //         });
    //         $("#totalRespondent").html(resp.toLocaleString());
    //     }
    // });
});


// var ctxstudentsPerYearLevelChart = document.getElementById('studentsChart').getContext('2d');
// var studentsPerYearLevelChart = new Chart(ctxstudentsPerYearLevelChart, {
//     type: 'doughnut',
//     data: {
//         labels: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
//         datasets: [{
//             data: [30, 24, 32, 29],
//             backgroundColor: [
//                 '#eeb902',
//                 '#f79c06',
//                 '#bb7e00',
//                 '#76320d',
//             ],
//         }]
//     }, options: {
//         // maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 display: false
//             },
//             title: {
//                 display: false
//             }
//         }
//     },
// });

// var ctxpassingRateChart = document.getElementById('passingRateChart').getContext('2d');
// var passingRateChart = new Chart(ctxpassingRateChart, {
//     type: 'doughnut',
//     data: {
//         labels: ["Passed", "Failed"],
//         datasets: [{
//             data: [30, 70],
//             backgroundColor: [
//                 '#eeb902',
//                 '#76320d',
//                 '#f79c06',
//                 '#bb7e00',
//             ],
//         }]
//     }, options: {
//         // maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 display: false
//             },
//             title: {
//                 display: false
//             }
//         }
//     },
// });

var ctxgradeCriteriaAverageChart = document.getElementById('gradeCriteriaAverageChart').getContext('2d');
var gradeCriteriaAverageChart = new Chart(ctxgradeCriteriaAverageChart, {
    type: 'bar',
    plugins: [ChartDataLabels],
    data: {
        labels: ['Activities/Project', 'Quizes', 'Recitation', 'Promtness', 'Major Exam'],
        datasets: [{
            label: ["4A"],
            data: [87, 98, 82, 84, 95],
            backgroundColor: ['#eeb902']
        }, {
            label: ["4B"],
            data: [77, 88, 88, 81, 85],
            backgroundColor: ['#f79c06']
        }, {
            label: ["4C"],
            data: [87, 78, 90, 91, 81],
            backgroundColor: ['#bb7e00']
        }, {
            label: ["4D"],
            data: [96, 85, 87, 86, 79],
            backgroundColor: ['#76320d']
        }]
    }, options: {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false
            },
            datalabels: {
                anchor: 'end',
                align: 'bottom',
                color: 'white'
                // formatter: Math.round,
                // font: {
                //     weight: 'bold'
                // }
            }
        },
        scales: {
            y: {
                min: 50,
                max: 100
            }
        }
    },
});
