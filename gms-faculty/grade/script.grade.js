$(document).ready(function () {


    fetchGrades(json);


});

function fetchGrades(json) {
    $(document).ready(function () {
        let colGroup = ``;
        let criteria_th = ``;
        let activities_th = ``;
        let score_th = ``;
        $.each(json.criteria, function (index, criteria) {
            let cri_len = Object.keys(criteria.activity).length;
            colGroup += `<col span="${cri_len}" style="background-color: #d1e7dd;">
                    <col style="background-color: #ffe5d0;">`;
            criteria_th += `<th colspan="${cri_len + 1}">${criteria.name}</th>`;
            $.each(criteria.activity, function (i, activity) {
                if (cri_len - 1 != i) {
                    activities_th += `<th class="px-3">${activity.name}</th>`;
                    score_th += `<th>${activity.score}</th>`;
                } else {
                    activities_th += `
                        <th class="position-relative px-3">${activity.name}
                            <span data-bs-toggle="popover" data-index="${index}" class="position-absolute top-50 start-100 translate-middle badge rounded-pill border text-bg-light">
                                <i class="fal fa-plus"></i>
                            </span>
                        </th>
                        <th class="px-3">Equiv</th>`;
                    score_th += `
                        <th>${activity.score}</th>
                        <th>${criteria.equiv}%</th>`;
                }
            });

        });

        let tbody = ``;
        $.each(json.students, function (index_student, student) {
            let score_td = ``;
            $.each(student.scores, function (index_criteria, criteria) {
                for (let i = 0; i < criteria.score.length; i++) {
                    const score = criteria.score[i];
                    score_td += `<td data-score="${i}" data-criteria="${index_criteria}" data-student="${index_student}" contenteditable='true'>${score}</td>`;
                    if (i == criteria.score.length - 1) {
                        score_td += `<td><b>${criteria.average.toFixed(2)}</b></td>`;
                    }
                }
            });
            tbody += `
            <tr>
                <td>${student.stundetNo}</td>
                <td>${student.name}</td>
                <td><b>${student.equiv.toFixed(2)}</b></td>
                ${score_td}
                <td>${student.grade.toFixed(2)}</td>
                <td>${student.equiv.toFixed(2)}</td>
                <td>${student.remarks}</td>

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
                <th rowspan="3">Student No.</th>
                <th rowspan="3">Name</th>
                <th rowspan="3">Final Grade</th>
                ${criteria_th}
                <th colspan="3">Final Grade</th>
            </tr>
            <tr>
                ${activities_th}
                <th rowspan="2">Grade</th>
                <th rowspan="2">Equiv</th>
                <th rowspan="2">Remarks</th>
            </tr>
            <tr>
                ${score_th}
            </tr>
        </thead>
        <tbody>
            ${tbody}
        </tbody>
    `;

        $("#gradesTable").html(tContent);

        let popoverContent = `
        <form id="addColumnForm" style="width: 150px;">
            <div class="row">
                <div class="col-4">
                    <label class="mt-1 for="label">Label</label>
                </div>
                <div class="col-8 mb-1">
                    <input type="text" class="form-control form-control-sm" id="addLabel">
                </div>
                <div class="col-4">
                    <label class="mt-1 for="label">Score</label>
                </div>
                <div class="col-8 mb-1">
                    <input type="number" min="0" class="form-control form-control-sm" id="addScore">
                </div>    
            </div>
            <input type="submit" class="btn btn-sm btn-success w-100" value="Add">
        </form>`;
        $('[data-bs-toggle="popover"]').popover({
            placement: "bottom",
            html: true,
            sanitize: false,
            title: "Add Column",
            content: popoverContent
        });
        var cur_ind;
        $("[data-bs-toggle='popover']").click(function (e) {
            cur_ind = $(this).data("index");
        });

        $("[data-bs-toggle='popover']").on("shown.bs.popover", function () {
            $("#addColumnForm").submit(function (e) {
                e.preventDefault();
                $('[data-bs-toggle="popover"]').popover("hide");
                addColumn(cur_ind, $("#addLabel").val(), parseInt($("#addScore").val()));
            });
        });

        $("td").on("blur", function () {
            let i_score = $(this).data("score");
            let i_student = $(this).data("student");
            let i_criteria = $(this).data("criteria");
            let newVal = parseInt($(this).html());
            let total_over = 0;
            $.each(json.criteria[i_criteria].activity, function (indexInArray, activity) {
                total_over += activity.score;
            });
            json.students[i_student].scores[i_criteria].score[i_score] = newVal;
            let total_score = 0;
            $.each(json.students[i_student].scores[i_criteria], function (indexInArray, score) {
                for (let i = 0; i < score.length; i++) {
                    total_score += score[i];
                }
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
            json.students[i_student].remarks = (equiv == 5.00)? "Failed":"Passed";
            fetchGrades(json);
        });

    });
}

function getEquiv(grade) {
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

function addColumn(index, label, score) {
    $(document).ready(function () {
        json.criteria[index].activity.push({ name: label, score: score });
        $.each(json.students, function (indexInArray, student) {
            student.scores[index].score.push('');
        });
        fetchGrades(json);
    });
}

var json = {
    "criteria": [{
        "name": "Activities/Project",
        "equiv": 30,
        "activity": [{
            "name": "1",
            "score": 100
        }]
    }, {
        "name": "Quizzes",
        "equiv": 20,
        "activity": [{
            "name": "1",
            "score": 120
        }, {
            "name": "2",
            "score": 120
        }]
    }, {
        "name": "Recitation",
        "equiv": 15,
        "activity": [{
            "name": "1",
            "score": 100
        }]
    }, {
        "name": "Promptness",
        "equiv": 5,
        "activity": [{
            "name": "1",
            "score": 100
        }]
    }, {
        "name": "Major Exam",
        "equiv": 30,
        "activity": [{
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
                    "average": 100,
                    "score": [14]
                }, {
                    "average": 100,
                    "score": [50, 100]
                }, {
                    "average": 100,
                    "score": [20]
                }, {
                    "average": 100,
                    "score": [52]
                }, {
                    "average": 100,
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
