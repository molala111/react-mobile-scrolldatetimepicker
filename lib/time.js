function throwIfInvalidDate(date) {
    if (Object.prototype.toString.call(date, null) !== '[object Date]') {
        throw new Error('参数类型不对');
    }
}

function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

export function convertDate(date, format) {
    let str = format;
    const o = {
        'M+': date.getMonth() + 1,
        'D+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
    };
    if (/(Y+)/.test(format)) {
        str = str.replace(RegExp.$1,
                (date.getFullYear().toString()).substr(4 - RegExp.$1.length));
    }

    for (const k in o) { // eslint-disable-line
        if (new RegExp(`(${k})`).test(format)) {
            str = str.replace(RegExp.$1,
                (RegExp.$1.length === 1) ?
                o[k] : (`00${o[k]}`.substr((o[k].toString()).length)));
        }
    }
    return str;
}

export function nextYear(now, index = 0) {
    // console.log(now)
    throwIfInvalidDate(now);

    const date = new Date(now.getFullYear() + index, now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
    return date;
}

export function nextMonth(now, index = 0) {
    throwIfInvalidDate(now);
    const year = now.getFullYear();
    const month = now.getMonth() + index;
    const dayOfMonth = Math.min(now.getDate(), daysInMonth(year, month));
    const date = new Date(year, month, dayOfMonth, now.getHours(), now.getMinutes());
    return date;
}

export function nextDate(now, index = 0) {
    throwIfInvalidDate(now);
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + index, now.getHours(), now.getMinutes());
    return date;
}
export function nextHour(now, index = 0) {
    throwIfInvalidDate(now);
    const hour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + index, now.getMinutes());
    return hour;
}
export function nextMinute(now, index = 0) {
    throwIfInvalidDate(now);
    const min = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + index);
    return min;
}
