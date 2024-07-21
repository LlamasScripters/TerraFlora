import CategorieSQL from "../modelsSQL/Categorie.js";
import CategorieMongo from "../modelsMongo/Categorie.mongo.js";

const getCategoryWithAlias = async (id) => {
  return await CategorieMongo.aggregate([
    { $match: { _id: id } },
    {
      $project: {
        id: "$_id",
        nom: 1,
        description: 1,
        //produits: 1,
        _id: 0,
      },
    },
  ]).then((results) => results[0] || null);
};

export const findAllCategories = async () => {
  return await CategorieMongo.find().select({
    id: "$_id",
    nom: 1,
    description: 1,
    //produits: 1,
    _id: 0,
  });
};

export const findCategoryById = async (id) => {
  return getCategoryWithAlias(id);
};

export const createCategory = async (categoryData) => {
  const { nom, description } = categoryData;
  const newCategory = await CategorieSQL.create({ nom, description });
  if (newCategory) {
    await CategorieMongo.create({
      _id: newCategory.id,
      nom,
      description,
      produits: [],
    });
  }
  return newCategory;
};

export const updateCategory = async (id, updateData) => {
  const category = await CategorieSQL.findByPk(id);
  if (category) {
    await category.update(updateData);
    await CategorieMongo.updateOne({ _id: id }, updateData);
    return true;
  }
  return false;
};

export const deleteCategory = async (id) => {
  const category = await CategorieSQL.findByPk(id);
  if (category) {
    await category.destroy();
    await CategorieMongo.deleteOne({ _id: id });
    return true;
  }
  return false;
};
