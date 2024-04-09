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

const compare_brawlers = (a, b) => {
    if (a.trophies < b.trophies) return -1;
    if (a.trophies == b.trophies) return 0;
    return 1;
}

function convert_brawler_name(s) {
    if (s == 'EL PRIMO') return 'El-Primo';
    if (s == '8-BIT') return '8-Bit';
    if (s == 'LARRY & LAWRIE') return 'Larry-%26-Lawrie';
    if (s == 'MR. P') return 'Mr-P';
    if (s == 'R-T') return 'R-T';
    return s[0].toUpperCase() + s.slice(1).toLowerCase();
}

send_xhr('POST', '/get_user_stats',
    {
        'user_id': get_cookie('user_id'),
        'token': get_cookie('token')
    },
    function(xhr) {
        if (xhr.status == 403) {
            console.log(403);
            document.cookie = 'username=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT'
            document.cookie = 'session_key=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT'
        } else if (xhr.status == 200) {
            document.getElementsByTagName('main')[0].innerHTML = `
                <div id="username"><p>${get_username()}</p></div>
                <div id="bs-stats">
                    <div id="account-info">
                        <div id="bs-username">${xhr.response.name}</div>
                        <div id="bs-tag">${xhr.response.tag}</div>
                    </div>
                    <div id="stats">
                        <div id="trophies">trophies: ${xhr.response.trophies}</div>
                        <div id="highest-trophies">highest trophies: ${xhr.response.highestTrophies}</div>
                        <div class="victories" id="solo-victories">solo victories: ${xhr.response.soloVictories}</div>
                        <div class="victories" id="duo-victories">duo victories: ${xhr.response.duoVictories}</div>
                        <div class="victories" id="3v3-victories">3v3 victories: ${xhr.response["3vs3Victories"]}</div>
                    </div>
                </div>
                <div id="brawlers"></div>
            `;
            let brawlers = xhr.response.brawlers;
            brawlers.sort(compare_brawlers).reverse();
            for (i in brawlers) {
                let brawler = brawlers[i];
                document.getElementById('brawlers').innerHTML += `
                <div class="brawler" id="brawler-${i}">
                    <img class="brawler-img" src="https://cdn-old.brawlify.com/brawler-bs/${convert_brawler_name(brawler.name)}.png" alt="${convert_brawler_name(brawler.name)}">
                    <p class="brawler-name">${convert_brawler_name(brawler.name)}</p>
                </div>
                `;
            }
            for (i in brawlers) {
                let name = brawlers[i].name;
                document.getElementById(`brawler-${i}`).addEventListener('click', () => {
                    window.location.replace(`/user/${get_username()}/${convert_brawler_name(name)}`);
                });
            }
        } else {
            console.log(xhr.status);
        }
    }
);