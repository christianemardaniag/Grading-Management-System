$(document).ready(function () {
    var myStudents = [];
    var allSubjects;
    var yearLevelCount = [0, 0, 0, 0];
    $.ajax({
        type: "POST",
        url: "../dashboard/process.dashboard.php",
        data: { GET_STUDENTS_REQ: true },
        dataType: "JSON",
        success: function (GET_STUDENTS_RESP) {
            myStudents = GET_STUDENTS_RESP;
            console.log(myStudents);
            let prCtr = [0, 0, 0, 0];
            let frCtr = [0, 0, 0, 0];
            let maleCtr = [0, 0, 0, 0];
            let femaleCtr = [0, 0, 0, 0];
            $.each(myStudents, function (stud_index, stud) {
                switch (stud.level.toUpperCase()) {
                    case "1ST YEAR":
                        yearLevelCount[0]++;
                        isPassed(stud) ? prCtr[0]++ : frCtr[0]++;
                        if (stud.gender == "Male") {
                            if (isPassed(stud)) maleCtr[0]++;
                        } else {
                            if (isPassed(stud)) femaleCtr[0]++;
                        }
                        break;
                    case "2ND YEAR":
                        yearLevelCount[1]++;
                        isPassed(stud) ? prCtr[1]++ : frCtr[1]++;
                        if (stud.gender == "Male") {
                            if (isPassed(stud)) maleCtr[1]++;
                        } else {
                            if (isPassed(stud)) femaleCtr[1]++;
                        }
                        break;
                    case "3RD YEAR":
                        yearLevelCount[2]++;
                        isPassed(stud) ? prCtr[2]++ : frCtr[2]++;
                        if (stud.gender == "Male") {
                            if (isPassed(stud)) maleCtr[2]++;
                        } else {
                            if (isPassed(stud)) femaleCtr[2]++;
                        }
                        break;
                    case "4TH YEAR":
                        yearLevelCount[3]++;
                        isPassed(stud) ? prCtr[3]++ : frCtr[3]++;
                        if (stud.gender == "Male") {
                            if (isPassed(stud)) maleCtr[3]++;
                        } else {
                            if (isPassed(stud)) femaleCtr[3]++;
                        }
                        break;
                    default: break;
                }
                candidateForAcademicHonor(stud);
            });

            let studentCount = myStudents.length;
            $("#studentCount").html(studentCount);

            // CHART #1: NUMBER OF STUDENT PER  YEAR LEVEL
            chart1.data.datasets[0].data = yearLevelCount;
            chart1.update();

            // CHART #2: PASSING RATE PER YEAR LEVEL
            for (let x = 0; x < yearLevelCount.length; x++) {
                frCtr[x] = Math.ceil(frCtr[x] / yearLevelCount[x] * 100);
                prCtr[x] = Math.ceil(prCtr[x] / yearLevelCount[x] * 100);
                maleCtr[x] = Math.ceil(maleCtr[x] / yearLevelCount[x] * 100);
                femaleCtr[x] = Math.ceil(femaleCtr[x] / yearLevelCount[x] * 100);
            }
            chart2.data.datasets[0].data = prCtr;
            chart2.data.datasets[1].data = frCtr;
            chart2.update();

            chart4.data.datasets[0].data = maleCtr;
            chart4.data.datasets[1].data = femaleCtr;
            chart4.update();

            $("#loadingScreen").modal("hide");
            $(".table").DataTable();
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

    $.ajax({
        type: "POST",
        url: "../dashboard/process.dashboard.php",
        data: { GET_ALL_SUBJECTS_REQ: true },
        dataType: "JSON",
        success: function (response) {
            allSubjects = response;
            getGradePerYearSem($("#year_sem").val());
        },
        error: function (response) {
            console.error(response);
            $("#errorLog").html(response.responseText);
        },
        beforeSend: function (response) {
            $("#chart3Spinner").fadeIn();
        }
    });

    $("#year_sem").change(function (e) {
        e.preventDefault();
        $("#chart3Spinner").fadeIn();
        getGradePerYearSem($(this).val());
    });

    function getGradePerYearSem(year) {
        var subjectsPerLevel = [];
        var filteredSubject = allSubjects.filter(function (data) {
            return data.year_level == year;
        });
        $.each(filteredSubject, function (indexInArray, sub) {
            subjectsPerLevel.push(sub.code);
        });
        var ratePerSubject = [];
        var len = subjectsPerLevel.length;
        for (let i = 0; i < len; i++) {
            ratePerSubject.push(0);
        }
        $.each(myStudents, function (indexInArray, student) {
            let level = ["1ST YEAR", "2ND YEAR", "3RD YEAR", "4TH YEAR"];
            if (level[year - 1] == student.level.toUpperCase()) {
                $.each(subjectsPerLevel, function (ind, subject) {
                    $.each(student.subjects, function (indexInArray, sub) {
                        if (sub.code == subject) {
                            if (sub.grade >= 75) {
                                ratePerSubject[ind]++;
                            }
                        }

                    });
                });
            }
        });
        for (let x = 0; x < len; x++) {
            ratePerSubject[x] = ratePerSubject[x] / yearLevelCount[year - 1] * 100;
        }
        chart3.data.labels = subjectsPerLevel;
        chart3.data.datasets[0].data = ratePerSubject;
        chart3.update();
        $("#chart3Spinner").fadeOut();
    }

    function candidateForAcademicHonor(stud) {
        var grades = [];
        $.each(stud.subjects, function (indexInArray, sub2) {
            grades.push(parseFloat(sub2.grade));
        });
        var grade = parseFloat(getGrade(grades));
        let content = `
        <tr>
            <td>${stud.studentNo}</td>
            <td>${stud.fullName}</td>
            <td>${stud.section}</td>
            <td>${parseFloat(grade).toFixed(2)}</td>
            <td class="fw-bold">${getEquiv(grade).toFixed(2)}</td>
        </tr>
        `;
        if (!grades.some((x) => { return x < 90; })) {
            if (grade >= 97) {
                $("#summaCumLaudeTableContent").append(content);
            }
        } else if (!grades.some((x) => { return x <= 84; })) {
            if (grade >= 94) {
                $("#summaCumLaudeTableContent").append(content);
            }
        } else if (!grades.some((x) => { return x <= 81; })) {
            if (grade >= 79) {
                $("#summaCumLaudeTableContent").append(content);
            }
        }
    }

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

});

// CHART #4: PASSING RATE PER YEAR LEVEL
var ctxChart4 = document.getElementById('chart4').getContext('2d');
var chart4 = new Chart(ctxChart4, {
    type: 'bar',
    plugins: [ChartDataLabels],
    data: {
        labels: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
        datasets: [{
            label: ["Male"],
            data: [87, 97, 76, 84],
            backgroundColor: '#f79c06',
        }, {
            label: ["Female"],
            data: [56, 30, 74, 96],
            backgroundColor: '#76320d'
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

// CHART #3: PASSING RATE PER SUBJECT
var ctxChart3 = document.getElementById('chart3').getContext('2d');
var chart3 = new Chart(ctxChart3, {
    type: 'line',
    plugins: [ChartDataLabels],
    data: {
        labels: ["IT 107", "PCM 101", "MMW 101", "UTS 101", "PAL101", "PE 11", "NSTP 11"],
        datasets: [{
            label: ["Passed"],
            data: [87, 97, 76, 84, 67, 84, 94],
            backgroundColor: ['#eeb90215'],
            // borderColor: 'gray',
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
                display: false
                // anchor: 'start',
                // align: 'bottom',
                // color: 'black'
            }
        }, scales: {
            y: { min: 0, max: 100 }
        },
        pointBackgroundColor: "#eeb902",
        radius: 5,
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
            data: [87, 97, 76, 84],
            backgroundColor: '#f79c06',
        }, {
            label: ["Failed"],
            data: [13, 3, 24, 16],
            backgroundColor: '#76320d'
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
