
const getGoogleNickname = function (input: string): string {
    const regex: RegExp = /(\".+\")|(\(.+\))/gmi;
    const result = input.match(regex);
    if (result && result.length > 0) {
        let match: string = result[0];
        const regexToClean: RegExp = /(\"|\(|\))/gmi;

        console.log(match)

        while (match.match(regexToClean)) {
            console.log(match);
            match = match.replace(regexToClean, '');
        }
        console.log(match)
        return match;
    }
    return input;
}

export {
    getGoogleNickname
}