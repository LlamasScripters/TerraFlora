import { DataTypes } from "sequelize";
import { connection } from "./dataBase.js";

const Produit = connection.define(
  "Produit",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    prix: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stockThreshold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    marque: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    couleur: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    taille: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isPromotion: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    pourcentagePromotion: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    priceId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Produits",
  }
);

export default Produit;
