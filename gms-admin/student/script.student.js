$(document).ready(function () {
    displayUsers();
    $("#search").change(function (e) {
        e.preventDefault();
        displayUsers($(this).val());
    });

    $("#uploadFileBtn").click(function (e) {
        e.preventDefault();
        $("#fileUpload").trigger('click');
    });

    $("#fileUpload").change(function (e) {
        e.preventDefault();
        $("#fileUploadForm").submit();
    });
    $.post("../student/process.student.php"),'string';

    var tempData = {};
    $("#fileUploadForm").submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: '../student/process.student.php',
            type: 'POST',
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            dataType: 'json',
            success: function (data) {
                var content = `
                <div class="table-responsive">
                    <table id="previewTable" class="table table-sm table-striped table-bordered">
                        <thead><tr>
                        `;
                tempData.body = [];
                $.each(data, function (indexInArray, valueOfElement) {
                    if (indexInArray == 0) {
                        tempData.headers = [];
                        $.each(valueOfElement, function (i, val) {
                            content += `<th>` + val + `</th>`;
                            tempData.headers.push(val);
                        });
                        content += `</tr></thead><tbody>`;
                        return;
                    }
                    content += `<tr>`;
                    var v = [];
                    $.each(valueOfElement, function (i, val) {
                        content += `<td>` + val + `</td>`;
                        v.push(val);
                    });
                    tempData.body.push(v);
                    content += `</tr>`;
                });
                content += `</tbody></table>`;

                $("#fileUploadModal").modal("show");
                $("#previewSpinner").fadeOut();
                $("#fileUploadBody").html(content);
                $('#previewTable').DataTable();
            }, error: function (dataResult) {
                console.log(dataResult);
            }, beforeSend: function () {
                $("#fileUploadModal").modal("show");
                $("#previewSpinner").show();
            }
        });
    });

    $("#uploadSpinner").hide();
    $("#upload").click(function (e) {
        e.preventDefault();
        $.ajax({
            url: '../student/process.student.php',
            type: 'POST',
            data: { uploadFileToDB: tempData },
            dataType: 'json',
            success: function (data) {
                console.log(data);
                var flag = true;
                $.each(data, function (indexInArray, valueOfElement) {
                    if (!valueOfElement.status) {
                        flag = false;
                        $("#uploadSpinner").fadeOut();
                        $("#fileUploadForm").trigger('reset');
                        var content = `
                        <div class="alert alert-danger alert-dismissible fade show mb-2" role="alert">`+ valueOfElement.msg + `
                        <button type="button" class="btn-close btn-sm" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`;
                        $("#fileUploadBody").prepend(content);
                    }
                });
                if (flag) {
                    $("#fileUploadModal").modal("hide");
                    $("#upload").html("Upload");
                    $("#upload").removeAttr("disabled");
                    $("#uploadSpinner").fadeOut();
                    $("#fileUploadBody").html('');
                    $("#fileUploadForm").trigger('reset');
                }

            }, error: function (dataResult) {
                console.log("ERROR:");
                console.log(dataResult.responseText);
                $("#upload").html("Upload");
                $("#upload").removeAttr("disabled");
                $("#uploadSpinner").hide();
                $("#fileUploadForm").trigger('reset');
                var content = `
                <div class="alert alert-danger alert-dismissible fade show mb-2" role="alert">
                We encounter problem. Some student may not be receive email from the system or did'nt register to the system.
                <button type="button" class="btn-close btn-sm" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;
                $("#fileUploadBody").prepend(content);
            }, beforeSend: function () {
                $("#upload").html("Uploading");
                $("#upload").attr("disabled", "disabled");
                $("#uploadSpinner").show();
            }, complete: function () {
                displayUsers();
            }
        });
    });

    $("#addNewStudentError").hide();
    $("#addStudentSpinner").hide();
    $("#addStudentForm").submit(function (e) {
        e.preventDefault();
        var data = $(this).serializeArray();  // Form Data
        data.push({ name: 'addNewStudent', value: true });
        $.ajax({
            type: "post",
            url: "../student/process.student.php",
            data: data,
            dataType: "json",
            success: function (response) {
                $("#addStudentBtn").html("Add New Student");
                $("#addStudentBtn").removeAttr("disabled");
                $("#addStudentSpinner").hide();

                if (response.status) {
                    $("#addStudentForm").trigger('reset');
                    $("#addStudentModal").modal("hide");
                } else {
                    $("#addNewStudentError").html(response.msg);
                    $("#addNewStudentError").fadeIn();
                }
                
            },
            beforeSend: function () {
                $("#addStudentBtn").html("Adding New Student");
                $("#addStudentBtn").attr("disabled", "disabled");
                $("#addStudentSpinner").fadeIn();
            },
            error: function (response) {
                console.log("ERROR:");
                console.log(response.responseText);
            }, 
            complete: function () {
                displayUsers();
            }
        });
    });

});


function displayUsers(searchQuery = '') {
    $("#records").html("");
    $.ajax({
        type: "POST",
        url: "../student/process.student.php",
        data: { student: true },
        dataType: "JSON",
        success: function (response) {
            var content = ``;
            var filtered = response.filter(function (data) {
                searchQuery = searchQuery.toLowerCase();
                return data.id.includes(searchQuery)
                    || data.fullName.toLowerCase().includes(searchQuery)
                    || data.email.toLowerCase().includes(searchQuery);
            });
            $.each(filtered, function (i, data) {
                content += `
                    <button data-id="` + data.id + `" class="student list-group-item list-group-item-action d-flex gap-3" aria-current="true">
                        <img src="../../${data.profile_picture}" width="60" height="60" class="rounded-circle flex-shrink-0">
                        <div>
                            <small class="opacity-75">` + data.id + `</small>
                            <h6 class="card-title">`+ data.fullName + `</h6>
                            <small class="opacity-75">`+ data.email + `</small>
                        </div>
                    </button>`;
            });
            $('#list').html(content);
        },
        error: function (dataResult) {
            console.log("ERROR:");
            console.log(dataResult);
        },
        complete: function (response) {
            $(".student").click(function (e) {
                e.preventDefault();
                $(".student").removeClass("list-group-item-warning active");
                $(this).addClass("list-group-item-warning active");
                var userid = $(this).attr("data-id");
                var filtered = response.responseJSON.filter(function (data) {
                    return data.id == userid;
                });
                $.ajax({
                    url: "../student/records.student.php",
                    type: "POST",
                    data: {
                        details: filtered
                    },
                    success: function (response) {
                        $("#records").html(response);
                    },
                    error: function (result) {
                        console.log("ERROR:");
                        console.log(result);
                    }
                });
            });
        }
    });
}

