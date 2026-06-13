import userModel from "../models/user.model.js";

export default class UserRepo {
  async create(payload) {
    return await userModel.create(payload);
  }
  async findByEmail(email) {
    return await userModel.findOne({ email });
  }

  async findAll() {
    return await userModel
      .find({
        isDeleted: false,
      })
      .select("-password");
  }

  async findById(id) {
    return await userModel
      .findById({
        _id: id,
        isDeleted: false,
      })
      .select("-password");
  }
  async countByRole(role) {
    return await userModel.countDocuments({ role, isDeleted: false });
  }
}
