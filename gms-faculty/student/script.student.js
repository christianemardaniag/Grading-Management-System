$(document).ready(function () {

    $.post("../student/process.student.php", { GET_FACULTY_REQ: true },
        function (GET_FACULTY_RESP, textStatus, jqXHR) {
            console.log(GET_FACULTY_RESP);
            let subContent = `<option value="All" selected>All</option>`;
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
            displayStudents($("#filter-specialization").val(), $("#filter-subject").val(), $("#filter-section").val());
        },
        "JSON"
    );

    $("#filter-specialization").change(function (e) {
        e.preventDefault();
        displayStudents($("#filter-specialization").val(), $("#filter-subject").val(), $("#filter-section").val());
    });

    $("#filter-subject").change(function (e) {
        e.preventDefault();
        displayStudents($("#filter-specialization").val(), $("#filter-subject").val(), $("#filter-section").val());
    });

    $("#filter-section").change(function (e) {
        e.preventDefault();
        displayStudents($("#filter-specialization").val(), $("#filter-subject").val(), $("#filter-section").val());
    });


    function displayStudents(specialization = 'All', subject = 'All', section = '') {
        $.ajax({
            type: "POST",
            url: "../student/process.student.php",
            data: { GET_STUDENTS_REQ: true },
            dataType: "JSON",
            success: function (GET_STUDENTS_RESP) {
                // console.log(GET_STUDENTS_RESP);
                var filtered = GET_STUDENTS_RESP.filter(function (student) {
                    let sub = false;
                    $.each(student.subjects, function (indexInArray, eachSub) {
                        if (sub) {
                            return false;
                        }
                        sub = (subject == "All") ? true : eachSub.code == subject;
                    });
                    let spec = (specialization == "All") ? true : student.specialization == specialization;
                    let sec = student.section == section;

                    return spec && sec && sub;
                });
                console.log(filtered);
                content = ``;
                $.each(filtered, function (indexInArray, student) {
                    content += `
                        <tr data-id="${student.studentNo}">
                            <td>${student.studentNo}</td>
                            <td>${student.fullName}</td>
                            <td>${student.program} ${student.section}</td>
                            <td>${student.specialization}</td>
                            <td>${student.email}</td>
                            <td>${student.contact_no}</td>
                        </tr>
                     `;
                });

                if ($.fn.DataTable.isDataTable("#studentsTable")) {
                    $('#studentsTable').DataTable().clear().destroy();
                }
                $("#studentRecords").html(content);
                $("#studentsTable").DataTable({
                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                    "pageLength": 25
                });

                var selectedStudent = "";
                $("#studentRecords > tr").click(function (e) {
                    e.preventDefault();
                    studentNo = $(this).data("id");
                    selectedStudent = GET_STUDENTS_RESP.filter(function (eachStudent) {
                        return eachStudent.studentNo == studentNo;
                    })[0];
                    console.log(selectedStudent);
                    $("#view-profile").attr("src", selectedStudent.profile_picture);
                    $("#view-studentNo").html(selectedStudent.studentNo);
                    $("#view-fullName").html(selectedStudent.fullName);
                    $("#view-cys").html(selectedStudent.program + " " + selectedStudent.section);
                    $("#view-email").html(selectedStudent.email);
                    $("#view-contactNo").html(selectedStudent.contact_no);
                    $("#view-gender").html(selectedStudent.gender);
                    $("#view-specialization").html(selectedStudent.specialization);
                    $("#view-program").html(selectedStudent.program);
                    $("#view-level").html(selectedStudent.level);
                    $("#view-section").html(selectedStudent.section);

                    $("#viewStudentModal").modal("show");

                });
            }, error: function (response) {
                console.error(response);
                $("#error").html(response.responseText);
            }
        });
    }
});
