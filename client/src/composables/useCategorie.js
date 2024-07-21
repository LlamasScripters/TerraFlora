import { ref } from 'vue';
import instance from '../axios';
import z from 'zod';

const produitSchema = z.object({
    _id: z.string(),
    nom: z.string(),
    description: z.string(),
    prix: z.string(),
});

const categorieSchema = z.object({
    id: z.string().optional(),
    nom: z.string().min(1).max(50),
    description: z.string().min(1).max(255),
    produits: z.array(produitSchema).optional(),
});

export const useCategorie = () => {
    const categorie = ref(null);
    const categories = ref([]);
    const loading = ref(false);

    const fetchCategorie = async () => {
        loading.value = true;
        try {
            const response = await instance.get(`categories/`);
            if (!response.data) {
                console.error('Aucune donnée catégorie trouvée');
                return;
            }

            categorie.value = categorieSchema.parse(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération de la catégorie:', error);
        } finally {
            loading.value = false;
        }
    };

    const fetchCategories = async () => {
        loading.value = true;
        try {
            const response = await instance.get('categories');
            if (!response.data) {
                console.error('Aucune donnée catégorie trouvée');
                return;
            }

            if (Array.isArray(response.data)) {
                categories.value = response.data.map((categorie) => categorieSchema.parse(categorie));
            } else {
                console.error('Réponse invalide: les données de catégorie sont invalides');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories:', error);
        } finally {
            loading.value = false;
        }
    };

    return { 
        categorie, 
        categories, 
        loading, 
        fetchCategorie, 
        fetchCategories 
    };
}
