$(document).ready(function () {
    displayUsers();
    $("#search").change(function(e) {
        e.preventDefault();
        displayUsers($(this).val());
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
                            <div class="row g-1">
                                <div class="col-2 d-flex align-items-center">
                                  <img src="../../images/defaultUserImage.jpg" class="img-fluid rounded">
                                </div>
                                <div class="col-10">
                                  <div class="card-body">
                                    <h5 class="card-title">`+ data.fullName + `</h5>
                                    <small>` + data.id + `</small>
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
        complete: function () {
            $(".faculty").click(function (e) {
                e.preventDefault();
                $(".faculty").removeClass("list-group-item-warning active");
                $(this).addClass("list-group-item-warning active");
                var userid = $(this).attr("data-id");
                $.ajax({
                    url: "students/records.php",
                    type: "POST",
                    data: {
                        id: userid
                    },
                    success: function (dataResult) {
                        $("#records").html(dataResult);
                    },
                    error: function (result) {
                        console.log(result);
                    }
                });
            });
        }
    });
}

