const validateUUID = function (uuid: string): boolean {
    const regexV1 = /^[0-9A-F]{8}-[0-9A-F]{4}-[1][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    const regexV2 = /^[0-9A-F]{8}-[0-9A-F]{4}-[2][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    const regexV3 = /^[0-9A-F]{8}-[0-9A-F]{4}-[3][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    const regexV4 = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    const regexV5 = /^[0-9A-F]{8}-[0-9A-F]{4}-[5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

    return regexV1.test(uuid) || regexV2.test(uuid) || regexV3.test(uuid) || regexV4.test(uuid) || regexV5.test(uuid)
};

const isUndefinedNullOrEmpty = function(value: string | undefined): boolean {
    return typeof value === 'undefined'
        || value === undefined
        || value === null
        || value.length === 0;
}

export {
    validateUUID,
    isUndefinedNullOrEmpty
};