<?php
require '../../config/config.php';

// Start the session to store the admin ID
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get the input data
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Validate input
    if (empty($email) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Email and password are required']);
        exit;
    }

    // Check if the user exists in the database
    $sql = "SELECT id, email, password FROM admin_table WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // User exists, verify the password
        if (password_verify($password, $user['password'])) {
            // Password is correct, login successful

            // Store the admin ID in the session
            $_SESSION['admin_id'] = $user['id'];  // Store the ID in session

            echo json_encode([
                'status' => 'success',
                'message' => 'Login successful',
                'user' => [
                    'id' => $user['id'],
                    'email' => $user['email']
                ]
            ]);
        } else {
            // Password is incorrect
            echo json_encode(['status' => 'error', 'message' => 'Invalid email or password']);
        }
    } else {
        // User does not exist
        echo json_encode(['status' => 'error', 'message' => 'No account found with this email']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>