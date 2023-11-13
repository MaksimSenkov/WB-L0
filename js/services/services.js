export function formatNumber(number) {
    return number.toLocaleString("ru-RU");
}

export function convertStringToLocaleDayWithMonth(date) {
    const options = {
        month: "long",
        day: "numeric",
    };

    return date.toLocaleDateString(date, options);
}

export function getNoun(number, one, two, five) {
    let n = Math.abs(number);

    if (n >= 5 && n <= 20) {
        return five;
    }

    n %= 10;

    if (n === 1) {
        return one;
    }

    if (n >= 2 && n <= 4) {
        return two;
    }

    return five;
}
