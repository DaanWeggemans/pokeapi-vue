<script setup>
    import PokemonCard from '@/components/PokemonCard.vue';
    import { onMounted, onUnmounted, ref, watch } from 'vue';
    import { useRoute } from 'vue-router';

    const ITEMS_PER_PAGE = 24;
    const POKEMONS_KEY = "pokemons";

    const route = useRoute();

    let cached_pokemons = [];

    const pokemons = ref([]);
    const search_by = ref("");

    onMounted(async () => {
        const local_pokemons = JSON.parse(localStorage.getItem(POKEMONS_KEY) ?? "[]");

        if (local_pokemons.length) {
            cached_pokemons = local_pokemons;
            updateList();
        } else await getPokemons();

        window.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => window.removeEventListener('scroll', handleScroll));

    watch(
        () => route.params.searchBy,
        (new_search_by) => {
            window.scroll({ top: 0 });
            search_by.value = (new_search_by ?? "").toLowerCase();
            updateList(true);
        },
        { immediate: true }
    );

    async function getPokemons() {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1500");
        const data = await response.json();

        cached_pokemons = data.results.map(pokemon => {
            const parts = pokemon.url.split('/').filter(x => x);
            const index = Number(parts[parts.length - 1]);

            return {
                id: index,
                name: pokemon.name.replaceAll('-', ' '),
                url: pokemon.url,
                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index}.png`
            };
        });

        localStorage.setItem(POKEMONS_KEY, JSON.stringify(cached_pokemons));
        updateList();
    }

    function updateList(reset_length = false) {
        const filtered_pokemons = cached_pokemons.filter(x => x.name.toLowerCase().includes(search_by.value));

        const length = reset_length ? 0 : pokemons.value.length;
        const target_length = length + ITEMS_PER_PAGE;

        pokemons.value = filtered_pokemons.slice(0, target_length);
    }

    function handleScroll() {
        const distance_to_bottom = document.body.offsetHeight - (window.scrollY + window.innerHeight);
        if (distance_to_bottom > 50) return;
        updateList();
    }
</script>

<template>
    <div class="pokemons-container">
        <div class="pokemons">
            <PokemonCard v-for="pokemon in pokemons" :key="pokemon.id"
                :id="pokemon.id"
                :name="pokemon.name"
                :url="pokemon.url"
                :image="pokemon.image"
            />
        </div>
    </div>
</template>

<style scoped>
    .pokemons-container {
        background-color: color-mix(in hsl, var(--mdc-theme-primary), hsl(0, 0%, 20%));
        min-height: calc(100vh - 64px);
    }
    
    .pokemons {
        grid-template-columns: repeat(auto-fit, minmax(min(12rem, 100%), 1fr));
        max-width: 1200px;
        margin: 0 auto;
        padding: 10px;
        display: grid;
        gap: 5px;
    }
</style>