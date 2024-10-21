const { verify, decode } = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const authConfig = require('../configs/auth');

function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token não informado', 401);
  }

  const [, token] = authHeader.split(' ');
  
  try {
    // Decode the token without verification (just for logging purposes)
    // const decodedToken = decode(token);
    // console.log('Decoded token:', decodedToken);

    const { role, sub: user_id } = verify(token, authConfig.jwt.secret);

    request.user = {
      id: Number(user_id),
      role
    };

    return next();
  } catch(error) {
    throw new AppError('Invalid JWT token', 401);
  }
}

module.exports = ensureAuthenticated;