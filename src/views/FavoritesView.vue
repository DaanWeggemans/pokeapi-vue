<script setup>
    import PokemonCard from '@/components/PokemonCard.vue';
    import { onMounted, ref } from 'vue';

    const emit = defineEmits(["select-pokemon"]);

    const pokemons = ref([]);

    onMounted(() => {
        const local_pokemons = JSON.parse(localStorage.getItem("pokemons") ?? "[]");
        const favorited_pokemons = JSON.parse(localStorage.getItem("favorited_pokemons") ?? "[]");

        pokemons.value = local_pokemons.filter(x => favorited_pokemons.includes(x.id));
    });
</script>

<template>
    <div class="pokemons-container">
        <div class="pokemons">
            <template v-if="pokemons.length">
                <PokemonCard v-for="pokemon in pokemons" :key="pokemon.id"
                    :id="pokemon.id"
                    :name="pokemon.name"
                    :url="pokemon.url"
                    :image="pokemon.image"
                    @click="emit('select-pokemon', pokemon)"
                />
            </template>
            <p class="empty" v-else>You dont have any favorite pokemons.</p>
        </div>
    </div>
</template>

<style scoped>
    .pokemons-container {
        background-color: color-mix(in hsl, var(--mdc-theme-primary), hsl(0, 0%, 20%));
        min-height: calc(100vh - 64px);
    }
    
    .pokemons {
        grid-template-columns: repeat(auto-fit, minmax(min(9rem, 100%), 1fr));
        max-width: 1200px;
        margin: 0 auto;
        padding: 10px;
        display: grid;
        gap: 5px;
    }

    .empty {
        font-family: Roboto, sans-serif;
        text-align: center;
        color: white;
        margin: 20px;
    }
</style>