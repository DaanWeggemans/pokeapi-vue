<script setup>
    import { map_pokemons } from '@/common/mapping';
    import PokemonCard from '@/components/PokemonCard.vue';
    import { onMounted, onUnmounted, ref, watch } from 'vue';
    import { useRoute } from 'vue-router';

    const ITEMS_PER_PAGE = 36;

    const route = useRoute();

    const emit = defineEmits(["select-pokemon"]);

    let cached_pokemons = [];

    const pokemons = ref([]);
    const search_by = ref("");

    onMounted(async () => {
        const local_pokemons = JSON.parse(localStorage.getItem("pokemons") ?? "[]");

        if (local_pokemons.length) {
            cached_pokemons = local_pokemons;
            updateList(true);
        } else await getPokemons();

        window.addEventListener('scroll', handleScroll, { passive: true });
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
        if (!response.ok) return;
        const data = await response.json();

        cached_pokemons = map_pokemons(data);
        localStorage.setItem("pokemons", JSON.stringify(cached_pokemons));
        updateList(true);
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

    function handleClick(pokemon) {
        emit('select-pokemon', pokemon);
        sessionStorage.setItem("previous_location", "/");
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
                @click="handleClick(pokemon)"
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
        grid-template-columns: repeat(auto-fit, minmax(min(9rem, 100%), 1fr));
        max-width: 1200px;
        margin: 0 auto;
        padding: 10px;
        display: grid;
        gap: 5px;
    }
</style>