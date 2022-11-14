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
                console.log();
                switch (stud.level.toUpperCase()) {
                    case "1ST YEAR": yearLevelCount[0]++; break;
                    case "2ND YEAR": yearLevelCount[1]++; break;
                    case "3RD YEAR": yearLevelCount[2]++; break;
                    case "4TH YEAR": yearLevelCount[3]++; break;
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
            $("#prPassed").html(passedPercent.toFixed(0) + "%");
            $("#prFailed").html(failedPercent.toFixed(0) + "%");
            passingRateChart.data.datasets[0].data = [passedPercent.toFixed(0), failedPercent.toFixed(0)];
            passingRateChart.update();

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
                        getTopInSubject(val.code, indexInArray, GET_FACULTY_RESP.length);
                    });
                    $("#filter-subject").html(option);
                    gradeCriteriaAverage($("#filter-subject").val());
                    $("#loadingScreen").modal("hide");
                }
            });

        },
        beforeSend: function (response) {
            $("#loadingScreen").modal("show");
        }, error: function (response) {
            console.log(response.responseText);
            $("#error").html(response.responseText);
        }
    });

    $("#filter-subject").change(function (e) {
        e.preventDefault();
        gradeCriteriaAverage($(this).val());
    });

    var temp = `<div class="carousel-item active" data-bs-interval="20000">
                    <div class="row mx-0 g-2">`;
    function getTopInSubject(subjectCode, index, length) {
        var content = ``;
        let topStudents = ``;
        var outstandingStudent = [];
        $.each(myStudents, function (key, student) {
            $.each(student.subjects, function (indexInArray, subject) {
                if (subjectCode == subject.code) {
                    outstandingStudent.push({ v: subject.grade, k: key });
                }
            });
            outstandingStudent.sort(function (a, b) {
                if (a.v > b.v) { return -1 }
                if (a.v < b.v) { return 1 }
                return 0;
            });
        });

        for (let i = 0; i < 10; i++) {
            topStudents += `
            <tr class="${((i < 3) ? "table-warning" : "")}">
                <td>${i + 1}.</td>
                <td>${myStudents[outstandingStudent[i].k].studentNo}</td>
                <td class="text-truncate" style="max-width: 150px;">${myStudents[outstandingStudent[i].k].fullName}</td>
                <td>${myStudents[outstandingStudent[i].k].section}</td>
                <td class='fw-bold'>${parseFloat(outstandingStudent[i].v).toFixed(2)}</td>
                <td>${getEquiv(outstandingStudent[i].v).toFixed(2)}</td>
            </tr>
            `;
        }

        // console.log(topStudents);

        temp += `
            <div class="col">
                <div class="shadow-sm px-3 pt-4 pb-3 bg-white">
                    <div class="d-flex justify-content-between">
                        <div class="dash-title">Top in Subject</div>
                        <h5>${subjectCode}</h5>
                    </div>
                    <table class="table table-sm table-stripped table-bordered text-center"
                        style="font-size: 14px;">
                        <thead class="table-dark">
                            <tr>
                                <th>Rank</th>
                                <th>Student No.</th>
                                <th>Name</th>
                                <th>Section</th>
                                <th>Grade</th>
                                <th>Equiv</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${topStudents}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        if (index % 2 != 0) {
            content = temp;
            temp = `<div class="carousel-item" data-bs-interval="20000">
            <div class="row mx-0 g-2">`;
        }

        if (index == length - 1) {
            content = temp;
            temp = `<div class="carousel-item" data-bs-interval="20000">
            <div class="row mx-0 g-2">`;
        }

        $("#topInSubjectContent").append(content);
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
                criteria[i] = (criteria[i] / section.length).toFixed(0);
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

function getEquiv(grade) {
    grade = Math.floor(grade);
    if (grade <= 74) {
        return 5.00;
    } else if (grade <= 75) {
        return 3.00;
    } else if (grade <= 78) {
        return 2.75;
    } else if (grade <= 81) {
        return 2.50;
    } else if (grade <= 84) {
        return 2.25;
    } else if (grade <= 87) {
        return 2.00;
    } else if (grade <= 90) {
        return 1.75;
    } else if (grade <= 93) {
        return 1.50;
    } else if (grade <= 96) {
        return 1.25;
    } else if (grade <= 100) {
        return 1.00;
    }
}

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
                align: 'bottom',
                color: 'white'
            }
        },
        scales: {
            y: { min: 50, max: 100 }
        }
    },
});
