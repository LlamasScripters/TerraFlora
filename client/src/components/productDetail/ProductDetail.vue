<template>
  <div class="product-detail-container max-w-7xl mx-auto py-8" v-if="product.nom">
    <div class="flex flex-col lg:flex-row">
      <div class="product-images lg:w-1/2 p-4">
        <div class="product-image-wrapper flex items-center justify-center h-80 overflow-hidden rounded">
          <img
            :src="getImageUrl(product.Images[0]?.imageUrl)"
            alt="Product Image"
            class="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
      <div class="product-info lg:w-1/2 p-4">
        <h1 class="text-3xl font-bold mb-4">{{ product.nom }}</h1>
        <p class="mb-4 text-gray-600">Marque: {{ product.marque }}</p>
        <div class="flex items-center mb-4">
          <div class="text-yellow-500 mr-2">
            <i class="bi bi-star text-gray-300" v-for="n in 5" :key="n"></i>
          </div>
          <span class="text-gray-500">0 Reviews</span>
        </div>
        <div class="flex items-center mb-4">
          <span class="text-2xl font-bold text-red-600 mr-2">{{ product.prix }} €</span>
          <span v-if="product.isPromotion" class="line-through text-gray-500">{{ (product.prix / ((100 - product.pourcentagePromotion) / 100)).toFixed(2) }} €</span>
        </div>
        <div :class="{'text-red-600': product.stock === 0, 'text-yellow-500': product.stock <= product.stockThreshold && product.stock > 0, 'text-green-600': product.stock > product.stockThreshold}" class="mb-4 font-semibold">
          {{ product.stock }} EN STOCK
        </div>
        <p v-if="product.stock <= product.stockThreshold && product.stock > 0" class="mb-4 text-yellow-500 text-sm"> <i class="bi bi-exclamation-triangle"></i> Il reste très peu de produits en stock</p>
        <p class="mb-4">{{ product.description }}</p>
        <div class="mb-4">
          <div>
            <label class="block text-gray-700">Taille:</label>
            <span>{{ product.taille }}</span>
          </div>
          <div class="mt-4">
            <label class="block text-gray-700">Couleur:</label>
            <span>{{ product.couleur }}</span>
          </div>
        </div>
        <div class="flex items-center mb-4">
          <div class="quantity flex items-center mr-4">
            <button :disabled="quantity <= 1 || product.stock === 0" class="px-4 py-2 bg-gray-200" @click="decreaseQuantity">-</button>
            <input type="number" v-model.number="quantity" class="w-12 text-center border-t border-b" :disabled="product.stock === 0" @input="validateQuantity" min="1" :max="product.stock" />
            <button :disabled="quantity >= product.stock || product.stock === 0" class="px-4 py-2 bg-gray-200" @click="increaseQuantity">+</button>
          </div>
          <button v-if="product.stock > 0" class="px-4 py-2 bg-red-600 text-white rounded" @click="addToCart"><i class="bi bi-cart-plus"></i> Ajouter au panier</button>
          <span v-else class="text-red-600">Rupture de stock</span>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex flex-col items-center justify-center min-h-screen text-center">
    <div class="bg-red-100 text-red-600 p-6 rounded-full mb-4">
      <i class="bi bi-exclamation-triangle-fill" style="font-size: 3rem;"></i>
    </div>
    <h1 class="text-3xl font-bold mb-4">Erreur : le produit est introuvable</h1>
    <p class="text-gray-600 mb-4">Nous sommes désolés, mais le produit que vous recherchez n'existe pas ou a été supprimé.</p>
    <router-link to="/shop" class="px-4 py-2 bg-red-600 text-white rounded">Retour aux produits</router-link>
    <router-link to="/" class="px-4 py-2 bg-gray-600 text-white rounded mt-2">Retour à l'accueil</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useCartStore } from "../../pinia/cart.js";
import { useToast } from 'vue-toastification';
import axios from "axios";

const route = useRoute();
const product = ref({
  nom: "",
  description: "",
  prix: 0,
  stock: 0,
  marque: "",
  couleur: "",
  taille: "",
  isPromotion: false,
  pourcentagePromotion: 0,
  categorieId: "",
  Images: [],
});
const quantity = ref(1);
const cartStore = useCartStore();
const toast = useToast();

onMounted(async () => {
  const productName = decodeURIComponent(route.params.name);
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_URL + `product/name/${productName}`
    );
    product.value = response.data;

    // Transformation de l'URL de l'image
    if (product.value.Images && product.value.Images.length > 0) {
      product.value.Images = product.value.Images.map((image) => ({
        ...image,
        imageUrl: `uploads/${image.imageUrl.split("/").pop()}`,
      }));
    }
  } catch (error) {
    console.error("Error fetching product:", error);
  }
});

const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "/images/flower.webp";
  }
  return `${import.meta.env.VITE_API_URL}${imagePath}`;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--;
};

const increaseQuantity = () => {
  if (quantity.value < product.value.stock) quantity.value++;
};

const validateQuantity = () => {
  if (quantity.value < 1) {
    quantity.value = 1;
  } else if (quantity.value > product.value.stock) {
    quantity.value = product.value.stock;
  }
};

const addToCart = () => {
  const cartItem = cartStore.items.find(item => item.id === product.value.id);
  const totalQuantity = cartItem ? cartItem.Panier_Produits.quantity + quantity.value : quantity.value;

  if (totalQuantity <= product.value.stock) {
    cartStore.addToCart(product.value, quantity.value);
    toast.success(`${quantity.value} ${product.value.nom} a été ajouté au panier.`);
  } else {
    toast.error('La quantité totale demandée dépasse le stock disponible.');
  }
};
</script>

<style scoped>
.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
}

.product-image-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80%; /* Ajuster la hauteur selon vos besoins */
  overflow: hidden;
}

.product-image-wrapper img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

.quantity input {
  -moz-appearance: textfield;
  appearance: textfield;
}

.quantity input::-webkit-outer-spin-button,
.quantity input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.breadcrumbs a {
  color: #f56565;
  text-decoration: none;
}

.breadcrumbs span {
  color: #718096;
}
</style>
