import { ref } from 'vue';
import instance from '../axios';
import z from 'zod';

const addressSchema = z.object({
  id: z.string().optional(),
  voie: z.enum(['allée', 'avenue', 'boulevard', 'chemin', 'cours', 'impasse', 'passage', 'place', 'quai', 'route', 'rue', 'square', 'voie']),
  rue: z.string().min(1).max(50),
  numero: z.string().min(1).max(4),
  ville: z.string().min(1).max(50),
  codePostal: z.string().min(5).max(5),
  isDeliveryAddress: z.boolean(),
  isBillingAddress: z.boolean(),
});

const addressUpdateSchema = addressSchema.extend({
  user: z.object({
    nom: z.string(),
    prenom: z.string(),
    email: z.string(),
  })
});

export const useAddress = () => {
  const address = ref(null);
  const addresses = ref([]);
  const loading = ref(false);

  // Fonction pour récupérer l'adresse par l'ID de l'utilisateur
  const fetchAddress = async () => {
    loading.value = true;
    try {
      const response = await instance.get(`address/`);
      if (!response.data) {
        console.error('Aucune donnée adresse trouvée');
        return;
      }
      
      address.value = addressSchema.parse(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'adresse:', error);
    } finally {
      loading.value = false;
    }
  };

  // Fonction pour récupérer toutes les adresses
  const fetchAddresses = async () => {
    loading.value = true;
    try {
      const response = await instance.get('address');
      if (!response.data) {
        console.error('Aucune donnée adresse trouvée');
        return;
      }
      
      if (Array.isArray(response.data)) {
        addresses.value = response.data.map((address) => addressUpdateSchema.parse(address));
      } else {
        console.error('Réponse invalide: les données d\'adresse sont invalides');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des adresses:', error);
    } finally {
      loading.value = false;
    }
  }

  // Fonction pour créer une adresse
  const createAddress = async (userId, newAddress) => {
    loading.value = true;
    try {
      const validatedData = addressSchema.parse(newAddress);
      if (!validatedData) {
        console.error('Les données de l\'adresse ne sont pas valides');
        return;
      }

      validatedData.userId = userId;
      const response = await instance.post('address', validatedData);

      if (!response.data) {
        console.error('Aucune donnée adresse trouvée');
        return;
      }

      address.value = addressSchema.parse(response.data);
    } catch (error) {
      console.error('Erreur lors de la création de l\'adresse:', error);
    } finally {
      loading.value = false;
    }
  };

  // Fonction pour mettre à jour l'adresse par son ID
  const updateAddress = async (addressId, updatedAddress) => {
    loading.value = true;
    try {
      const validatedData = addressSchema.parse(updatedAddress);
      if (!validatedData) {
        console.error('Les données de l\'adresse ne sont pas valides');
        return;
      }

      const response = await instance.put(`address/${addressId}`, validatedData);
      if (!response.data) {
        console.error('Aucune donnée adresse trouvée');
        return;
      }
      
      address.value = addressSchema.parse(response.data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'adresse:', error);
    } finally {
      loading.value = false;
    }
  };

  //Fonction pour supprimer l'adresse par son ID
  const deleteAddress = async (addressId) => {
    loading.value = true;
    try {
      const response = await instance.delete(`address/${addressId}`);
      if (!response.data) {
        console.error('Aucune donnée adresse trouvée');
        return;
      }
      
      addressDeleted = addressSchema.parse(response.data);
      if (addressDeleted) {
        address.value = null;
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'adresse:', error);
    } finally {
      loading.value = false;
    }
  };

  return {
    address,
    addresses,
    loading,
    fetchAddress,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
  };
};
