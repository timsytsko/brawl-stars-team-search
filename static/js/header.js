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

function get_cookie(name) {
    if (document.cookie.length > 0) {
        start = document.cookie.indexOf(name + "=");
        if (start != -1) {
            start = start + name.length + 1;
            end = document.cookie.indexOf(";", start);
            if (end == -1) {
                end = document.cookie.length;
            }
            return document.cookie.substring(start, end);
        }
    }
    return "no_cookie";
}

send_xhr('POST', '/check_token',
    {
        'user_id': get_cookie('user_id'),
        'token': get_cookie('token'),
    },
    function(xhr) {
        if (xhr.status == 403) {
            console.log(403);
            document.cookie = 'user_id=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT'
            document.cookie = 'token=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT'
        } else if (xhr.status == 200) {
            document.getElementById('login-signup').innerHTML = `
                <button id="profile-btn" class="btn btn-outline-light me-2">profile</button>
            `;
            document.getElementById('profile-btn').addEventListener('click', () => {
                window.location.replace(`/user/${xhr.response.username}`);
            });
        } else {
            console.log(xhr.status)
        }
    }
);