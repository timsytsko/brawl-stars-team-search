function send_xhr(method, addr, data, handler){
    let xhr = new XMLHttpRequest();
    xhr.open(method, addr);
    xhr.responseType = "json";
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = () => {
        handler(xhr);
    };
    xhr.send(JSON.stringify(data));
}

document.getElementById("login-btn").addEventListener("click", () => {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let terms_of_service = document.getElementById('terms-of-service').checked;
    send_xhr('POST', '/login_user',
        {
            'username': username,
            'password': password,
            'terms_of_service': terms_of_service
        },
        function(xhr) {
            if (xhr.status == 200) {
                document.cookie = "token=" + xhr.response.token + ";path=/" + ";expires=Fri, 31 Dec 9999 23:59:59 GMT";
                document.cookie = "user_id=" + xhr.response.user_id + ";path=/" + ";expires=Fri, 31 Dec 9999 23:59:59 GMT";
                window.location.replace('/');
            } else {
                document.getElementById('error-message').innerHTML = xhr.response.error;
            }
        }
    );
});