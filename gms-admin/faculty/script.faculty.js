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

    var tempData = {};
    $("#fileUploadForm").submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: '../faculty/process.faculty.php',
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
            url: '../faculty/process.faculty.php',
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
                      </div>
                        `;
                        $("#fileUploadBody").prepend(content);
                    }
                });
                if (flag) {
                    $("#fileUploadModal").modal("hide");
                    $("#uploadSpinner").fadeOut();
                    $("#fileUploadBody").html('');
                    $("#fileUploadForm").trigger('reset');
                }
                
            }, error: function (dataResult) {
                console.log("ERROR:");
                console.log(dataResult.responseText);
            }, beforeSend: function () {
                $("#uploadSpinner").show();
            }, complete: function() {
                displayUsers();
            }
        });
    });

});


function displayUsers(searchQuery = '') {
    $("#records").html("");
    $.ajax({
        type: "POST",
        url: "../faculty/process.faculty.php",
        data: { faculty: true },
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
                    <button data-id="` + data.id + `" class="faculty list-group-item list-group-item-action" aria-current="true">
                            <div class="row g-2">
                                <div class="col-3 d-flex align-items-center">
                                  <img src="../../images/defaultUserImage.jpg" class="img-fluid rounded-circle">
                                </div>
                                <div class="col-9">
                                  <div class="card-body">
                                    <h5 class="card-title">`+ data.fullName + `</h5>
                                    <small>` + data.id + `</small><br>
                                    <small>`+ data.email + `</small>
                                  </div>
                                </div>
                              </div>
                    </button>`;
            });
            $('#list').html(content);
        },
        error: function (dataResult) {
            console.log(dataResult);
        },
        complete: function (response) {
            // console.log(response);
            // $(".faculty").click(function (e) {
            //     e.preventDefault();
            //     $(".faculty").removeClass("list-group-item-warning active");
            //     $(this).addClass("list-group-item-warning active");
            //     var userid = $(this).attr("data-id");
            //     $.ajax({
            //         url: "students/records.php",
            //         type: "POST",
            //         data: {
            //             id: userid
            //         },
            //         success: function (dataResult) {
            //             $("#records").html(dataResult);
            //         },
            //         error: function (result) {
            //             console.log(result);
            //         }
            //     });
            // });
        }
    });
}

