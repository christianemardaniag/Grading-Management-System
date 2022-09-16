$(document).ready(function () {
    var subjects;
    $.post("../subject/process.student.php", { subject: true },
        function (data, textStatus, jqXHR) {
            subjects = data;
            displaySubjects(subjects);
        },
        "JSON"
    );
    
    $("#year_sem").change(function (e) {
        e.preventDefault();
        var year_sem = $(this).val();
        if (year_sem == "All") {
            displaySubjects(subjects);
        } else {
            var year = year_sem.split('-')[0];
            var sem = year_sem.split('-')[1];
            var filtered = subjects.filter(function (data) {       
                return data.year_level == year && data.semester == sem;
            });
            displaySubjects(filtered);
        }
    });

    $("#specialization").change(function (e) {
        e.preventDefault();
        var spec = $(this).val();
        var filtered = subjects.filter(function (data) {
            if (spec == "All") {
                return true;
            }
            return data.specialization == spec;
        });
        displaySubjects(filtered);
    });

    function displaySubjects(subjects) {
        var content = ``;
        $.each(subjects, function (i, subject) {
            var teachers = ``;
            $.each(subject.teachers, function (indexInArray, teacher) {
                teachers += `<span class="badge text-bg-dark">` + teacher.fullName + `</span>`
            });
            content += `
            <tr>
                <td>`+ subject.code + `</td>
                <td>`+ subject.description + `</td>
                <td>`+ subject.specialization + `</td>
                <td> `+ teachers + `</td>
            </tr>
            `;
        });
        $("#subject_tdata").html(content);
    }

});  // document ready function end 
