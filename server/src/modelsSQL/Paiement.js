import { DataTypes } from 'sequelize';
import { connection } from './dataBase.js';
import MethodePaiement from './MethodePaiement.js';

const Paiement = connection.define('Paiement', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    datePaiement: {
        type: DataTypes.DATE,
        allowNull: false
    },
    montant: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    methodePaiementId: {
        type: DataTypes.UUID,
        references: {
            model: MethodePaiement,
            key: 'id'
        }
    }
}, {
    tableName: 'Paiements'
});

export default Paiement;
