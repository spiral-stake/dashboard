import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  address: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
});

const Users = mongoose.model("Users", userSchema);

export default Users;
