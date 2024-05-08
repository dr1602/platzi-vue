<script setup lang="ts">
import Form from './components/';
</script>

<template>
  <h2>Movies</h2>
  <Form msg="Vite + Vue" />
</template>

<style>
@import "./styles/_variables.scss";

html,
body {
  background: $bg;
  color: $color;
  margin: 0;
  font-family: sans-serif;
}

h2 {
}
</style>