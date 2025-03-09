<?php
require '../../config/config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    if ($password !== $confirm_password) {
        echo json_encode(['status' => 'error', 'message' => 'Passwords do not match']);
        exit;
    }
   // Check for duplicate email
   $sql = "SELECT COUNT(*) FROM admin_table WHERE email = :email";
   $stmt = $pdo->prepare($sql);
   $stmt->execute(['email' => $email]);
   $count = $stmt->fetchColumn();

   if ($count > 0) {
       echo json_encode(['status' => 'error', 'message' => 'Email already exists']);
       exit;
   }
    // Hash the password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insert the new admin into the database
    $sql = "INSERT INTO admin_table (email, password, date_created) VALUES (:email, :password, NOW())";
    $stmt = $pdo->prepare($sql);

    try {
        $stmt->execute(['email' => $email, 'password' => $hashed_password]);
        echo json_encode(['status' => 'success', 'message' => 'Registration successful']);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Registration failed: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>