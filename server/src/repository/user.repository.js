import userModel from "../models/user.model.js"


export default class UserRepo{
  async  create(payload){
      return await  userModel.create(payload)
    }
    async findByEmail(email){
        return await userModel.findOne({email})
    }
}