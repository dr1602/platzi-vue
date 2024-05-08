<script setup lang="ts">
import { ref } from 'vue';

const movies = ref([
  {
    name: "Revengers",
    maxTickets: 12,
    defaultQuantity: 0,
  },
  {
    name: "Spuder Moon",
    maxTickets: 10,
    defaultQuantity: 0,
  },
  {
    name: "Baturu Man",
    maxTickets: 8,
    defaultQuantity: 0,
  },
  {
    name: "Journey Rabbit",
    maxTickets: 2,
    defaultQuantity: 0,
  },
  {
    name: "Blue Penter",
    maxTickets: 3,
    defaultQuantity: 0,
  },
  {
    name: "River Gens, Mid Game",
    maxTickets: 5,
    defaultQuantity: 0,
  },
]);
</script>

<template>
  <form v-for="movie in movies">
    <h3>{{ movie.name }}</h3>

    <button
      type="button"
      v-on:click="movie.defaultQuantity -= 1"
      :disabled="movie.defaultQuantity <= 0"
    >
      -
    </button>

    {{ movie.defaultQuantity }}

    <button
      type="button"
      v-on:click="movie.defaultQuantity += 1"
      :disabled="movie.defaultQuantity >= movie.maxTickets"
    >
      +
    </button>
  </form>
</template>

<!-- Styles with scope only for this component -->
<style scoped></style>
