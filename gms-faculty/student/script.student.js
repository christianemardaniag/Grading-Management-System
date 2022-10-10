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
                    if($.inArray(section, uniSec) == -1) {
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

    // getSectionsFilter();

    // function getSectionsFilter() {
    //     $.post("../student/process.student.php", {
    //         GET_SECTION_DESTINCT_REQ: true,
    //         program: $("#filter-program").val(),
    //         level: $("#filter-level").val()
    //     },
    //         function (GET_SECTION_DESTINCT_RESP, textStatus, jqXHR) {
    //             let content = `<option value="All" selected>All</option>`;
    //             $.each(GET_SECTION_DESTINCT_RESP, function (indexInArray, section) {
    //                 content += `<option value="${section}">${section}</option>`;
    //             });
    //             console.log();
    //             $("#filter-section").html(content);
    //         },
    //         "JSON"
    //     );
    // }


    $("#filter-specialization").change(function (e) {
        e.preventDefault();
        // getSectionsFilter();
        displayStudents($("#filter-specialization").val(), $("#filter-subject").val(), $("#filter-section").val());
    });

    $("#filter-subject").change(function (e) {
        e.preventDefault();
        // getSectionsFilter();
        displayStudents($("#filter-specialization").val(), $("#filter-subject").val(), $("#filter-section").val());
    });

    // $("#filter-program").change(function (e) {
    //     e.preventDefault();
    //     getSectionsFilter();
    //     displayStudents($("#filter-specialization").val(), $("#filter-program").val(), $("#filter-level").val(), $("#filter-section").val());
    // });

    // $("#filter-level").change(function (e) {
    //     e.preventDefault();
    //     getSectionsFilter();
    //     displayStudents($("#filter-specialization").val(), $("#filter-program").val(), $("#filter-level").val(), $("#filter-section").val());
    // });

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

                    // $("#removeStudentModal").on("show.bs.modal", function () {
                    //     $("#remove-fullName").html(selectedStudent.fullName);
                    //     $("#remove-studentNo").html(selectedStudent.studentNo);
                    // })

                    // $("#remove-yes-btn").click(function (e) {
                    //     e.preventDefault();
                    //     $.ajax({
                    //         type: "POST",
                    //         url: "../student/process.student.php",
                    //         data: { REMOVE_STUDENT_REQ: selectedStudent.studentNo },
                    //         dataType: "JSON",
                    //         success: function (REMOVE_STUDENT_RESP) {
                    //             displayStudents($("#filter-specialization").val(), $("#filter-program").val(), $("#filter-level").val(), $("#filter-section").val());
                    //             $("#removeStudentModal").modal("hide");
                    //         }
                    //     });
                    // });
                });

                // $("#editStudentModal").on("show.bs.modal", function () {
                //     $("#edit-oldStudentNo").val(selectedStudent.studentNo);
                //     $("#edit-studentNo").val(selectedStudent.studentNo);
                //     $("#edit-fullName").val(selectedStudent.fullName);
                //     $("#edit-email").val(selectedStudent.email);
                //     $("#edit-contactNo").val(selectedStudent.contact_no);
                //     $("input[name=edit-gender][value=" + selectedStudent.gender + "]").attr('checked', 'checked');
                //     $("#edit-specialization").val(selectedStudent.specialization);
                //     $("#edit-program").val(selectedStudent.program);
                //     $("#edit-level").val(selectedStudent.level);
                //     $("#edit-section").val(selectedStudent.section);
                //     let sub = ``;
                //     $.each(selectedStudent.subjects, function (indexInArray, subject) {
                //         sub += `${subject.code}, `;
                //     });
                //     $("#edit-subjects").val(sub.slice(0, -1));
                // });

            }, error: function (response) {
                console.error(response);
                $("#error").html(response.responseText);
            }
        });


    }

    // var tempData = {};
    // $("#fileUploadForm").submit(function (e) {
    //     e.preventDefault();
    //     $.ajax({
    //         url: '../student/process.student.php',
    //         type: 'POST',
    //         data: new FormData(this),
    //         contentType: false,
    //         cache: false,
    //         processData: false,
    //         dataType: 'json',
    //         success: function (data) {
    //             var content = `
    //             <div class="table-responsive">
    //                 <table id="previewTable" class="table table-sm table-striped table-bordered display compact">
    //                     <thead><tr>
    //                     `;
    //             tempData.body = [];
    //             $.each(data, function (indexInArray, valueOfElement) {
    //                 if (indexInArray == 0) {
    //                     tempData.headers = [];
    //                     $.each(valueOfElement, function (i, val) {
    //                         content += `<th>` + val + `</th>`;
    //                         tempData.headers.push(val);
    //                     });
    //                     content += `</tr></thead><tbody>`;
    //                     return;
    //                 }
    //                 content += `<tr>`;
    //                 var v = [];
    //                 $.each(valueOfElement, function (i, val) {
    //                     content += `<td>` + val + `</td>`;
    //                     v.push(val);
    //                 });
    //                 tempData.body.push(v);
    //                 content += `</tr>`;
    //             });
    //             content += `</tbody></table>`;

    //             $("#fileUploadModal").modal("show");
    //             $("#previewSpinner").fadeOut();
    //             $("#fileUploadBody").html(content);
    //             $('#previewTable').DataTable();
    //         }, error: function (dataResult) {
    //             console.error(dataResult);
    //             $("#fileUploadBody").prepend(dataResult.responseText);
    //         }, beforeSend: function () {
    //             $("#fileUploadModal").modal("show");
    //             $("#previewSpinner").show();
    //         }
    //     });
    // });

    // $("#uploadSpinner").hide();
    // $("#upload").click(function (e) {
    //     e.preventDefault();
    //     $.ajax({
    //         url: '../student/process.student.php',
    //         type: 'POST',
    //         data: { uploadFileToDB: tempData },
    //         dataType: 'json',
    //         success: function (data) {
    //             console.log(data);
    //             var flag = true;
    //             $.each(data, function (indexInArray, valueOfElement) {
    //                 if (!valueOfElement.status) {
    //                     flag = false;
    //                     $("#uploadSpinner").hide();
    //                     $("#fileUploadForm").trigger('reset');
    //                     var content = `
    //                     <div class="alert alert-danger alert-dismissible fade show mb-2" role="alert">`+ valueOfElement.msg + `
    //                     <button type="button" class="btn-close btn-sm" data-bs-dismiss="alert" aria-label="Close"></button>
    //                     </div>`;
    //                     $("#fileUploadBody").prepend(content);
    //                 }
    //             });
    //             if (flag) {
    //                 $("#fileUploadModal").modal("hide");
    //                 $("#updloadLabel").html("Upload");
    //                 $("#upload").removeAttr("disabled");
    //                 $("#uploadSpinner").hide();
    //                 $("#fileUploadBody").html('');
    //                 $("#fileUploadForm").trigger('reset');
    //                 displayStudents();
    //             }

    //         }, error: function (dataResult) {
    //             console.log("ERROR:");
    //             console.log(dataResult.responseText);
    //             $("#fileUploadBody").prepend(dataResult.responseText);
    //             $("#updloadLabel").html("Upload");
    //             $("#upload").removeAttr("disabled");
    //             $("#uploadSpinner").hide();
    //             $("#fileUploadForm").trigger('reset');
    //             var content = `
    //             <div class="alert alert-danger alert-dismissible fade show mb-2" role="alert">
    //             We encounter problem. Some student may not be receive email from the system or did'nt register to the system.
    //             <button type="button" class="btn-close btn-sm" data-bs-dismiss="alert" aria-label="Close"></button>
    //             </div>`;
    //             $("#fileUploadBody").prepend(content);
    //         }, beforeSend: function () {
    //             $("#uploadSpinner").show();
    //             $("#updloadLabel").html("Uploading");
    //             $("#upload").attr("disabled", "disabled");
    //         }
    //     });
    // });

    // $("#addNewStudentError").hide();
    // $("#addStudentSpinner").hide();
    // $("#addStudentForm").submit(function (e) {
    //     e.preventDefault();
    //     var data = $(this).serializeArray();  // Form Data
    //     data.push({ name: 'ADD_STUDENT_REQ', value: true });
    //     $.ajax({
    //         type: "POST",
    //         url: "../student/process.student.php",
    //         data: data,
    //         dataType: "json",
    //         success: function (ADD_STUDENT_RESP) {
    //             $("#addLabel").html("Add New Student");
    //             $("#addStudentBtn").removeAttr("disabled");
    //             $("#addStudentSpinner").hide();

    //             if (ADD_STUDENT_RESP.status) {
    //                 $("#addNewStudentError").fadeOut();
    //                 $("#addStudentForm").trigger('reset');
    //                 $("#addStudentModal").modal("hide");
    //             } else {
    //                 $("#addNewStudentError").html(ADD_STUDENT_RESP.msg);
    //                 $("#addNewStudentError").fadeIn();
    //             }
    //             displayStudents();
    //         },
    //         beforeSend: function () {
    //             $("#addLabel").html("Adding New Student");
    //             $("#addStudentSpinner").show();
    //             $("#addStudentBtn").attr("disabled", "disabled");
    //         },
    //         error: function (response) {
    //             console.error(response.responseText);
    //             $("#addNewStudentError").html(response.responseText);
    //             $("#addNewStudentError").fadeIn();
    //         }
    //     });
    // });

    // $("#editNewStudentError").hide();
    // $("#editStudentForm").submit(function (e) {
    //     e.preventDefault();
    //     var data = $(this).serializeArray();  // Form Data
    //     data.push({ name: 'EDIT_STUDENT_REQ', value: true });
    //     $.ajax({
    //         type: "POST",
    //         url: "../student/process.student.php",
    //         data: data,
    //         dataType: "json",
    //         success: function (EDIT_STUDENT_RESP) {
    //             if (EDIT_STUDENT_RESP.status) {
    //                 $("#editNewStudentError").fadeOut();
    //                 $("#editStudentForm").trigger('reset');
    //                 $("#editStudentModal").modal("hide");
    //             } else {
    //                 $("#editNewStudentError").html(EDIT_STUDENT_RESP.msg);
    //                 $("#editNewStudentError").fadeIn();
    //             }
    //             displayStudents($("#filter-specialization").val(), $("#filter-program").val(), $("#filter-level").val(), $("#filter-section").val());
    //         },
    //         error: function (response) {
    //             console.error(response.responseText);
    //             $("#editNewStudentError").html(response.responseText);
    //             $("#editNewStudentError").fadeIn();
    //         }
    //     });
    // });

});