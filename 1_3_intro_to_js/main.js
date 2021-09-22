let button = document.getElementById("clickme"), count = 0;

function userName() {
    let x = 
        document.getElementById("userName").value;
    
    document.getElementById(
      "displayName").innerHTML = x;
}
button.onclick = function() { 
    count += 1;
    displayBoard.innerHTML = "Clicker Count: " + count;
};
