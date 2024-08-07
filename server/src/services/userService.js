import UserSQL from "../modelsSQL/User.js";
import UserMongo from "../modelsMongo/User.mongo.js";
import DeletedUserSQL from "../modelsSQL/DeletedUser.js";
import DeletedUserMongo from "../modelsMongo/DeletedUser.mongo.js";
import { comparePasswords } from "../helpers/passwordHelper.js";
import { get } from "mongoose";

const getUserWithAlias = async (id) => {
  return await UserMongo.aggregate([
    { $match: { _id: id } },
    {
      $project: {
        id: "$_id",
        nom: 1,
        prenom: 1,
        email: 1,
        telephone: 1,
        role: 1,
        wantsMailNewProduct: 1,
        wantsMailRestockProduct: 1,
        wantsMailChangingPrice: 1,
        wantsMailNewsletter: 1,
        _id: 0,
      },
    },
  ]).then((results) => results[0] || null);
};

export const getAllUsers = async () => {
  return await UserMongo.find().select({
    id: "$_id",
    nom: 1,
    prenom: 1,
    email: 1,
    telephone: 1,
    role: 1,
    wantsMailNewProduct: 1,
    wantsMailRestockProduct: 1,
    wantsMailChangingPrice: 1,
    wantsMailNewsletter: 1,
    _id: 0,
  });
};


export const getUser = async (id) => {
  return await UserSQL.findByPk(id);
};

export const getUserById = async (id) => {
  return getUserWithAlias(id);
};

export const getUserByEmail = async (email) => {
  return await UserMongo.aggregate([
    { $match: { email: email } },
    {
      $project: {
        id: "$_id",
        nom: 1,
        prenom: 1,
        email: 1,
        telephone: 1,
        role: 1,
        _id: 0,
      },
    },
  ]).then((results) => results[0] || null);
};

export const updateUserById = async (id, data) => {
  const user = await UserSQL.findByPk(id);
  if (!user) return null;

  const isPasswordMatch = data.password
    ? await comparePasswords(data.password, user.password)
    : true;

  const fieldsToUpdate = {};
  const fieldsToUpdateMongo = {};

  if (data.email && data.email !== user.email) {
    fieldsToUpdate.email = data.email;
    fieldsToUpdateMongo.email = data.email;
  }

  if (data.nom && data.nom !== user.nom) {
    fieldsToUpdate.nom = data.nom;
    fieldsToUpdateMongo.nom = data.nom;
  }

  if (data.prenom && data.prenom !== user.prenom) {
    fieldsToUpdate.prenom = data.prenom;
    fieldsToUpdateMongo.prenom = data.prenom;
  }

  if (data.telephone && data.telephone !== user.telephone) {
    fieldsToUpdate.telephone = data.telephone;
    fieldsToUpdateMongo.telephone = data.telephone;
  }

  if (data.password && !isPasswordMatch)
    fieldsToUpdate.password = data.password;

  if (Object.keys(fieldsToUpdate).length === 0) {
    return null;
  }

  Object.assign(user, fieldsToUpdate);
  await user.save();

  await UserMongo.findByIdAndUpdate(
    id,
    { $set: fieldsToUpdateMongo },
    { new: true }
  );

  return getUserById(id);
};

export const adminUpdateUserById = async (id, data) => {
  const user = await UserSQL.findByPk(id);
  if (!user) return null;

  const fieldsToUpdate = {};
  const fieldsToUpdateMongo = {};

  if (data.email && data.email !== user.email) {
    fieldsToUpdate.email = data.email;
    fieldsToUpdateMongo.email = data.email;
  }

  if (data.nom && data.nom !== user.nom) {
    fieldsToUpdate.nom = data.nom;
    fieldsToUpdateMongo.nom = data.nom;
  }

  if (data.prenom && data.prenom !== user.prenom) {
    fieldsToUpdate.prenom = data.prenom;
    fieldsToUpdateMongo.prenom = data.prenom;
  }

  if (data.telephone && data.telephone !== user.telephone) {
    fieldsToUpdate.telephone = data.telephone;
    fieldsToUpdateMongo.telephone = data.telephone;
  }

  if (data.role && data.role !== user.role) {
    fieldsToUpdate.role = data.role;
    fieldsToUpdateMongo.role = data.role;
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    return null;
  }

  Object.assign(user, fieldsToUpdate);
  await user.save();

  await UserMongo.findByIdAndUpdate(
    id,
    { $set: fieldsToUpdateMongo },
    { new: true }
  );

  return getUserById(id);
};

export const deleteUserById = async (id) => {
  try {
    const user = await UserSQL.findByPk(id);
    if (!user) {
      return null;
    }

    const deletedUserData = {
      role: user.role,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
      userId: user.id,
    };

    const deletedUserSQL = await DeletedUserSQL.create(deletedUserData);
    if (!deletedUserSQL) {
      return null;
    }

    const deletedUserMongo = await DeletedUserMongo.create({
      _id: deletedUserSQL.id,
      role: deletedUserSQL.role,
      isVerified: deletedUserSQL.isVerified,
      isBlocked: deletedUserSQL.isBlocked,
      userId: deletedUserSQL.userId,
    });
    if (!deletedUserMongo) {
      return null;
    }

    const userSQLDeleted = await user.destroy();
    if (!userSQLDeleted) {
      return null;
    }

    const userMongoDeleted = await UserMongo.findByIdAndDelete(id);
    if (!userMongoDeleted) {
      return null;
    }

    return true;
    
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};
