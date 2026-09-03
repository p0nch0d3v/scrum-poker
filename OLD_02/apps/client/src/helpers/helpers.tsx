import Config from "../config/config";
import DOMPurify from 'dompurify'
import { validateUUID } from 'common/index';

const isUndefinedOrNull = function (value: any | null | undefined): boolean {
    return typeof value === 'undefined'
        || value === undefined
        || value === null;
}

const isUndefinedNullOrEmpty = function (value: string | null | undefined): boolean {
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

const getShortName = (input: string, count: number): string => {
    if (isUndefinedNullOrEmpty(input)) {
        return "";
    }
    const subItems = input.split(" ");
    if (subItems.length > 1) {
        let returnValue: string = ""
        for (let i = 0; i < Math.min(count, subItems.length); i++) {
            returnValue += subItems[i].substring(0, 1);
        }
        return returnValue;
    }
    else if (subItems[0].length > 1) {
        return subItems[0].substring(0, Math.min(count, subItems[0].length));
    }
    return subItems[0];
}

/*if (Config.IS_PRODUCTION) {
    window.console.log = () => { };
    window.console.debug = () => { };
    window.console.info = () => { };
}*/

export {
    isUndefinedOrNull,
    isUndefinedNullOrEmpty,
    shuffleArray,
    sanitizeText,
    reverseString,
    getShortName
};