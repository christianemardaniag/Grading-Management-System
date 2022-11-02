$(document).ready(function () {

    var data = [];
    // data = [
    //     {
    //         code: "",
    //         description: "",
    //         passingRate: "",
    //         section: [
    //             {
    //                 sectionName: "",
    //                 students: [{

    //                 }]
    //             }
    //         ]

    //     }
    // ];

    $.ajax({
        type: "POST",
        url: "../dashboard/process.dashboard.php",
        data: { GET_FACULTY_REQ: true },
        dataType: "JSON",
        success: function (GET_FACULTY_RESP) {
            let studentCount = 0;
            let passedCtr = 0;
            let yearLevelCount = [0, 0, 0, 0];
            $.each(GET_FACULTY_RESP.sub_sec, function (indexInArray, sub) {
                let subjects = {};
                subjects.code = sub.code;
                subjects.description = sub.description;
                subjects.section = [];
                $.ajax({
                    type: "POST",
                    url: "../dashboard/process.dashboard.php",
                    data: { GET_STUDENTS_REQ: true },
                    dataType: "JSON",
                    success: function (GET_STUDENTS_RESP) {
                        $.each(sub.sections.split(", "), function (indexInArray, sec) {
                            let section = {};
                            section.sectionName = sec;
                            section.students = [];
                            let filteredStudent = GET_STUDENTS_RESP.filter(function (student) {
                                if (sec == student.section) {
                                    return true;
                                }
                            });
                            $.each(filteredStudent, function (indexInArray, stud) {
                                switch (stud.level) {
                                    case "1st Year": yearLevelCount[0]++; break;
                                    case "2nd Year": yearLevelCount[1]++; break;
                                    case "3rd Year": yearLevelCount[2]++; break;
                                    case "4th Year": yearLevelCount[3]++; break;
                                    default: break;
                                }
                                $.each(stud.subjects, function (indexInArray, sub2) {
                                    if (subjects.code == sub2.code) {
                                        if (parseFloat(sub2.grade) >= 75) {
                                            passedCtr++;
                                        }
                                    }
                                });
                            });

                            studentCount += filteredStudent.length;
                            section.students.push(filteredStudent);
                            subjects.section.push(section);
                        });
                        $("#studentCount").html(studentCount);
                        data.push(subjects);

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
                    }
                });

            });
            $("#loadingScreen").modal("hide");
        },
        beforeSend: function () {
            $("#loadingScreen").modal("show");
        }
    });

});


var ctxstudentsPerYearLevelChart = document.getElementById('studentsChart').getContext('2d');
var studentsPerYearLevelChart = new Chart(ctxstudentsPerYearLevelChart, {
    type: 'doughnut',
    data: {
        labels: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
        datasets: [{
            data: [],
            backgroundColor: [
                '#eeb902',
                '#f79c06',
                '#bb7e00',
                '#76320d',
            ],
        }]
    }, options: {
        // maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            }
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
            backgroundColor: [
                '#eeb902',
                '#76320d',
            ],
        }]
    }, options: {
        // maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            }
        }
    },
});

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}
