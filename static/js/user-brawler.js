function send_xhr(method, addr, data, handler) {
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

function get_username() {
    return window.location.pathname.split('/')[2];
}

function get_brawler() {
    return window.location.pathname.split('/')[3];
}

function convert_brawler_name(s) {
    if (s == 'EL PRIMO') return 'El-Primo';
    if (s == '8-BIT') return '8-Bit';
    if (s == 'LARRY & LAWRIE') return 'Larry-%26-Lawrie';
    if (s == 'MR. P') return 'Mr-P';
    if (s == 'R-T') return 'R-T';
    return s[0].toUpperCase() + s.slice(1).toLowerCase();
}

console.log(get_brawler());
console.log(get_username());