var json = {
    "criteria": [{
        "name": "Activities/Project",
        "equiv": 30,
        "activities": [{
            "name": "1",
            "score": 100
        }]
    }, {
        "name": "Quizzes",
        "equiv": 20,
        "activities": [{
            "name": "1",
            "score": 80
        }, {
            "name": "2",
            "score": 120
        }]
    }, {
        "name": "Recitation",
        "equiv": 15,
        "activities": [{
            "name": "1",
            "score": 100
        }]
    }, {
        "name": "Promptness",
        "equiv": 5,
        "activities": [{
            "name": "1",
            "score": 100
        }]
    }, {
        "name": "Major Exam",
        "equiv": 30,
        "activities": [{
            "name": "ME",
            "score": 100
        }]
    }
    ],
    "students": [
        {
            "stundetNo": "2013412425",
            "name": "Aniag, Christian",
            "grade": 0,
            "equiv": 5.0,
            "remarks": "Failed",
            "scores": [
                {
                    "average": 50,
                    "score": [14]
                }, {
                    "average": 80,
                    "score": [50, 90]
                }, {
                    "average": 50,
                    "score": [20]
                }, {
                    "average": 60,
                    "score": [52]
                }, {
                    "average": 70,
                    "score": [65]
                },
            ]
        },
        {
            "stundetNo": "2013412425",
            "name": "Aniag, Christian",
            "grade": 0,
            "equiv": 5.0,
            "remarks": "Failed",
            "scores": [
                {
                    "average": 100,
                    "score": [0]
                }, {
                    "average": 100,
                    "score": [60, 110]
                }, {
                    "average": 100,
                    "score": [0]
                }, {
                    "average": 100,
                    "score": [0]
                }, {
                    "average": 100,
                    "score": [0]
                },
            ]
        }
    ]
};
$(document).ready(function () {

    $("#uploadFileBtn").click(function (e) {
        e.preventDefault();
        $("#fileUpload").trigger('click');
    });

    $("#fileUpload").change(function (e) {
        e.preventDefault();
        $("#fileUploadForm").submit();
    });

    var tempData = {};
    $("#fileUploadForm").submit(function (e) {
        e.preventDefault();
        var data = new FormData(this);
        $.ajax({
            url: '../grade/process.grade.php',
            type: 'POST',
            data: data,
            contentType: false,
            cache: false,
            processData: false,
            dataType: "JSON",
            success: function (FILE_UPLOAD_RESP) {
                // TODO: IF CODE OR SECTION IS EMPTY, SHOW WARNING ALERT SUGGEST DOWNLOAD CSV FORMAT
                tempData.code = FILE_UPLOAD_RESP[4][5];  // * subject code coordinates
                tempData.description = FILE_UPLOAD_RESP[5][5];  // * subject description coordinates
                tempData.section = FILE_UPLOAD_RESP[6][5];  // * subject section coordinates

                var content = `
                <div class="fs-5">Subject Code: <b>${tempData.code}</b></div>
                <div class="fs-5">Subject Description: <b>${tempData.description}</b></div>
                <div class="fs-5">Section: <b>${tempData.section}</b></div>
                <div class="table-responsive">
                    <table id="previewTable" class="table table-sm table-bordered display compact">
                        <thead>
                        `;

                tempData.students = [];
                tempData.criteria = [];
                $.each(FILE_UPLOAD_RESP, function (row, column) {
                    // * PRINT HEADERS
                    if (row >= 8 && row <= 10) {
                        content += `<tr>`;
                        $.each(column, function (col, val) {
                            content += `<th>${val}</th>`;
                        });
                        content += `</tr>`;
                    }

                    // * GET CRITERIA AND ACTIVITIES
                    // "criteria": [{
                    //     "name": "Activities/Project",
                    //     "equiv": 0.3,
                    //     "activities": [{
                    //         "name": "1",
                    //         "total": 100
                    //     }]
                    // }]
                    if (row == 8) {
                        let ctr = 0;
                        $.each(column, function (col, val) {
                            if (val == "FINAL GRADE") return false;
                            let criteria = {};
                            criteria.activities = [];
                            if (col >= 6) {
                                if (val != "") {
                                    ctr = col;
                                    do {
                                        let activities = {};
                                        activities.name = FILE_UPLOAD_RESP[row + 1][ctr];
                                        activities.total = FILE_UPLOAD_RESP[row + 2][ctr];
                                        criteria.activities.push(activities);
                                        ctr++;
                                    } while (FILE_UPLOAD_RESP[row][ctr + 1] == '');
                                    ctr = col + 1;
                                    while (FILE_UPLOAD_RESP[row][ctr] == '') {
                                        ctr++;
                                    }
                                    criteria.equiv = FILE_UPLOAD_RESP[row + 2][ctr - 1];
                                    criteria.name = val;
                                    tempData.criteria.push(criteria);
                                }
                            }
                        });
                    }

                    // * END OF HEADERS
                    if (row == 10) {
                        content += `</thead><tbody>`;
                    }

                    // * GET STUDENTS
                    // "students": [
                    //     {
                    //         "stundetNo": "2018412425",
                    //         "name": "Dela Cruz, Juan",
                    //         "grade": 0,
                    //         "equiv": 5.0,
                    //         "remarks": "Failed",
                    //         "scores": [
                    //             {
                    //                 "average": 50,
                    //                 "score": [14]
                    //             }, {
                    //                 "average": 80,
                    //                 "score": [50, 90]
                    //             }, {
                    //                 "average": 50,
                    //                 "score": [20]
                    //             }, {
                    //                 "average": 60,
                    //                 "score": [52]
                    //             }, {
                    //                 "average": 70,
                    //                 "score": [65]
                    //             },
                    //         ]
                    //     }
                    if (row > 11) {
                        content += `<tr>`;
                        var student = {};
                        student.scores = [];
                        let ctr = 0;

                        // * GET SCORES
                        let totalLen = 6;
                        for (let i = 0; i < tempData.criteria.length; i++) {
                            actLen = tempData.criteria[i].activities.length;
                            let scores = {};
                            scores.score = [];
                            for (let j = 0; j < actLen; j++) {
                                const element = FILE_UPLOAD_RESP[row][totalLen + j];
                                scores.score.push(element);
                            }
                            totalLen += actLen + 1;
                            scores.average = FILE_UPLOAD_RESP[row][totalLen-1];
                            student.scores.push(scores);
                        }

                        // * GET OTHER DETAILS
                        $.each(column, function (col, val) {
                            content += `<td>${val}</td>`;
                            if (col == 2) student.stundetNo = val;
                            if (col == 3) student.name = val;
                            if (col == 5) student.equiv = val;
                            if (col == totalLen) student.grade = val;
                            if (col == totalLen + 2) student.remarks = val;
                        });

                        tempData.students.push(student);
                        content += `</tr>`;
                    }

                });
                content += `</tbody></table>`;

                $("#previewSpinner").fadeOut();
                $("#fileUploadBody").html(content);
                console.log(tempData);
            }, error: function (response) {
                console.error(response);
                $("#fileUploadBody").prepend(response.responseText);
            }, beforeSend: function () {
                $("#uploadClassRecord").modal("show");
                $("#previewSpinner").show();
            }
        });
    });

    // fetchGrades(json);

    // $.ajax({
    // type: "POST",
    //     url: "../grade/process.grade.php",
    //     data: { GET_GRADE_REQ: true },
    //     dataType: "JSON",
    //     success: function (response) {
    //         json = response;
    //         fetchGrades(response);
    //     }, error: function (response) {
    //         console.error(response);

    //     }
    // });
});

// function fetchGrades(json) {
//     $(document).ready(function () {
//         let colGroup = ``;
//         let criteria_th = ``;
//         let activities_th = ``;
//         let actionBtn_th = ``;
//         let score_th = ``;
//         $.each(json.criteria, function (index, criteria) {
//             console.log(json);
//             let cri_len = Object.keys(criteria.activity).length;
//             colGroup += `<col span="${cri_len}" style="background-color: #d1e7dd;">
//                     <col style="background-color: #ffe5d0;">`;
//             criteria_th += `<th colspan="${cri_len + 1}">${criteria.name}</th>`;
//             console.log(criteria.activity.length);
//             if (criteria.activity.length == 0) {
//                 actionBtn_th = `<th data-index="${index}" data-bs-toggle='popover' class="plus-btn bg-light"><i class="fal fa-plus"></i></th>`;
//                 activities_th = `<th>Equiv</th>`;
//                 score_th = `<th>${criteria.equiv}%</th>`;
//             }
//             $.each(criteria.activity, function (i, activity) {
//                 if (cri_len - 1 != i) {
//                     actionBtn_th += `<th data-criteria="${index}" data-act="${i}" class="minus-btn bg-light"><i class="fal fa-minus"></i></th>`;
//                     activities_th += `<th>${activity.name}</th>`;
//                     score_th += `<th>${activity.score}</th>`;
//                 } else {
//                     actionBtn_th += `<th data-criteria="${index}" data-act="${i}" class="minus-btn bg-light"><i class="fal fa-minus"></i></th>`;
//                     actionBtn_th += `<th data-index="${index}" data-bs-toggle='popover' class="plus-btn bg-light"><i class="fal fa-plus"></i></th>`;
//                     activities_th += `
//                     <th>${activity.name}</th>
//                     <th>Equiv</th>`;
//                     score_th += `
//                         <th>${activity.score}</th>
//                         <th>${criteria.equiv}%</th>`;
//                 }
//             });

//         });

//         let tbody = ``;
//         $.each(json.students, function (index_student, student) {
//             let score_td = ``;
//             $.each(student.scores, function (index_criteria, criteria) {
//                 if (criteria.score.length == 0) {
//                     score_td += `<td><b>50.00</b></td>`;
//                 }
//                 for (let i = 0; i < criteria.score.length; i++) {
//                     const score = criteria.score[i];
//                     score_td += `<td data-score="${i}" data-criteria="${index_criteria}" data-student="${index_student}" contenteditable='true'>${score}</td>`;
//                     if (i == criteria.score.length - 1) {
//                         score_td += `<td><b>${criteria.average.toFixed(2)}</b></td>`;
//                     }
//                 }
//             });
//             tbody += `
//             <tr>
//                 <td>${student.stundetNo}</td>
//                 <td>${student.name}</td>
//                 <td><b>${student.equiv.toFixed(2)}</b></td>
//                 ${score_td}
//                 <td>${student.grade.toFixed(2)}</td>
//                 <td>${student.equiv.toFixed(2)}</td>
//                 <td>${student.remarks}</td>

//             </tr>`;
//         });
//         let tContent = `
//         <colgroup>
//             <col span="2">
//             <col style="background-color: #ffda6a;">
//             ${colGroup}
//         </colgroup>
//         <thead>
//             <tr>
//                 <th rowspan="4">Student No.</th>
//                 <th rowspan="4">Name</th>
//                 <th rowspan="4">Final Grade</th>
//                 ${criteria_th}
//                 <th colspan="3">Final Grade</th>
//             </tr>
//             <tr>
//                 ${actionBtn_th}
//                 <th rowspan="3">Grade</th>
//                 <th rowspan="3">Equiv</th>
//                 <th rowspan="3">Remarks</th>
//             </tr>
//             <tr>
//                 ${activities_th}
//             </tr>
//             <tr>
//                 ${score_th}
//             </tr>
//         </thead>
//         <tbody>
//             ${tbody}
//         </tbody>
//     `;

//         $("#gradesTable").html(tContent);

//         // REMOVE ACTIVITY
//         $(".minus-btn").click(function (e) {
//             e.preventDefault();
//             let i_criteria = $(this).data("criteria");
//             let i_act = $(this).data("act");
//             $("#removeModal").modal("show");
//             $("#remove-yes-btn").click(function (e) {
//                 e.preventDefault();
//                 $.each(json.students, function (indexInArray, student) {
//                     student.scores[i_criteria].score.splice(i_act, 1);
//                 });
//                 json.criteria[i_criteria].activity.splice(i_act, 1);
//                 fetchGrades(json);
//                 $("#removeModal").modal("hide");
//             });
//         });

//         // ADD ACTIVITY
//         let popoverContent = `
//         <form id="addColumnForm" style="width: 150px;">
//             <div class="row">
//                 <div class="col-4">
//                     <label class="mt-1 for="label">Label</label>
//                 </div>
//                 <div class="col-8 mb-1">
//                     <input type="text" class="form-control form-control-sm" id="addLabel">
//                 </div>
//                 <div class="col-4">
//                     <label class="mt-1 for="label">Score</label>
//                 </div>
//                 <div class="col-8 mb-1">
//                     <input type="number" min="0" class="form-control form-control-sm" id="addScore">
//                 </div>
//             </div>
//             <input type="submit" class="btn btn-sm btn-success w-100" value="Add">
//         </form>`;
//         $('[data-bs-toggle="popover"]').popover({
//             placement: "bottom",
//             html: true,
//             sanitize: false,
//             title: "Add Column",
//             content: popoverContent
//         });
//         var cur_ind;
//         $("[data-bs-toggle='popover']").click(function (e) {
//             cur_ind = $(this).data("index");
//         });

//         $("[data-bs-toggle='popover']").on("shown.bs.popover", function () {
//             $("#addColumnForm").submit(function (e) {
//                 e.preventDefault();
//                 $('[data-bs-toggle="popover"]').popover("hide");
//                 addColumn(cur_ind, $("#addLabel").val(), parseInt($("#addScore").val()));
//             });
//         });

//         $("td").on("blur", function () {
//             let i_score = $(this).data("score");
//             let i_student = $(this).data("student");
//             let i_criteria = $(this).data("criteria");
//             let newVal = parseInt($(this).html());
//             let total_over = 0;
//             $.each(json.criteria[i_criteria].activity, function (indexInArray, activity) {
//                 total_over += activity.score;
//             });
//             json.students[i_student].scores[i_criteria].score[i_score] = newVal;
//             let total_score = 0;
//             $.each(json.students[i_student].scores[i_criteria], function (indexInArray, score) {
//                 for (let i = 0; i < score.length; i++) {
//                     total_score += score[i];
//                 }
//             });
//             let ave = (total_score / total_over) * 50 + 50;
//             json.students[i_student].scores[i_criteria].average = ave;

//             // set grade
//             let grade = 0;
//             $.each(json.criteria, function (i, criteria) {
//                 let ave = json.students[i_student].scores[i].average;
//                 grade += (ave * (criteria.equiv / 100));
//             });
//             json.students[i_student].grade = grade;

//             // set equiv
//             let equiv = getEquiv(grade);
//             json.students[i_student].equiv = equiv;

//             // set remarks
//             json.students[i_student].remarks = (equiv == 5.00) ? "Failed" : "Passed";
//             fetchGrades(json);
//         });

//     });
// }

// function getEquiv(grade) {
//     if (grade <= 74) {
//         return 5.00;
//     } else if (grade <= 75) {
//         return 3.00;
//     } else if (grade <= 78) {
//         return 2.75;
//     } else if (grade <= 81) {
//         return 2.50;
//     } else if (grade <= 84) {
//         return 2.25;
//     } else if (grade <= 87) {
//         return 2.00;
//     } else if (grade <= 90) {
//         return 1.75;
//     } else if (grade <= 93) {
//         return 1.50;
//     } else if (grade <= 96) {
//         return 1.25;
//     } else if (grade <= 100) {
//         return 1.00;
//     }
// }

// function addColumn(index, label, score) {
//     $(document).ready(function () {
//         json.criteria[index].activity.push({ name: label, score: score });
//         $.each(json.students, function (indexInArray, student) {
//             student.scores[index].score.push('');
//         });
//         fetchGrades(json);
//     });
// }


