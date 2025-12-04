<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];

    // Format the data as a CSV line
    $data = "$name, $email\n";

    // Append the data to a file named 'form_data.csv'
    file_put_contents('form_data.csv', $data, FILE_APPEND | LOCK_EX);

    echo "Data added successfully!";
}
?>
