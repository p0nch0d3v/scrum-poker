
const getGoogleNickname = function (input: string): string {
    const regex: RegExp = /(\".+\")|(\“.+\”)|(\(.+\))/gmi;
    const result = input.match(regex);
    if (result && result.length > 0) {
        let match: string = result[0];
        const regexToClean: RegExp = /(\"|\“|\”|\(|\))/gmi;

        while (match.match(regexToClean)) {
            match = match.replace(regexToClean, '');
        }

        return match;
    }
    return input;
}

const validateUUID = function (uuid: string): boolean {
    const regexV1 = /^[0-9A-F]{8}-[0-9A-F]{4}-[1][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    const regexV2 = /^[0-9A-F]{8}-[0-9A-F]{4}-[2][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    const regexV3 = /^[0-9A-F]{8}-[0-9A-F]{4}-[3][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    const regexV4 = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    const regexV5 = /^[0-9A-F]{8}-[0-9A-F]{4}-[5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

    return regexV1.test(uuid) || regexV2.test(uuid) || regexV3.test(uuid) || regexV4.test(uuid) || regexV5.test(uuid)
  };

export {
    getGoogleNickname,
    validateUUID
}