<template>
    <DisplayTasks :tasks="tasks" />
</template>

<script setup lang="ts">
import DisplayTasks from '@/components/shared/DisplayTasks.vue';
import { useAppStore } from '@/stores/appStore';
import { computed } from 'vue';

const store = useAppStore();
const tasks = computed(() => store.getUpcomingTasks());
</script>

<style scoped></style>
