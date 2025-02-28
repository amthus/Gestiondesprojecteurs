const sendServerError = function(response, error) {
    throw new Error(error);
}