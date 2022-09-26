<?php
$details = json_encode($_POST['details']);
$details = json_decode($details);
?>

<div class="text-bg-light border p-4 mb-2">
    <div class="row g-3">
        <div class="col-3">
            <img src="../../<?php echo $details[0]->profile_picture; ?>" class="img-fluid rounded-circle">
        </div>
        <div class="col">
            <small><i class="fal fa-hashtag"></i> <?php echo $details[0]->id; ?></small>
            <h2><?php echo $details[0]->firstName . ' ' . $details[0]->lastName; ?></h2>
            <div><i class="fal fa-envelope mx-2"></i> <a href="mailto:<?php echo $details[0]->email; ?>" class="text-decoration-none link-dark"><?php echo $details[0]->email; ?></a></div>
            <div><i class="far fa-phone-alt mx-2"></i> <?php echo $details[0]->contact_no; ?></div>
            <button class="btn btn-sm btn-outline-secondary"><i class="fal fa-edit"></i> Edit</button>
        </div>
    </div>
</div>

<div class="">
    <h4 class="mb-1">Handled Subjects and Section</h4>
    <table class="table table-striped table-bordered table-sm text-center">
        <thead>
            <tr>
                <th>Subject Code</th>
                <th>Description</th>
                <th>Section</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>IT 102</td>
                <td>Introduction to Computing</td>
                <td>
                    <span class="badge text-bg-dark me-1">4G-G1</span>
                    <span class="badge text-bg-dark me-1">4G-G2</span>
                </td>
            </tr>
        </tbody>
    </table>
</div>
