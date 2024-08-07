import User from './User.js';
import Facture from './Facture.js';
import Commande from './Commande.js';
import Contact from './Contact.js';
import Panier from './Panier.js';
import Promotion from './Promotion.js';
import Categorie from './Categorie.js';
import Produit from './Produit.js';
import DemandeRGPD from './DemandeRGPD.js';
import Paiement from './Paiement.js';
import Adresse from './Adresse.js';
import MethodePaiement from './MethodePaiement.js';
import Image from './Image.js';
import Panier_Produits from './Panier_Produits.js';
import DeletedUser from './DeletedUser.js';
import TempReservation from './TempReservation.js';

// Associations

// User associations
User.hasMany(Facture, { foreignKey: 'userId', sourceKey: 'id' });
Facture.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

User.hasMany(Commande, { foreignKey: 'userId', sourceKey: 'id' });
Commande.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

User.hasOne(Panier, { foreignKey: 'userId', sourceKey: 'id' });
Panier.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

User.hasMany(DemandeRGPD, { foreignKey: 'userId', sourceKey: 'id' });
DemandeRGPD.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

User.hasMany(Adresse, { foreignKey: 'userId', sourceKey: 'id' });
Adresse.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

User.hasMany(Contact, { foreignKey: 'userId', sourceKey: 'id' });
Contact.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

User.hasOne(DeletedUser, { foreignKey: 'userId', sourceKey: 'id' });
DeletedUser.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });
// Panier associations
Panier.hasOne(Commande, { foreignKey: 'panierId', sourceKey: 'id' });
Commande.belongsTo(Panier, { foreignKey: 'panierId', targetKey: 'id' });

Panier.belongsToMany(Produit, { through: Panier_Produits, foreignKey: 'panierId', sourceKey: 'id' });
Produit.belongsToMany(Panier, { through: Panier_Produits, foreignKey: 'produitId', sourceKey: 'id' });

// Produit associations
Produit.hasMany(Promotion, { foreignKey: 'produitId', sourceKey: 'id' });
Promotion.belongsTo(Produit, { foreignKey: 'produitId', targetKey: 'id' });

Categorie.hasMany(Produit, { foreignKey: 'categorieId', sourceKey: 'id' });
Produit.belongsTo(Categorie, { foreignKey: 'categorieId', targetKey: 'id' });

Produit.hasMany(Paiement, { foreignKey: 'produitId', sourceKey: 'id' });
Paiement.belongsTo(Produit, { foreignKey: 'produitId', targetKey: 'id' });

Produit.hasMany(Image, { foreignKey: 'produitId' });
Image.belongsTo(Produit, { foreignKey: 'produitId' });

// Facture associations
Commande.hasOne(Facture, { foreignKey: 'commandeId', sourceKey: 'id'});
Facture.belongsTo(Commande, { foreignKey: 'commandeId', targetKey: 'id'})

Facture.hasMany(Paiement, { foreignKey: 'factureId', sourceKey: 'id' });
Paiement.belongsTo(Facture, { foreignKey: 'factureId', targetKey: 'id' });

// Paiement associations
MethodePaiement.hasMany(Paiement, { foreignKey: 'methodePaiementId', sourceKey: 'id' });
Paiement.belongsTo(MethodePaiement, { foreignKey: 'methodePaiementId', targetKey: 'id' });

User.hasMany(TempReservation, { foreignKey: 'userId', sourceKey: 'id' });
TempReservation.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

Produit.hasMany(TempReservation, { foreignKey: 'produitId', sourceKey: 'id' });
TempReservation.belongsTo(Produit, { foreignKey: 'produitId', targetKey: 'id' });
