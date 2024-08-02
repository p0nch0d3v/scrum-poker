import Config from "../config/config";
import DOMPurify from 'dompurify'

const validateUUID = function (uuid: string | undefined): boolean {
    uuid = (uuid === undefined || uuid === null) ? '' : uuid;
    const regexV1 = /^[0-9A-F]{8}-[0-9A-F]{4}-[1][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    const regexV2 = /^[0-9A-F]{8}-[0-9A-F]{4}-[2][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    const regexV3 = /^[0-9A-F]{8}-[0-9A-F]{4}-[3][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    const regexV4 = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    const regexV5 = /^[0-9A-F]{8}-[0-9A-F]{4}-[5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

    return regexV1.test(uuid) || regexV2.test(uuid) || regexV3.test(uuid) || regexV4.test(uuid) || regexV5.test(uuid)
};

const isUndefinedOrNull = function (value: any | undefined): boolean {
    return typeof value === 'undefined'
        || value === undefined
        || value === null;
}

const isUndefinedNullOrEmpty = function (value: string | undefined): boolean {
    return typeof value === 'undefined'
        || value === undefined
        || value === null
        || value.length === 0;
}

const shuffleArray = (array: Array<any>) => {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

const sanitizeText = (input: any): any => {
    const clean = DOMPurify.sanitize(input, { USE_PROFILES: { html: false } });
    return clean
}

function reverseString(input: string): string {
    return input.split("").reverse().join("");
}

const getShortName = (input: string): string => {
    if (isUndefinedNullOrEmpty(input)) {
        return "";
    }
    const subItems = input.split(" ");
    if (subItems.length > 1) {
        return subItems[0].substring(0, 1) + subItems[1].substring(0, 1);
    }
    else if (subItems[0].length > 1) {
        return subItems[0].substring(0, 2);
    }
    return subItems[0];
}

if (Config.IS_PRODUCTION) {
    window.console.log = () => { };
    window.console.debug = () => { };
    window.console.info = () => { };
}

export {
    validateUUID,
    isUndefinedOrNull,
    isUndefinedNullOrEmpty,
    shuffleArray,
    sanitizeText,
    reverseString,
    getShortName
};