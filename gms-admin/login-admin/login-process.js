$(document).ready(function () {
    $("#fPSpinner").hide();
    $("#errorAlert").hide();
    $("#errorAlertFP").hide();
    $("#successAlertFP").hide();

    $('#forgotPasswordModal').on('show.bs.modal', function (e) {
        $("#errorAlertFP").hide();
        $("#successAlertFP").hide();
        $("#forgotPasswordForm").trigger("reset");
    })

    $("#loginForm").submit(function (event) {
        event.preventDefault();
        var data = $(this).serializeArray();  // Form Data
        data.push({name: 'login-admin', value: true});
        $.ajax({
            type: "POST",
            url: "process-admin/main.process.php",
            data: data,
            dataType: "JSON",
            success: function (response) {
                if (response.status) {
                    window.location.href = '../gms-admin/main?url=dashboard';
                } else {
                    $("#errorAlert").html(response.msg);
                    $("#errorAlert").fadeIn();
                }
            },
            error: function (response) {
                $("#errorAlert").html("We encounter a problem when logging your account. Contact developer for more info");
                $("#errorAlert").show();
                console.log(response.responseText);
            }
        });
    });

    $("#forgotPasswordForm").submit(function (event) {
        event.preventDefault();
        $.ajax({
            url: "process-admin/main.process.php",
            type: "post",
            data: {
                email: $("#fpEmail").val(),
                'forgot-password-admin': true
            },
            beforeSend: function () {
                $("#fPSpinner").show();
                $("#forgotbtn").attr("disabled", "disabled");
            },
            success: function (response) {
                if (response) {
                    $("#successAlertFP").fadeIn();
                    $("#successAlertFP").html(response.msg);
                    $("#errorAlertFP").hide();
                    $("#forgotPasswordForm").trigger("reset");
                } else {
                    $("#errorAlertFP").fadeIn();
                    $("#errorAlertFP").html(response.msg);
                    $("#successAlertFP").hide();
                }
                $("#fPSpinner").hide();
                $("#forgotbtn").removeAttr("disabled");
            }
        });
    });
});
