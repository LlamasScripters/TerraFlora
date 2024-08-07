import { DataTypes } from 'sequelize';
import { connection } from './dataBase.js';
import bcrypt from 'bcryptjs';

const User = connection.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'ROLE_USER'
  },
  haveConsented: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastUpdatedPassword: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  wantsMailNewProduct: {
    type: DataTypes.BOOLEAN,
    defaultValue: false 
  },
  wantsMailRestockProduct: {
    type: DataTypes.BOOLEAN,
    defaultValue: false  
  },
  wantsMailChangingPrice: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  wantsMailNewsletter: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isBlocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {});

  User.addHook('beforeCreate', async (user) => {
    user.password = await bcrypt.hash(user.password, await bcrypt.genSalt());
  });

  User.addHook('beforeUpdate', async (user, { fields }) => {
    if (fields.includes('password')) {
      user.password = await bcrypt.hash(user.password, await bcrypt.genSalt());
    }
  });

export default User;
