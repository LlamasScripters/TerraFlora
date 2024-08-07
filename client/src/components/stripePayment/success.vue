<template>
  <div class="w-1/2 mx-auto p-6">
    <div class="bg-white shadow-lg rounded-lg p-8">
      <h1 class="text-3xl font-extrabold mb-6 text-gray-900">
        Paiement Réussi,<br> Veuillez ne pas fermer ou recharger cette page tant que la facture n'est pas visible !
      </h1>
      <p class="mb-6 text-lg text-gray-700">
        Merci pour votre confiance chez TerraFlora !
      </p>

      <div class="border-t border-gray-200 pt-6">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">
          Résumé de la commande :
        </h2>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li
            v-for="item in cartItems"
            :key="item.id"
            class="flex justify-between"
          >
            <span>{{ item.quantity }} x {{ item.name }}</span>
            <span>{{ item.amount_total / 100 }} €</span>
          </li>
        </ul>
        <p class="font-semibold text-lg text-gray-800 mt-4">
          Total : {{ cartTotal }} €
        </p>
      </div>

      <div v-if="customerDetails" class="border-t border-gray-200 pt-6 mt-6">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">
          Détails du client :
        </h2>
        <div class="space-y-2 text-gray-700">
          <p>
            <strong class="font-semibold">Nom :</strong>
            {{ customerDetails.name }}
          </p>
          <p>
            <strong class="font-semibold">Email :</strong>
            {{ customerDetails.email }}
          </p>
          <p>
            <strong class="font-semibold">Téléphone :</strong>
            {{ customerDetails.phone }}
          </p>
          <p>
            <strong class="font-semibold">Adresse : </strong>
            <span> {{ customerDetails.address.line1 }}, </span>
            <span> {{ customerDetails.address.line2 }}, </span>
            <span> {{ customerDetails.address.city }}, </span>
            <span> {{ customerDetails.address.postal_code }}, </span>
            <span> {{ customerDetails.address.country }}</span>
          </p>
        </div>
      </div>

      <div v-if="shippingDetails" class="border-t border-gray-200 pt-6 mt-6">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">
          Détails de la livraison :
        </h2>
        <div class="space-y-2 text-gray-700">
          <p>
            <strong class="font-semibold">Nom :</strong>
            {{ shippingDetails.name }}
          </p>
          <p>
            <strong class="font-semibold">Adresse : </strong>
            <span> {{ shippingDetails.address.line1 }}, </span>
            <span> {{ shippingDetails.address.line2 }}, </span>
            <span> {{ shippingDetails.address.city }}, </span>
            <span> {{ shippingDetails.address.postal_code }}, </span>
            <span> {{ shippingDetails.address.country }}</span>
          </p>
        </div>
      </div>

      <div v-if="invoiceUrl" class="border-t border-gray-200 pt-6 mt-6">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">Facture :</h2>
        <a
          :href="invoiceUrl"
          target="_blank"
          class="text-blue-600 hover:underline"
        >
          Télécharger la facture
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { ref, onMounted, onUnmounted } from "vue";
import instance from "../../axios.js";
import { useAuthStore } from "../../pinia/auth.js";
import { useCartStore } from "../../pinia/cart.js";

export default {
  name: "SuccessPage",
  setup() {
    const route = useRoute();
    const cartItems = ref([]);
    const cartTotal = ref(0);
    const customerDetails = ref(null);
    const shippingDetails = ref(null);
    const invoiceUrl = ref(null);
    const cartStore = useCartStore();
    let pollingInterval = null;

    const fetchSessionDetails = async (sessionId) => {
      try {
        const sessionResponse = await instance.get(
          import.meta.env.VITE_API_URL + `stripe/session/${sessionId}`
        );
        const session = sessionResponse.data;

        const lineItemsResponse = await instance.get(
          import.meta.env.VITE_API_URL + `stripe/session/${sessionId}/items`
        );
        const lineItems = lineItemsResponse.data;
        cartItems.value = lineItems.map((item) => ({
          id: item.id,
          name: item.description,
          quantity: item.quantity,
          amount_total: item.amount_total,
        }));
        cartTotal.value = (session.amount_total / 100).toFixed(2);

        const productArray = [];
        for (let i = 0; i < cartItems.value.length; i++) {
          productArray.push({
            id: cartItems.value[i].id,
            nom: cartItems.value[i].name,
            quantite: cartItems.value[i].quantity,
            prix: (
              cartItems.value[i].amount_total /
              100 /
              cartItems.value[i].quantity
            )
              .toFixed(2)
              .toString(),
          });
        }

        customerDetails.value = session.customer_details;
        shippingDetails.value = session.shipping_details;

        const checkInvoice = async () => {
          const sessionCheckResponse = await instance.get(
            import.meta.env.VITE_API_URL + `stripe/session/${sessionId}`
          );
          const updatedSession = sessionCheckResponse.data;
          if (updatedSession.invoice) {
            clearInterval(pollingInterval);

            const responseGetInvoice = await instance.get(
              import.meta.env.VITE_API_URL + `stripe/invoice/${updatedSession.invoice}`
            );
            invoiceUrl.value = responseGetInvoice.data.hosted_invoice_url;

            const authStore = useAuthStore();
            const responseCreateOrder = await instance.post("/orders", {
              userId: authStore.id,
              total: cartTotal.value,
              productArray: productArray,
              invoiceUrl: invoiceUrl.value,
            });

            await cartStore.subtractStock();
            await cartStore.clearCart();

            if (responseCreateOrder.status === 200) {
              console.log("Order created successfully");
            }
          }
        };

        pollingInterval = setInterval(checkInvoice, 5000);

      } catch (error) {
        console.error("Error fetching session details:", error);
      }
    };

    onMounted(() => {
      const sessionId = route.query.session_id;
      if (sessionId) {
        fetchSessionDetails(sessionId);
      }
    });

    onUnmounted(() => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    });

    return {
      cartItems,
      cartTotal,
      customerDetails,
      shippingDetails,
      invoiceUrl,
    };
  },
};
</script>
