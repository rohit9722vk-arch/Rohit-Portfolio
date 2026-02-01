function saveData() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;

    if (name === "" || email === "") {
        alert("Please fill all fields");
        return;
    }

    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);

    alert("Data saved in LocalStorage");
}

function getData() {
    let name = localStorage.getItem("userName");
    let email = localStorage.getItem("userEmail");

    if (name === null || email === null) {
        document.getElementById("output").innerText = "No data found";
    } else {
        document.getElementById("output").innerText =
            "Name: " + name + " | Email: " + email;
    }
}

function clearData() {
    localStorage.clear();
    document.getElementById("output").innerText = "";
    alert("LocalStorage cleared");
}
