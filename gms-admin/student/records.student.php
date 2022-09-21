<?php
$details = json_encode($_POST['details']);
$details = json_decode($details);
?>

<div class="text-bg-light border p-4">
    <div class="row g-3">
        <div class="col-3">
            <img src="../../images/defaultUserImage.jpg" class="img-fluid rounded-circle">
        </div>
        <div class="col">
            <small><i class="fal fa-hashtag"></i> <?php echo $details[0]->id; ?></small>
            <h2><?php echo $details[0]->firstName . ' ' . $details[0]->lastName; ?></h2>
            <div><i class="fal fa-envelope mx-2"></i> <a href="mailto:<?php echo $details[0]->email; ?>" class="text-decoration-none link-dark"><?php echo $details[0]->email; ?></a></div>
            <div><i class="far fa-phone-alt mx-2"></i> <?php echo $details[0]->contact_no; ?></div>
            <!-- <button class="btn btn-sm btn-outline-secondary"><i class="fal fa-edit"></i> Edit</button> -->
        </div>
    </div>
</div>
