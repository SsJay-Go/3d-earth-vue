<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'

import TheExperience from './components/TheExperience.vue'
import Earth from './components/Earth.vue';
</script>

<template>
  <!-- clear-color="#82DBC5"  -->
  <TresCanvas
    window-size
    antialias
    alpha
  >
    <!-- <TheExperience /> -->
    <Earth />
  </TresCanvas>
</template>