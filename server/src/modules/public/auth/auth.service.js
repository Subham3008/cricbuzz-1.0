import UserRepo from "../../../repository/user.repository.js";
import jwt from "jsonwebtoken";
import env from "../../../config/env.js";
export default class AuthService {
  constructor() {
    this.userRepo = new UserRepo();
  }
  async createUser(user) {
    const isUserPresent = await this.userRepo.findByEmail(user.emails[0].value);
    let result = isUserPresent;
    if (!isUserPresent) {
      const _user = await this.userRepo.create({
        email: user.emails[0].value,
        picture: user.photos[0].value,
        name: user.displayName,
      });
      result = _user;
    }
    let data = {
      _id: user.id,
      email: user.emails[0].value,
      picture: user.photos[0].value,
      role:result.role,
      name: user.displayName,
    };

    const accessToken = jwt.sign(data, env.JWT_ACCESS_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(data, env.JWT_REFRESH_SECRET, {
      expiresIn: "1d",
    });
    return {
        accessToken,
        refreshToken
    }
  }
}
