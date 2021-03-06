export const parseJSONSafe = (string) => {
    try {
        return JSON.parse(string);
    } catch (error) {
        return null;
    };
};