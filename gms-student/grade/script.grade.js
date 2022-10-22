$(document).ready(function () {
    
    $('[data-bs-toggle="tooltip"]').tooltip();

    $.post("../student/process.student.php", { GET_FACULTY_REQ: true },
        function (GET_FACULTY_RESP, textStatus, jqXHR) {
            console.log(GET_FACULTY_RESP);
            let subContent = ``;
            let secContent = ``;
            let uniSec = [];
            $.each(GET_FACULTY_RESP.sub_sec, function (indexInArray, subject) {
                subContent += `<option value="${subject.code}">${subject.code} - ${subject.description}</option>`;
                $.each(subject.sections.split(", "), function (indexInArray, section) {
                    if ($.inArray(section, uniSec) == -1) {
                        uniSec.push(section);
                    }
                });
            });
            $.each(uniSec, function (indexInArray, section) {
                console.log();
                secContent += `<option value="${section}">${section}</option>`;
            });
            $("#filter-subject").html(subContent);
            $("#filter-section").html(secContent);
            displayStudents($("#filter-subject").val(), $("#filter-section").val());
        },
        "JSON"
    );

    $("#filter-subject").change(function (e) {
        e.preventDefault();
        displayStudents($("#filter-subject").val(), $("#filter-section").val());
    });

    var tempData = {};
    
    $("#uploadSpinner").hide();
    
    function displayStudents(subject = '', section = '') {
        var json = {};
        $.ajax({
            type: "POST",
            url: "../grade/process.grade.php",
            data: { GET_STUDENT_GRADES_REQ: true },
            dataType: "JSON",
            success: function (GET_STUDENT_GRADES_RESP) {
                var filtered = GET_STUDENT_GRADES_RESP.filter(function (student) {
                    let sub = false;
                    $.each(student.subjects, function (indexInArray, eachSub) {
                        if (sub) {
                            return false;
                        }
                        sub = (eachSub.code == subject);
                    });
                    let sec = student.section == section;
                    return sec && sub;
                });

                console.log(filtered);
                json.criteria = [];
                json.students = [];
                $.each(filtered, function (indexInArray, student) {
                    var details = {};
                    $.each(student.subjects, function (indexInArray, sub) {
                        if (sub.code == subject) {
                            details.studentNo = student.studentNo;
                            details.name = student.fullName;
                            details.scores = sub.scores;
                            details.grade = sub.grade;
                            details.equiv = sub.equiv;
                            details.remarks = sub.remarks;
                            json.students.push(details)
                            json.criteria = sub.criteria;
                        }
                    });
                });
                fetchGrades(json);
            }, error: function (response) {
                console.error(response);
                $("#error").html(response.responseText);
            }
        });


    }

});  // END OF DOCUMENT READY FUNCTION

function fetchGrades(json) {
    $(document).ready(function () {
        let colGroup = ``;
        let criteria_th = ``;
        let activities_th = ``;
        let actionBtn_th = ``;
        let lockBtn_th = ``;
        let score_th = ``;
        let act_ctr = 5;
        $.each(json.criteria, function (index, criteria) {
            let cri_len = criteria.activities.length;
            act_ctr += cri_len;
            colGroup += `<col span="${cri_len}" style="background-color: #d1e7dd;">
                    <col style="background-color: #ffe5d0;">`;
            criteria_th += `<th colspan="${cri_len + 1}">${criteria.name}</th>`;
            if (criteria.activities.length == 0) {
                actionBtn_th = `<th data-index="${index}" data-bs-toggle='popover' class="plus-btn bg-light"><i class="fal fa-plus"></i></th>`;
                activities_th = `<th>Equiv</th>`;
                score_th = `<th>${criteria.equiv}%</th>`;
            }
            $.each(criteria.activities, function (i, activity) {
                activity.isLock = (String(activity.isLock) === 'true');
                if (cri_len - 1 != i) {
                    actionBtn_th += `<th data-criteria="${index}" data-act="${i}" class="minus-btn bg-light"><i class="fal fa-minus"></i></th>`;
                    lockBtn_th += `<th data-criteria="${index}" data-act="${i}" class="lock-btn bg-light ${activity.isLock ? 'active' : ''}">
                        <i class="fas ${activity.isLock ? 'fa-lock' : 'fa-unlock-alt'}"></i></th>`;
                    activities_th += `<th>${activity.name}</th>`;
                    score_th += `<th>${activity.total}</th>`;
                } else {
                    actionBtn_th += `<th data-criteria="${index}" data-act="${i}" class="minus-btn bg-light"><i class="fal fa-minus"></i></th>`;
                    lockBtn_th += `<th data-criteria="${index}" data-act="${i}" class="lock-btn bg-light ${activity.isLock ? 'active' : ''}">
                        <i class="fas ${activity.isLock ? 'fa-lock' : 'fa-unlock-alt'}"></i></th>`;
                    lockBtn_th += `<th rowspan='2'>Equiv</th>`;
                    actionBtn_th += `<th data-index="${index}" data-bs-toggle='popover' class="plus-btn bg-light"><i class="fal fa-plus"></i></th>`;
                    activities_th += `
                    <th>${activity.name}</th>`;
                    score_th += `
                        <th>${activity.total}</th>
                        <th>${criteria.equiv}%</th>`;
                }
            });

        });

        let tbody = ``;
        json.students.sort(function (a, b) {
            if (a.name > b.name) { return 1 }
            if (a.name < b.name) { return -1 }
            return 0;
        });
        $.each(json.students, function (index_student, student) {
            let score_td = ``;
            if (student.scores === null) {
                score_td += `<td colspan=${act_ctr}>NO GRADES AVAILABLE</td>`
            }
            $.each(student.scores, function (index_criteria, criteria) {
                if (criteria.score.length == 0) {
                    score_td += `<td><b>50.00</b></td>`;
                }
                for (let i = 0; i < criteria.score.length; i++) {
                    let isLock = json.criteria[index_criteria].activities[i].isLock;
                    isLock = (String(isLock) === 'true');
                    const score = criteria.score[i];
                    score_td += `<td data-score="${i}" data-criteria="${index_criteria}" data-student="${index_student}" 
                        contenteditable='${isLock ? 'false' : 'true'}'>${score}</td>`;
                    if (i == criteria.score.length - 1) {
                        score_td += `<td><b>${parseFloat(criteria.average).toFixed(2)}</b></td>`;
                    }
                }
            });
            tbody += `
            <tr>
                <td>${student.studentNo}</td>
                <td class='text-start'>${student.name}</td>
                <td><b>${parseFloat(student.equiv).toFixed(2)}</b></td>
                ${score_td}
                <td>${parseFloat(student.grade).toFixed(2)}</td>
                <td>${parseFloat(student.equiv).toFixed(2)}</td>
                <td class="${student.remarks == 'Failed' ? "table-danger" : ""}">${student.remarks}</td>

            </tr>`;
        });
        let tContent = `
        <colgroup>
            <col span="2">
            <col style="background-color: #ffda6a;">
            ${colGroup}
        </colgroup>
        <thead>
        <tr>
            <th rowspan="5">Student No.</th>
            <th rowspan="5">Name</th>
            <th rowspan="5">Final Grade</th>
            ${criteria_th}
            <th colspan="3">Final Grade</th>
        </tr>
        <tr>
            ${actionBtn_th}
            <th rowspan="4">Grade</th>
            <th rowspan="4">Equiv</th>
            <th rowspan="4">Remarks</th>
        </tr>
        <tr>
            ${lockBtn_th}
            
        </tr>
        <tr>
            ${activities_th}
        </tr>
        <tr>
            ${score_th}
        </tr>
        </thead>
        <tbody class="table-group-divider">
            ${tbody}
        </tbody>
    `;

        $("#gradesTable").html(tContent);

        displayTop10Students(json);
        dropStudent(json);

        
        $("td").one("DOMSubtreeModified", function () {
            $(this).addClass("table-warning");
        });

        $("td").on("blur", function () {
            let i_score = $(this).data("score");
            let i_student = $(this).data("student");
            let i_criteria = $(this).data("criteria");
            let newVal = parseInt($(this).html());
            let total_over = 0;
            $.each(json.criteria[i_criteria].activities, function (indexInArray, activity) {
                total_over += parseInt(activity.total);
            });
            json.students[i_student].scores[i_criteria].score[i_score] = newVal;
            let total_score = 0;
            $.each(json.students[i_student].scores[i_criteria].score, function (indexInArray, score) {
                total_score += parseInt(score);
            });
            let ave = (total_score / total_over) * 50 + 50;
            json.students[i_student].scores[i_criteria].average = ave;

            // set grade
            let grade = 0;
            $.each(json.criteria, function (i, criteria) {
                let ave = json.students[i_student].scores[i].average;
                grade += (ave * (criteria.equiv / 100));
            });
            json.students[i_student].grade = grade;

            // set equiv
            let equiv = getEquiv(grade);
            json.students[i_student].equiv = equiv;

            // set remarks
            json.students[i_student].remarks = (equiv == 5.00) ? "Failed" : "Passed";
            fetchGrades(json);
        });

    });
}

function displayTop10Students(json) {
    $(document).ready(function () {
        var content = ``;
        var outstandingStudent = [];
        $.each(json.students, function (key, value) {
            outstandingStudent.push({ v: value.grade, k: key });
        });
        outstandingStudent.sort(function (a, b) {
            if (a.v > b.v) { return -1 }
            if (a.v < b.v) { return 1 }
            return 0;
        });
        $.each(outstandingStudent, function (i, val) {
            content += `
            <tr class="${((i < 3) ? "table-info" : "")}">
                <td>${i + 1}.</td>
                <td>${json.students[val.k].studentNo}</td>
                <td class='text-start'>${json.students[val.k].name}</td>
                <td>${parseFloat(json.students[val.k].grade).toFixed(2)}</td>
                <td class='fw-bold'>${parseFloat(json.students[val.k].equiv).toFixed(2)}</td>
            </tr>`;

        });

        $("#top10StudentBody").html(content);
    });
}

function dropStudent(json) {
    $(document).ready(function () {
        let temp_json = keepCloning(json);
        var content = ``;
        $.each(temp_json.criteria, function (key_criteria, criteria) {
            $.each(criteria.activities, function (key_act, activity) {
                $.each(temp_json.students, function (key_stud, student) {
                    if (student.scores !== null) {
                        activity.isLock = (String(activity.isLock) === 'true');
                        if (!activity.isLock) {
                            student.scores[key_criteria].score[key_act] = activity.total;
                        }
                        let total_over = 0;
                        $.each(criteria.activities, function (indexInArray, act) {
                            total_over += parseInt(act.total);
                        });
                        let total_score = 0;
                        $.each(student.scores[key_criteria].score, function (indexInArray, score) {
                            total_score += parseInt(score);
                        });
                        let ave = (total_score / total_over) * 50 + 50;
                        student.scores[key_criteria].average = ave;

                        // set grade
                        let grade = 0;
                        $.each(temp_json.criteria, function (ind, cri) {
                            let ave = parseFloat(student.scores[ind].average);
                            grade += (ave * (cri.equiv / 100));
                        });
                        student.grade = grade;

                        // set equiv
                        let equiv = getEquiv(grade);
                        student.equiv = equiv;

                        // set remarks
                        student.remarks = (equiv == 5.00) ? "Failed" : "Passed";

                    }
                });
            });
        });

        var filtered = temp_json.students.filter(function (data) {
            return data.remarks == "Failed";
        });

        $.each(filtered, function (i, val) {
            content += `
            <tr">
                <td>${val.studentNo}</td>
                <td class='text-start'>${val.name}</td>
                <td>${parseFloat(val.grade).toFixed(2)}</td>
                <td class='fw-bold'>${parseFloat(val.equiv).toFixed(2)}</td>
            </tr>`;
        });

        $("#dropStudent").html(content);
    });
}

function keepCloning(objectpassed) {
    if (objectpassed === null || typeof objectpassed !== 'object') {
        return objectpassed;
    }
    var temporary_storage = objectpassed.constructor();
    for (var key in objectpassed) {
        temporary_storage[key] = keepCloning(objectpassed[key]);
    }
    return temporary_storage;
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


