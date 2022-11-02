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

    $.post("../dashboard/process.dashboard.php", { GET_FACULTY_REQ: true },
        function (GET_FACULTY_RESP, textStatus, jqXHR) {
            let studentCount = 0;
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
                            });

                            studentCount += filteredStudent.length;
                            section.students.push(filteredStudent);
                            subjects.section.push(section);
                        });
                        $("#studentCount").html(studentCount);
                        data.push(subjects);
                        studentsPerYearLevelChart.data.datasets[0].data = yearLevelCount;
                        studentsPerYearLevelChart.update();

                    }
                });

            });
        },
        "JSON"
    );


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

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}
