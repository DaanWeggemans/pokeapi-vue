<script setup>
    import PokemonCard from '@/components/PokemonCard.vue';
    import { onMounted, onUnmounted, ref, watchEffect } from 'vue';
    import { useRoute } from 'vue-router';

    const route = useRoute();

    const laptop_row_amount = 4;
    const laptop_column_amount = 6;
    const scroll_modifier = 4;

    const pokemons = ref([]);
    const searchBy = ref("");

    onMounted(() => {
        const local_pokemons = JSON.parse(localStorage.getItem("pokemons") ?? "[]");

        if (local_pokemons.length) {
            pokemons.value = mapPokemons(local_pokemons.slice(0, pokemons.value.length + laptop_row_amount * laptop_column_amount));
        } else {
            fetch('https://pokeapi.co/api/v2/pokemon?limit=99999999')
                .then(result => result.json())
                .then(result => {
                    const fetched_pokemons = result.results.map(pokemon => {
                        const index_string = pokemon.url.substring(pokemon.url.indexOf("pokemon") + 8).replaceAll("/", "");
                        const index = Number(index_string);

                        return {
                            id: index,
                            name: pokemon.name.replaceAll('-', ' '),
                            url: pokemon.url,
                            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index}.png`
                        };
                    });

                    localStorage.setItem("pokemons", JSON.stringify(fetched_pokemons));
                    pokemons.value = mapPokemons(fetched_pokemons.pokemons.slice(0, pokemons.value.length + laptop_row_amount * laptop_column_amount));
                });
        }

        window.addEventListener('scroll', loadNewPokemons);
    });

    onUnmounted(() => window.removeEventListener('scroll', loadNewPokemons));

    watchEffect(() => {
        searchBy.value = route.params.searchBy ?? "";
        const local_pokemons = JSON.parse(localStorage.getItem("pokemons") ?? "[]");
        pokemons.value = mapPokemons(local_pokemons).slice(0, pokemons.value.length + laptop_row_amount * laptop_column_amount);
    });

    function mapPokemons(pokemons) {
        return pokemons.filter(x => x.name.toLowerCase().includes(searchBy.value.toLowerCase()));
    }

    function loadNewPokemons() {
        const distanceToBottom = document.body.offsetHeight - (window.scrollY + window.innerHeight);
        if (distanceToBottom > 50) return;

        const local_pokemons = JSON.parse(localStorage.getItem("pokemons") ?? "[]");
        pokemons.value = mapPokemons(local_pokemons.slice(0, pokemons.value.length + laptop_row_amount * laptop_column_amount * scroll_modifier));
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