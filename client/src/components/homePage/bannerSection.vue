<template>
  <div class="container mx-auto py-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div v-for="(promotion, index) in promotions" :key="index" class="relative">
        <img :src="promotion.image" :alt="promotion.alt" class="w-full h-auto z-20" />
        <div class="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-opacity-20 text-white text-center">
          <h3 class="text-red-600 text-xl font-semibold mb-2 text-[30px] font-['Yesteryear']">{{ promotion.title }}</h3>
          <h2 class="text-2xl font-semibold text-black text-[30px]">{{ promotion.subtitle }}</h2>
          <a href="#" class="mt-4 text-black px-4 underline text-[14px] font-semibold leading-7">Achetez maintenant</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import slide1 from '../../assets/homePage/img1-top-floda1.jpg';
import slide2 from '../../assets/homePage/img1-top-floda2.jpg';
import slide3 from '../../assets/homePage/img1-top-floda3.jpg';

const promotions = ref([
  {
    image: slide1,
    title: 'Vendredi Top',
    subtitle: 'Or Jaune',
    alt: 'Or Jaune'
  },
  {
    image: slide2,
    title: 'Vendredi Noir',
    subtitle: 'Orchidée Bâton',
    alt: 'Orchidée Bâton'
  },
  {
    image: slide3,
    title: '10% de réduction',
    subtitle: 'Fleur de Tulipe',
    alt: 'Fleur de Tulipe'
  }
]);
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
