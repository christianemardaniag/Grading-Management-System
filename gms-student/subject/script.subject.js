$(document).ready(function () {

    var subjects;

    $.ajax({
        type: "POST",
        url: "../subject/process.subject.php",
        data: { GET_ALL_SUBJECTS_REQ: true },
        dataType: "JSON",
        success: function (response) {
            subjects = response;
            displaySubjects(response);
            $("#allSubjectTable").DataTable();
            $("#loadingScreen").modal("hide");
        },
        error: function (response) {
            console.error(response);
            $("#errorAlert").removeClass("d-none");
            $("#errorAlert").html(response.responseText);
        }, beforeSend: function (response) {
            $("#loadingScreen").modal("show");
        }
    });


    function displaySubjects(subjects) {
        var content = ``;
        $level = ['', "1st Year", "2nd Year", "3rd Year", "4th Year"];
        $sem = ['', "1st Semester", "2nd Semester"];
        $.each(subjects, function (i, subject) {
            content += `
            <tr>
                <td>${subject.code}</td>
                <td>${subject.description}</td>
                <td>${$level[subject.year_level]} - ${$sem[subject.semester]}</td>
                <td class="dt-center">${subject.lec_units}.0</td>
                <td class="dt-center">${subject.lab_units}.0</td>
                <td class="dt-center">${subject.total_units}.0</td>
                <td class="dt-center">${subject.hours_per_week}</td>
                <td>${subject.prereq}</td>
                <td>${subject.coreq}</td>
                
            </tr>
            `;
        });
        $("#subject_tdata").html(content);

    }
});  // document ready function end 
