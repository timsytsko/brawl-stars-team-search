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

document.getElementById("register-btn").addEventListener("click", () => {
    let username = document.getElementById('username').value;
    let brawl_stars_tag = document.getElementById('brawl-stars-tag').value;
    let password = document.getElementById('password').value;
    let password_repetition = document.getElementById('password-repetition').value;
    let terms_of_service = document.getElementById('terms-of-service').checked;
    send_xhr('POST', '/register_user',
        {
            'username': username,
            'brawl_stars_tag': brawl_stars_tag,
            'password': password,
            'password_repetition': password_repetition,
            'terms_of_service': terms_of_service
        },
        function(xhr) {
            if (xhr.status == 200) {
                window.location.replace('/');
            } else {
                document.getElementById('error-message').innerHTML = xhr.response.error;
            }
        }
    );
});