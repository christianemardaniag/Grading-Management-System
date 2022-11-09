$(document).ready(function () {
    var myStudents = [];
    $.ajax({
        type: "POST",
        url: "../dashboard/process.dashboard.php",
        data: { GET_STUDENTS_REQ: true },
        dataType: "JSON",
        success: function (GET_STUDENTS_RESP) {
            console.log(GET_STUDENTS_RESP);
            myStudents = GET_STUDENTS_RESP;
            let passedCtr = 0;
            let yearLevelCount = [0, 0, 0, 0];
            $.each(myStudents, function (indexInArray, stud) {
                switch (stud.level) {
                    case "1st Year": yearLevelCount[0]++; break;
                    case "2nd Year": yearLevelCount[1]++; break;
                    case "3rd Year": yearLevelCount[2]++; break;
                    case "4th Year": yearLevelCount[3]++; break;
                    default: break;
                }
                $.each(stud.subjects, function (indexInArray, sub2) {
                    if (parseFloat(sub2.grade) >= 75) {
                        passedCtr++;
                    }
                });
            });

            let studentCount = myStudents.length;
            $("#studentCount").html(studentCount);

            // CHART #1: Total Handled Student and per year level
            studentsPerYearLevelChart.data.datasets[0].data = yearLevelCount;
            studentsPerYearLevelChart.update();

            // CHART #2: Passing Rate all student
            let failedPercent = (studentCount - passedCtr) / studentCount * 100;
            let passedPercent = (passedCtr / studentCount) * 100;
            $("#prPassed").html(passedPercent + "%");
            $("#prFailed").html(failedPercent + "%");
            passingRateChart.data.datasets[0].data = [passedPercent, failedPercent];
            passingRateChart.update();


            $("#loadingScreen").modal("hide");
        },
        beforeSend: function () {
            $("#loadingScreen").modal("show");
        }, error: function (response) {
            $("#error").html(response.responseText);
        }
    });

    // Get faculty subject for chart #3 
    $.ajax({
        type: "POST",
        url: "../dashboard/process.dashboard.php",
        data: { GET_FACULTY_REQ: true },
        dataType: "json",
        success: function (GET_FACULTY_RESP) {
            let option = ``;
            $.each(GET_FACULTY_RESP, function (indexInArray, val) {
                if (indexInArray == 0) {
                    option += `<option value="${val.code}" selected>${val.code} - ${val.description}</option>`;
                } else {
                    option += `<option value="${val.code}">${val.code} - ${val.description}</option>`;
                }
                getTopInSubject(val.code);
            });
            $("#filter-subject").html(option);
            gradeCriteriaAverage($("#filter-subject").val());
        }
    });

    $("#filter-subject").change(function (e) {
        e.preventDefault();
        gradeCriteriaAverage($(this).val());
    });

    function getTopInSubject(subjectCode) {
        var content = ``;
        var outstandingStudent = [];

        var obj = myStudents,
            groupBySubject = obj.reduce(function (r, a) {
                r[a.subjects] = r[a.subjects] || [];
                r[a.subjects].push(a);
                return r;
            }, Object.create(null));
            console.log(groupBySubject);
        // $.each(myStudents.subjects, function (key, value) {
        //     outstandingStudent.push({ v: value.grade, k: key });
        // });
        // outstandingStudent.sort(function (a, b) {
        //     if (a.v > b.v) { return -1 }
        //     if (a.v < b.v) { return 1 }
        //     return 0;
        // });
        // $.each(outstandingStudent, function (i, val) {
        //     content += `
        //     <tr class="${((i < 3) ? "table-info" : "")}">
        //         <td>${i + 1}.</td>
        //         <td>${json.students[val.k].studentNo}</td>
        //         <td class='text-start'>${json.students[val.k].name}</td>
        //         <td>${parseFloat(json.students[val.k].grade).toFixed(2)}</td>
        //         <td class='fw-bold'>${parseFloat(json.students[val.k].equiv).toFixed(2)}</td>
        //     </tr>`;

        // });

        // $("#top10StudentBody").html(content);
    }

    function gradeCriteriaAverage(subjectCode) {
        let bgColor = ['#eeb902', '#f79c06', '#bb7e00', '#76320d'];
        let avePerSec = [];
        var obj = myStudents,
            groupBySection = obj.reduce(function (r, a) {
                r[a.section] = r[a.section] || [];
                r[a.section].push(a);
                return r;
            }, Object.create(null));
        let ctr = 0;
        $.each(groupBySection, function (label, section) {
            let criteria = [0, 0, 0, 0, 0];
            $.each(section, function (indexInArray, student) {
                $.each(student.subjects, function (indexInArray, subject) {
                    if (subjectCode == subject.code) {
                        $.each(subject.scores, function (i, score) {
                            let ave = score.average;
                            criteria[i] = parseInt(criteria[i]) + parseInt(ave);
                        });
                    }

                });
            });
            $.each(criteria, function (i, val) {
                criteria[i] = criteria[i] / section.length;
            });
            avePerSec.push({
                label: [label],
                data: criteria,
                backgroundColor: [bgColor[ctr++]]
            });
            
        });
        gradeCriteriaAverageChart.data.datasets = avePerSec;
        gradeCriteriaAverageChart.update();
    }
});


var ctxstudentsPerYearLevelChart = document.getElementById('studentsChart').getContext('2d');
var studentsPerYearLevelChart = new Chart(ctxstudentsPerYearLevelChart, {
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

var ctxpassingRateChart = document.getElementById('passingRateChart').getContext('2d');
var passingRateChart = new Chart(ctxpassingRateChart, {
    type: 'doughnut',
    data: {
        labels: ["Passed", "Failed"],
        datasets: [{
            data: [0, 0],
            backgroundColor: ['#eeb902', '#76320d'],
        }]
    }, options: {
        plugins: {
            legend: { display: false },
            title: { display: false }
        }
    },
});

var ctxgradeCriteriaAverageChart = document.getElementById('gradeCriteriaAverageChart').getContext('2d');
var gradeCriteriaAverageChart = new Chart(ctxgradeCriteriaAverageChart, {
    type: 'bar',
    plugins: [ChartDataLabels],
    data: {
        labels: ['Activities/Project', 'Quizes', 'Recitation', 'Promtness', 'Major Exam'],
        datasets: []
    }, options: {
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: false },
            datalabels: {
                anchor: 'end',
                align: 'top',
                color: 'black'
            }
        },
        scales: {
            y: { min: 50, max: 100 }
        }
    },
});
