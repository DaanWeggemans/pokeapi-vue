<script setup>
    import { ref, watch } from 'vue';
    import PokemonCard from './PokemonCard.vue';

    const props = defineProps({
        isOpen: Boolean,
        id: Number
    });

    const emit = defineEmits(['select-pokemon', 'close-evolution']);

    const pokemon = ref({ });

    watch(
        () => [props.id, props.isOpen],
        async ([new_id, new_is_open]) => {
            if (!new_id || !new_is_open) {
                pokemon.value = { };
                return;
            }

            const local_pokemons = JSON.parse(localStorage.getItem("pokemons") ?? "[]");
            const selected_pokemon_index = local_pokemons.findIndex(x => x.id == new_id);
            
            if (selected_pokemon_index < 0) {
                emit('close-evolution');
                return;
            }

            if (!local_pokemons[selected_pokemon_index].evolutions) {
                const evolutions = local_pokemons.find(x => x.evolutions?.flat().some(x => x.id == new_id))?.evolutions;

                const extension = { };
                if (evolutions && evolutions.length) {
                    extension.evolutions = evolutions;
                } else {
                    const response_species = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${new_id}`);
                    if (!response_species.ok) {
                        emit('close-evolution');
                        return;
                    }
                    
                    const data_species = await response_species.json();
                    const response_evolution = await fetch(data_species.evolution_chain.url);
                    if (!response_evolution.ok) {
                        emit('close-evolution');
                        return;
                    }

                    const data_evolution = await response_evolution.json();
                    extension.evolutions = extract_evolution(data_evolution.chain);
                }

                local_pokemons[selected_pokemon_index] = { ...local_pokemons[selected_pokemon_index], ...extension };
                localStorage.setItem("pokemons", JSON.stringify(local_pokemons));
            }

            pokemon.value = local_pokemons[selected_pokemon_index];
        },
        { immediate: true }
    );

    function extract_evolution(evolution) {
        if (!evolution || (Array.isArray(evolution) && !evolution.length))
            return [];

        const evolves_to = Array.isArray(evolution) ? evolution : [evolution];

        const evolves_to_item = evolves_to.map(x => {
            const parts = x.species.url.split('/').filter(x => x);
            const index = Number(parts[parts.length - 1]);
            
            return {
                id: index,
                name: x.species.name.replaceAll('-', ' '),
                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index}.png`
            };
        });
        
        const next_evolves_to = evolves_to.flatMap(node => node.evolves_to || []);
        return [evolves_to_item, ...extract_evolution(next_evolves_to)];
    }
</script>

<template>
    <div class="evolution" :class="isOpen ? '' : ' evolution-out-of-view'" role="dialog" aria-modal="true" :inert="!isOpen">
        <header class="mdc-top-app-bar">
            <div class="mdc-top-app-bar__row">
                <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
                    <button class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button"
                        aria-label="Close sheet" @click="emit('close-evolution')">close</button>
                    <span class="mdc-top-app-bar__title">Evolutions</span>
                </section>
            </div>
        </header>
        <main class="mdc-top-app-bar--fixed-adjust">
            <div v-if="pokemon.evolutions" class="evolution-chain">
                <template v-for="(chain, index) of pokemon.evolutions">
                    <div class="evolution-item">
                        <PokemonCard v-for="item of chain" :key="item.id"
                            :id="item.id"
                            :name="item.name"
                            :url="item.url"
                            :image="item.image"
                            @click="emit('select-pokemon', item)"
                        />
                    </div>
                    <p v-if="index != pokemon.evolutions.length - 1" class="next">></p>
                </template>
            </div>
        </main>
    </div>
</template>

<style scoped>
    .evolution {
        background-color: #2e2e2e;
        transition: 0.3s ease;
        min-height: 260px;
        max-height: 350px;
        position: fixed;
        margin-left: 0;
        width: 100%;
        bottom: 0;
        left: 0;
    }

    .evolution-out-of-view {
        margin-bottom: -100%;
    }

    .evolution-chain {
        min-height: calc(260px - 64px);
        max-height: calc(350px - 64px);
        justify-content: safe center;
        align-items: safe center;
        overflow: auto;
        padding: 1rem;
        display: flex;
        gap: 1rem;
    }

    .evolution-item {
        flex-direction: column;
        display: flex;
        gap: 1rem;
    }
</style>
