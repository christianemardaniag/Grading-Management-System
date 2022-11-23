$(document).ready(function () {
    $("#alertSuccess").hide();
    $("#alertError").hide();
    $.ajax({
        type: "POST",
        url: "../criteria/process.criteria.php",
        data: { GET_CRITERIA_REQ: true },
        dataType: "JSON",
        success: function (GET_CRITERIA_RESP) {
            var content = ``;
            $.each(GET_CRITERIA_RESP, function (i, data) {
                content += `
                <div class="col-8">
                    <label for="c${i + 1}">${data.name}</label>
                </div>
                <div class="col-4">
                    <div class="input-group">
                        <input type="number" class="form-control criteria" min="0" name="c${i + 1}" id="c${i + 1}" value="${data.equiv}">
                        <span class="input-group-text" id="basic-addon1">%</span>
                    </div>
                </div>
                `;
            });
            $("#listOfCriteria").html(content);
            $(".criteria").change(function (e) {
                e.preventDefault();
                var c1 = parseInt($("#c1").val());
                var c2 = parseInt($("#c2").val());
                var c3 = parseInt($("#c3").val());
                var c4 = parseInt($("#c4").val());
                var c5 = parseInt($("#c5").val());
                var total = c1 + c2 + c3 + c4 + c5;
                if (total != 100) {
                    $("#alertError").show();
                    $("#saveBtn").attr("disabled", true);
                } else {
                    $("#alertError").hide();
                    $("#saveBtn").removeAttr("disabled");
                }
            });
        }
    });

    

    $("#criteriaForm").submit(function (e) {
        e.preventDefault();
        var data = $(this).serializeArray();
        data.push({ name: 'UPDATE_CRITERIA_REQ', value: true });
        $.ajax({
            type: "POSt",
            url: "../criteria/process.criteria.php",
            data: data,
            // dataType: "JSON",
            success: function (UPDATE_CRITERIA_RESP) {
                console.log(UPDATE_CRITERIA_RESP);
                $("#alertSuccess").show();
                setTimeout(() => { $("#alertSuccess").hide() }, 3000)
            }, error: function (response) {
                console.error(response);
                $("#error").html(response.responseText);
            }
        });
    });
});
