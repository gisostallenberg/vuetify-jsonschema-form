<template>
  <v-form
    ref="form"
    v-model="valid"
  >
    <slot
      :model-wrapper="props.modelWrapper"
      :options="props.options"
      :schema="props.schema"
      :log-event="props.logEvent"
    />
  </v-form>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'

const props = defineProps([
  'modelWrapper',
  'schema',
  'options',
  'logEvent'
])

const valid = ref(false)
</script>
