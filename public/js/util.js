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

export function getDate(data, isRaw = false, isRelative = true) {
    // TODO: check zone client
    let localZone = "vi-VN";

    let options = {
        hour: "2-digit",
        minute: "2-digit",
        // second: "2-digit",
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    let hourOptions = {
        hour: "2-digit",
        minute: "2-digit",
    };

    let dayOptions = {
        day: 'numeric'
    };

    let monthOptions = {
        month: 'long',
    };

    let date = new Date(data);
    let now = new Date();

    const formatter = new Intl.RelativeTimeFormat(localZone, options);

    if (!isRaw) {
        let relativeDate = null;
        let hour = date.toLocaleString(localZone, hourOptions);
        let day = " ngày " + date.toLocaleString(localZone, dayOptions);
        let month = " tháng " + date.toLocaleString(localZone, monthOptions);

        if (date.getFullYear() < now.getFullYear()) {
            relativeDate = hour
                + day
                + month
                + (isRelative ?
                (" - " + formatter.format(date.getFullYear() - now.getFullYear(), "year"))
                : "");
        }
        else if (date.getMonth() < now.getMonth()) {
            relativeDate = hour
                + day
                + (isRelative ?
                (" - " + formatter.format(date.getMonth() - now.getMonth(), "month"))
                : "");
        }
        else if (date.getDay() < now.getDay()) {
            relativeDate = hour
                + (isRelative ?
                (" - " + formatter.format(date.getDay() - now.getDay(), "day"))
                : "");
        }
        else if (date.getHours() < now.getHours()) {
            relativeDate = formatter.format(date.getHours() - now.getHours(), "hour");
        }
        else if (date.getMinutes() < now.getMinutes()) {
            relativeDate = formatter.format(date.getMinutes() - now.getMinutes(), "minute");
        }
        else if (date.getSeconds() < now.getSeconds()) {
            relativeDate = formatter.format(date.getSeconds() - now.getSeconds(), "second");
        } else {
            relativeDate = "Mới đây";
        }

        return relativeDate;
    }

    return date.toLocaleString(localZone, options);
};

export function formatNoticationNumber(num, push = 1) {
    let nextNum = parseInt(num, 10) + push;
    return {
        num: nextNum,
        display: nextNum > 99 ? "99+" : nextNum
    }
};