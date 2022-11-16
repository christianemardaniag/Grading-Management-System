$(document).ready(function () {

    let subjects;
    setSubjectsFromDB();

    $("#addSubjectForm").submit(function (e) {
        e.preventDefault();
        let formData = getFormData($(this));
        let data = [];
        data.push({ name: 'ADD_SUBJECT_REQ', value: JSON.stringify(formData) });
        console.log(data);
        $.ajax({
            type: "POST",
            url: "../subject/process.student.php",
            data: data,
            dataType: "JSON",
            success: function (ADD_SUBJECT_RESP) {
                console.log(ADD_SUBJECT_RESP);
                if (ADD_SUBJECT_RESP.status) {
                    setSubjectsFromDB();
                    $("#adSubjectModal").trigger("reset");
                    $("#addSubjectModal").modal("hide");
                } else {
                    $("#errorAlert").removeClass("d-none");
                    $("#errorAlert").html(ADD_SUBJECT_RESP.msg);
                }
            }, error: function (response) {
                console.error(response);
                $("#errorAlert").removeClass("d-none");
                $("#errorAlert").html(response.responseText);
            }
        });
    });

    function getFormData($form) {
        var unindexed_array = $form.serializeArray();
        var indexed_array = {};

        $.map(unindexed_array, function (n, i) {
            indexed_array[n['name']] = n['value'];
        });
        return indexed_array;
    }

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

    function setSubjectsFromDB() {
        $.ajax({
            type: "POST",
            url: "../subject/process.student.php",
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
            },
            beforeSend: function (response) {
                $("#loadingScreen").modal("show");
            }
        });
    }

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
        // <td>
        //             <button class="edit-btn btn btn-sm btn-dark" data-id="${subject.id}"><i class="fal fa-edit"></i> Edit</button>
        //             <button class="remove-btn btn btn-sm btn-danger" data-id="${subject.id} data-code="${subject.code}"><i class="far fa-trash"></i> Remove</button>
        //             </td>
        $("#subject_tdata").html(content);

        // $(".edit-btn").click(function (e) {
        //     e.preventDefault();
        //     let id = $(this).data('id');
        //     var subject = subjects.filter(function (data) {
        //         return data.id == id;
        //     });
        //     let yearSem = subject[0].year_level + '-' + subject[0].semester;
        //     $("#oldSubjectCode").html(subject[0].id);
        //     $("#editCode").html(subject[0].code);
        //     $("[name='editCode']").val(subject[0].code);
        //     $("[name='editDescription']").val(subject[0].description);
        //     $("[name='editSpecialization']").val(subject[0].specialization);
        //     $("[name='editYearSem']").val(yearSem);
        //     $("#viewSubjectModal").modal('show');

        //     $("#editSaveChanges").click(function (e) {
        //         e.preventDefault();
        //         let year_sem = $("[name='editYearSem']").val();
        //         let year = year_sem.split('-')[0];
        //         let sem = year_sem.split('-')[1];
        //         data = {
        //             id: $("#oldSubjectCode").html(),
        //             new_code: $("[name='editCode']").val(),
        //             description: $("[name='editDescription']").val(),
        //             specialization: $("[name='editSpecialization']").val(),
        //             year_level: year,
        //             semester: sem,
        //         };
        //         $.ajax({
        //             type: "POST",
        //             url: "../subject/process.student.php",
        //             data: { EDIT_SUBJECT_REQ: { subjectInfo: data } },
        //             dataType: "JSON",
        //             success: function (EDIT_SUBJECT_RESP) {
        //                 if (EDIT_SUBJECT_RESP.status) {
        //                     setSubjectsFromDB();
        //                     $("#viewSubjectModal").modal('hide');
        //                 } else {
        //                     console.error(EDIT_SUBJECT_RESP);
        //                     $("#errorAlert").removeClass("d-none");
        //                     $("#errorAlert").html(EDIT_SUBJECT_RESP.msg);
        //                 }
        //             },
        //             error: function (response) {
        //                 console.error(response);
        //                 $("#errorAlert").removeClass("d-none");
        //                 $("#errorAlert").html(response.responseText);
        //             }
        //         });
        //     });
        // });

        // $(".assign-btn").click(function (e) {
        //     e.preventDefault();
        //     let subjectID = $(this).data('id');
        //     var subject = subjects.filter(function (data) {
        //         return data.id == subjectID;
        //     });
        //     subject = subject[0];
        //     displayAssignedFaculty(subject);
        //     $("#assignFacultyModal").modal('show');

        //     function displayAssignedFaculty(subject) {
        //         var faculties = ``;
        //         let assignedFaculty = `,`;
        //         if (subject.teachers.length == 0) {
        //             faculties = "<p>-- No Assigned Faculty --</p>";
        //         }
        //         $.each(subject.teachers, function (indexInArray, faculty) {
        //             assignedFaculty += `'${faculty.id}',`;
        //             faculties += `
        //                 <div class="col">
        //                     <div class="border p-1 rounded">
        //                         <div class="d-flex position-relative">
        //                             <img src="../../${faculty.profile_picture}" class="rounded-circle img-fluid me-1"
        //                                 width="42" height="42">
        //                             <div>
        //                                 <small>${faculty.id}</small>
        //                                 <div class="fw-bold">${faculty.fullName}</div>
        //                             </div>
        //                             <span data-id="${faculty.fsid}" data-index="${indexInArray}"
        //                                 class="position-absolute top-0 start-100 translate-middle badge rounded-pill remove-faculty">
        //                                 <i class="far fa-times"></i>
        //                             </span>
        //                         </div>
        //                     </div>
        //                 </div>
        //             `;
        //         });

        //         getUnassignedFaculty(assignedFaculty.slice(0, -1))

        //         $("#assignedFaculty").html(faculties);
        //         $("#assignCode").html(subject.code);
        //         $("#assignDescription").html(subject.description);
        //         $(".remove-faculty").click(function (e) {
        //             e.preventDefault();
        //             let fsid = $(this).data('id');
        //             let index = $(this).data('index');
        //             $.ajax({
        //                 type: "POST",
        //                 url: "../subject/process.student.php",
        //                 data: { REMOVE_ASSIGNED_FACULTY_REQ: { FACULTY_SUBJECT_JUNCTION_ID: fsid } },
        //                 dataType: "JSON",
        //                 success: function (REMOVE_ASSIGNED_FACULTY_RESP) {
        //                     console.log(REMOVE_ASSIGNED_FACULTY_RESP);
        //                     if (REMOVE_ASSIGNED_FACULTY_RESP.status) {
        //                         subject.teachers.splice(index, 1);
        //                         displayAssignedFaculty(subject);
        //                     } else {
        //                         console.error(REMOVE_ASSIGNED_FACULTY_RESP);
        //                         $("#errorAlert").removeClass("d-none");
        //                         $("#errorAlert").html(REMOVE_ASSIGNED_FACULTY_RESP.responseText);
        //                     }
        //                 },
        //                 error: function (response) {
        //                     console.error(response);
        //                     $("#errorAlert").removeClass("d-none");
        //                     $("#errorAlert").html(response.responseText);
        //                 }
        //             });
        //         });
        //     }

        //     $("#assignSelectedBtn").click(function (e) {
        //         e.preventDefault();
        //         var selected = new Array();
        //         $('#listOfFaculty input[type="checkbox"]:checked').each(function () {
        //             selected.push($(this).attr('id'));
        //         });
        //         $.ajax({
        //             type: "POST",
        //             url: "../subject/process.student.php",
        //             data: { ASSIGN_SELECTED_FACULTY_REQ: { FACULTY: selected, SUBJECT_ID: subjectID } },
        //             dataType: "JSON",
        //             success: function (response) {
        //                 $.post("../subject/process.student.php", { GET_ALL_SUBJECTS_REQ: true },
        //                     function (data, textStatus, jqXHR) {
        //                         subjects = data;
        //                         var subject = subjects.filter(function (data) {
        //                             return data.id == subjectID;
        //                         });
        //                         subject = subject[0];
        //                         displayAssignedFaculty(subject);
        //                     },
        //                     "JSON"
        //                 );
        //             },
        //             error: function (response) {
        //                 console.error(response);
        //                 $("#errorAlert").removeClass("d-none");
        //                 $("#errorAlert").html(response.responseText);
        //             }
        //         });
        //     });
        // });

        // function getUnassignedFaculty(assignedFaculty) {
        //     $.ajax({
        //         type: "POST",
        //         url: "../subject/process.student.php",
        //         data: { UNASSIGNED_FACULTY_REQ: { ASSIGNED_FACULTY: assignedFaculty } },
        //         dataType: "JSON",
        //         success: function (UNASSIGNED_FACULTY_RESP) {
        //             let content = ``;
        //             $.each(UNASSIGNED_FACULTY_RESP, function (i, data) {
        //                 let as = ``;
        //                 $.each(data.assigned_subject, function (indexInArray, val) {
        //                     as += `<span class="badge text-bg-dark me-2">${val.code}</span>`;
        //                 });
        //                 content += `
        //                  <tr>
        //                     <td class="text-center">
        //                         <input class="form-check-input addFacultyChk" type="checkbox" id="${data.id}"
        //                             value="${data.id}">
        //                     </td>
        //                     <td>${data.id}</td>
        //                     <td>${data.fullName}</td>
        //                     <td>${as}</td>
        //                 </tr>
        //                  `;
        //             });
        //             $("#listOfFaculty").html(content);
        //             if (UNASSIGNED_FACULTY_RESP.length == 0) {
        //                 content = "<caption>No Available Faculty</caption>";
        //                 $("#listOfFaculty").parent().append(content);
        //             }
        //             $(".addFacultyChk").change(function (e) {
        //                 e.preventDefault();
        //                 $(this).parent().parent().toggleClass("table-info");
        //             });
        //             if ($.fn.dataTable.isDataTable('#facultyListTable')) {
        //                 $('#facultyListTable').DataTable();
        //             }
        //             else {
        //                 $('#facultyListTable').DataTable({
        //                     "info": false
        //                 });
        //             }
        //             // $("#facultyListTable").DataTable({ "lengthChange": false });

        //         },
        //         error: function (response) {
        //             console.error(response);
        //             $("#errorAlert").removeClass("d-none");
        //             $("#errorAlert").html(response.responseText);
        //         }
        //     });
        // }

        // $(".remove-btn").click(function (e) {
        //     e.preventDefault();
        //     let id = $(this).data('id');
        //     let code = $(this).data('code');
        //     $("#removeCode").html(code);
        //     $("#removeSubjectModal").modal('show');

        //     $("#remove-yes-btn").click(function (e) {
        //         e.preventDefault();
        //         $.ajax({
        //             type: "POST",
        //             url: "../subject/process.student.php",
        //             data: { REMOVE_SUBJECT_REQ: { subjectID: id } },
        //             dataType: "JSON",
        //             success: function (REMOVE_SUBJECT_RESP) {
        //                 if (REMOVE_SUBJECT_RESP.status) {
        //                     setSubjectsFromDB();
        //                     $("#removeSubjectModal").modal('hide');
        //                 } else {
        //                     console.error(REMOVE_SUBJECT_RESP);
        //                     $("#errorAlert").removeClass("d-none");
        //                     $("#errorAlert").html(REMOVE_SUBJECT_RESP.responseText);
        //                 }
        //             },
        //             error: function (response) {
        //                 console.error(response);
        //                 $("#errorAlert").removeClass("d-none");
        //                 $("#errorAlert").html(response.responseText);
        //             }
        //         });

        //     });
        // });
    }
});  // document ready function end 
