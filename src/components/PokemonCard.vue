<script setup>
    import { RouterLink } from 'vue-router';

    defineProps({
        id: Number,
        name: String,
        url: String,
        image: String
    });

    const image_fallback = (event) => event.target.src = '/images/pokeball-placeholder.png';
</script>

<template>
    <RouterLink :to="`/pokemon/${id}`" class="pokemon">
        <img @error="image_fallback($event)" :src="image" :alt="name">
        <p>{{ name }}</p>
    </RouterLink>
</template>

<style scoped>
    .pokemon {
        border: 1px solid color-mix(in hsl, var(--mdc-theme-primary), hsl(0, 0%, 30%));
        background-color: color-mix(in hsl, var(--mdc-theme-primary), hsl(0, 0%, 18%));
        flex-direction: column;
        text-decoration: none;
        align-items: center;
        cursor: pointer;
        display: flex;
        padding: 1rem;
        width: 100%;
    }

    img {
        margin: 0 1rem 1rem;
    }

    p {
        font-family: Roboto, sans-serif;
        text-transform: capitalize;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        overflow: hidden;
        color: white;
        width: 8rem;
    }
</style>