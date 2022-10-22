<?php
include '../../include/autoloader.inc.php';
$subject = new Subject();
if (isset($_POST['GET_ALL_SUBJECTS_REQ'])) {
    echo json_encode((array)$subject->getAllSubject());
} elseif (isset($_POST['getFaculty'])) {
    $faculty = new Faculty();
    echo json_encode((array)$faculty->getFacultyInfo());
} 
// elseif (isset($_POST['EDIT_SUBJECT_REQ'])) {
//     echo json_encode((array)$subject->updateSubject($_POST['EDIT_SUBJECT_REQ']['subjectInfo']));
// } elseif (isset($_POST['REMOVE_SUBJECT_REQ'])) {
//     echo json_encode((array)$subject->removeSubject($_POST['REMOVE_SUBJECT_REQ']['subjectID']));
// } elseif (isset($_POST['REMOVE_ASSIGNED_FACULTY_REQ'])) {
//     echo json_encode((array)$subject->removeAssignedFaculty($_POST['REMOVE_ASSIGNED_FACULTY_REQ']['FACULTY_SUBJECT_JUNCTION_ID']));
// } elseif (isset($_POST['UNASSIGNED_FACULTY_REQ'])) {
//     echo json_encode((array)$subject->unassignedFaculty($_POST['UNASSIGNED_FACULTY_REQ']['ASSIGNED_FACULTY']));
// }   elseif (isset($_POST['ASSIGN_SELECTED_FACULTY_REQ'])) {
//     echo json_encode((array)$subject->assignSelectedFaculty(
//         $_POST['ASSIGN_SELECTED_FACULTY_REQ']['FACULTY'],
//         $_POST['ASSIGN_SELECTED_FACULTY_REQ']['SUBJECT_ID'])
//     );
// }elseif (isset($_POST['ADD_SUBJECT_REQ'])) {
//     echo json_encode((array)$subject->addNewSubject($_POST['ADD_SUBJECT_REQ']));
// }
