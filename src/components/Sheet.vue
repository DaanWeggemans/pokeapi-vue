<script setup>
    import { ref, watch } from 'vue';

    const props = defineProps({
        isOpen: Boolean,
        id: Number
    });

    const emit = defineEmits(['close-sheet']);

    const pokemon = ref({ });

    watch(
        () => props.id,
        async (new_id) => {
            if (!new_id) {
                pokemon.value = { };
                return;
            }

            let local_pokemons = [];
            try {
                local_pokemons = JSON.parse(localStorage.getItem("pokemons") ?? "[]");
            } catch {
                localStorage.removeItem("pokemons");
            }

            let selected_pokemon_index = local_pokemons.findIndex(x => x.id == new_id);
            if (selected_pokemon_index < 0) {
                emit('close-sheet');
                return;
            }

            if (!local_pokemons[selected_pokemon_index].abilities) {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${local_pokemons[selected_pokemon_index].id}`);
                const data = await response.json();

                const extension = {
                    abilities: data.abilities.map(ability => {
                        return {
                            name: ability.ability.name.replace(/[- ].|^./g, letter => letter.replaceAll("-", " ").toUpperCase()),
                            isHidden: ability.is_hidden
                        };
                    }),
                    stats: data.stats.map(stat => {
                        return {
                            base: stat.base_stat,
                            name: stat.stat.name
                        };
                    }),
                    types: data.types.map(type => {
                        const index = Number(type.type.url.substring(type.type.url.indexOf("type")).split("/")[1]) || 1;
                        const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/brilliant-diamond-shining-pearl/${index}.png`;
                        return {
                            name: type.type.name,
                            img: img
                        };
                    })
                }

                local_pokemons[selected_pokemon_index] = { ...local_pokemons[selected_pokemon_index], ...extension };
                localStorage.setItem("pokemons", JSON.stringify(local_pokemons));
            }

            pokemon.value = local_pokemons[selected_pokemon_index];
        },
        { immediate: true }
    );
</script>

<template>
    <section class="sheet" :class="isOpen ? '' : ' sheet-out-of-view'">
        <header class="mdc-top-app-bar">
        <div class="mdc-top-app-bar__row">
            <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
                <button class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button"
                    aria-label="Open navigation menu" @click="emit('close-sheet')">close</button>
                <span class="mdc-top-app-bar__title">{{ pokemon.name }}</span>
            </section>
            <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
                <!-- <button class="material-icons mdc-top-app-bar__action-item mdc-icon-button"
                    aria-label="Search" @click="toggleSearch">search</button> -->
            </section>
        </div>
    </header>
        <main class="mdc-top-app-bar--fixed-adjust">

        </main>
    </section>
</template>

<style scoped>
    .sheet {
        background-color: #2e2e2e;
        transition: 0.3s ease;
        position: absolute;
        min-height: 100vh;
        margin-left: 0;
        width: 100%;
        top: 0;
    }

    .sheet-out-of-view {
        margin-left: -100%;
    }

    .sheet main {
        min-height: calc(100vh - 56px - 48px);
    }

    .sheet img {
        height: auto;
        width: 100%;
    }

    footer {
        background-color: var(--mdc-theme-primary);
        position: fixed;
        width: 100%;
        bottom: 0;
    }

    footer .mdc-tab__icon {
        color: white !important;
    }

    .mdc-top-app-bar__title {
        text-transform: capitalize;
    }
</style>