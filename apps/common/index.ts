
const getGoogleNickname = function (input: string): string {
    const regex: RegExp = /(\".+\")|(\(.+\))/gmi;
    const result = input.match(regex);
    if (result && result.length > 0) {
        let match: string = result[0];
        const regexToClean: RegExp = /(\"|\(|\))/gmi;

        while (match.match(regexToClean)) {
            match = match.replace(regexToClean, '');
        }

        return match;
    }
    return input;
}

export {
    getGoogleNickname
}