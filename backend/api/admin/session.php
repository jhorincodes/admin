<?php
session_start();

// Check if the admin is logged in and the session contains the admin ID
if (isset($_SESSION['admin_id'])) {
    echo json_encode([
        'status' => 'success',
        'admin_id' => $_SESSION['admin_id']  // Return the admin ID stored in the session
    ]);
    exit;
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Admin not logged in'
    ]);
}
?>