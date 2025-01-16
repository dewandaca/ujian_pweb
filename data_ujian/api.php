<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: *");

$servername = "localhost";
$username = "root"; // Ganti sesuai kredensial
$password = ""; // Ganti sesuai kredensial
$dbname = "stok_pakan";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["message" => "Connection failed: " . $conn->connect_error]));
}

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM stok";
        $result = $conn->query($sql);
        $stok = [];
        while ($row = $result->fetch_assoc()) {
            $stok[] = $row;
        }
        echo json_encode($stok);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $name = $conn->real_escape_string($data['name']);
        $quantity = intval($data['quantity']);
        $sql = "INSERT INTO stok (name, quantity) VALUES ('$name', $quantity)";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Stok berhasil ditambahkan"]);
        } else {
            echo json_encode(["message" => "Error: " . $conn->error]);
        }
        break;

        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);
            $id = intval($data['id']);
            $name = $conn->real_escape_string($data['name']); // Hindari SQL Injection
            $quantity = intval($data['quantity']);
        
            // Update quantity
            $sql = "UPDATE stok SET quantity = $quantity WHERE id = $id";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(["message" => "Stok berhasil diperbarui"]);
            } else {
                echo json_encode(["message" => "Error: " . $conn->error]);
            }
        
            // Update name
            $sql = "UPDATE stok SET name = '$name' WHERE id = $id";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(["message" => "Nama Pakan berhasil diperbarui"]);
            } else {
                echo json_encode(["message" => "Error: " . $conn->error]);
            }
            break;
        
    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = intval($data['id']);
        $sql = "DELETE FROM stok WHERE id = $id";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Stok berhasil dihapus"]);
        } else {
            echo json_encode(["message" => "Error: " . $conn->error]);
        }
        break;

    default:
        echo json_encode(["message" => "Method not allowed"]);
        break;
}

$conn->close();
