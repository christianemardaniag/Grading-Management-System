$(document).ready(function () {
    var myStudents = [];
    $.ajax({
        type: "POST",
        url: "../dashboard/process.dashboard.php",
        data: { GET_STUDENTS_REQ: true },
        dataType: "JSON",
        success: function (GET_STUDENTS_RESP) {
            myStudents = GET_STUDENTS_RESP;
            console.log(myStudents);
            let yearLevelCount = [0, 0, 0, 0];
            let prCtr = [0, 0, 0, 0];
            let frCtr = [0, 0, 0, 0];
            $.each(myStudents, function (stud_index, stud) {
                switch (stud.level.toUpperCase()) {
                    case "1ST YEAR": yearLevelCount[0]++; isPassed(stud) ? prCtr[0]++ : frCtr[0]++; break;
                    case "2ND YEAR": yearLevelCount[1]++; isPassed(stud) ? prCtr[1]++ : frCtr[1]++; break;
                    case "3RD YEAR": yearLevelCount[2]++; isPassed(stud) ? prCtr[2]++ : frCtr[2]++; break;
                    case "4TH YEAR": yearLevelCount[3]++; isPassed(stud) ? prCtr[3]++ : frCtr[3]++; break;
                    default: break;
                }
            });

            let studentCount = myStudents.length;
            $("#studentCount").html(studentCount);

            // CHART #1: NUMBER OF STUDENT PER  YEAR LEVEL
            chart1.data.datasets[0].data = yearLevelCount;
            chart1.update();

            // CHART #2: PASSING RATE PER YEAR LEVEL
            for (let x = 0; x < yearLevelCount.length; x++) {
                frCtr[x] = frCtr[x] / yearLevelCount[x] * 100;
                prCtr[x] = prCtr[x] / yearLevelCount[x] * 100;
            }
            chart2.data.datasets[0].data = prCtr;
            chart2.data.datasets[1].data = frCtr;
            chart2.update();

            $("#loadingScreen").modal("hide");
        },
        beforeSend: function (response) {
            $("#loadingScreen").modal("show");
        }, error: function (response) {
            console.log(response.responseText);
            $("#error").html(response.responseText);
        }
    });

    function isPassed(stud) {
        var grades = [];
        $.each(stud.subjects, function (indexInArray, sub2) {
            grades.push(sub2.grade);
        });
        if (parseFloat(getGrade(grades)) >= 75) {
            return true;
        }
        return false;
    }

    function getGrade(arr) {
        return arr.reduce((a, b) => parseFloat(a) + parseFloat(b)) / arr.length
    }
});

// CHART #1: NUMBER OF STUDENT PER  YEAR LEVEL
var ctxChart1 = document.getElementById('chart1').getContext('2d');
var chart1 = new Chart(ctxChart1, {
    type: 'doughnut',
    data: {
        labels: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
        datasets: [{
            data: [],
            backgroundColor: ['#eeb902', '#f79c06', '#bb7e00', '#76320d'],
        }]
    }, options: {
        plugins: {
            legend: { display: false },
            title: { display: false }
        }
    },
});

// CHART #2: PASSING RATE PER YEAR LEVEL
var ctxChart2 = document.getElementById('chart2').getContext('2d');
var chart2 = new Chart(ctxChart2, {
    type: 'bar',
    plugins: [ChartDataLabels],
    data: {
        labels: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
        datasets: [{
            label: ["Passed"],
            data: [30, 35, 20, 52],
            backgroundColor: ['#eeb902']
        }, {
            label: ["Failed"],
            data: [10, 25, 27, 32],
            backgroundColor: ['#76320d']
        }]
    }, options: {
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: false },
            datalabels: {
                anchor: 'end',
                align: 'bottom',
                color: 'white'
            }
        }, scales: {
            y: { min: 0, max: 100 }
        }
    },
});

