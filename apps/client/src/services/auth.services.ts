import { jwtDecode } from "jwt-decode";
import { isUndefinedNullOrEmpty, isUndefinedOrNull } from "../helpers/helpers";
import { UserDTO } from "models";

const isTokenValid = function (token: string | null | undefined): boolean {
    if (token) {
        const decoded = jwtDecode(token);
        if (decoded) {
            const currentDate = new Date();
            return (decoded.exp || 0) * 1000 >= currentDate.getTime();
        }
    }
    return false;
}

const getUser = function (token: string): UserDTO | null | undefined {
    if (token) {
        const decoded = jwtDecode(token);
        const parsedDecoded = JSON.parse(JSON.stringify(decoded))
        const { email, name, picture } = parsedDecoded;
        return { name, email, picture };
    }
    return null;
}

export {
    isTokenValid,
    getUser
}
