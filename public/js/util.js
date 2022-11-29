export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

export function uniqId() {
    return Math.round(new Date().getTime() + (Math.random() * 100));
}

export function getUrlParameter(sParam) {
    let sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

export function getDate(data) {
    let options = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    let date = new Date(data);
    let now = new Date();

    if (date.getDate() == now.getDate()) {
        options = {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        };

        let remainTime = now.getTime() - date.getTime();
        let s = remainTime / 1000;
        if (s > 60) {
            let m = s / 60;
            if (m > 60) {
                let h = m / 60;
                return parseInt(h) + " giờ " + "trước";
            } else {
                return parseInt(m) + " phút " + "trước";
            }
        } else {
            if (s < 10) {
                return "Mới đây";
            }
            return parseInt(s) + " giây " + "trước";
        }
    }

    return date.toLocaleString(options);
};

export function formatNoticationNumber(num, push = 1) {
    let nextNum = parseInt(num, 10) + push;
    return {
        num: nextNum,
        display: nextNum > 99 ? "99+" : nextNum
    }
};