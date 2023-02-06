const validateHelper = {};
const { AppError } = require("./utils");

validateHelper.keywordQueryCheck = (query, acceptedFilterKeyArr) => {
    const keywordQuerryArr = Object.keys(query);
    // Remove page, limit out of query. These factors will be used directly when finding in collections
    if (query.page) {
        query.page = ""
    } ;
    if (query.limit) {
        query.limit = ""
    } ;
    if (query?.wallet?.toLowerCase() === "all") {
        query.wallet = ""
    };
    
    keywordQuerryArr.forEach((keyword) => {
        if (!acceptedFilterKeyArr.includes(keyword)) {
            throw new AppError(
                400,
                `Query ${keyword} is not accepted`,
                "Bad request"
            );
            return
        }
        if (!query[keyword]) delete query[keyword];
    });

    query.is_deleted = false;
    return query;
}

validateHelper.keywordBodyCheck = (body, acceptedKeyArr) => {
    const keywordBodyArr = Object.keys(body);
    const acceptedKeyArrToText = acceptedKeyArr.join(", ")

    keywordBodyArr.forEach((keyword) => {
        if (!acceptedKeyArr.includes(keyword)) {
            throw new AppError(
                400,
                `Keyword ${keyword} is not accepted. Only ${acceptedKeyArrToText} are accepted for updating`,
                "Bad request"
            );
            return
        }
        if (!body[keyword]) delete body[keyword];
    });
    return body
}

module.exports = validateHelper;