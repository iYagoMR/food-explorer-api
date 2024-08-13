const AppError = require("../utils/AppError");

// ['sales', 'customer', 'admin']

function verifyUserAuthorization(roleToVerify){
    return (request, response, next) => {
        const { role } = request.user;

        if(!roleToVerify.includes(role)){
            throw new AppError("Unhauthorized", 401);
        }

        return next();
    }
}

module.exports = verifyUserAuthorization;
