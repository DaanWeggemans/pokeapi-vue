<script setup>
    import { ref, watch } from 'vue';
    import EvolutionChain from './EvolutionChain.vue';

    const props = defineProps({
        isOpen: Boolean,
        id: Number
    });

    const emit = defineEmits(['select-pokemon', 'close-sheet']);

    const pokemon = ref({});
    const show_evolution_chain = ref(false);
    const favorite_hover = ref(false);

    watch(
        () => props.id,
        async (new_id) => {
            if (!new_id) {
                pokemon.value = { };
                return;
            }

            const local_pokemons = JSON.parse(localStorage.getItem("pokemons") ?? "[]");
            const selected_pokemon_index = local_pokemons.findIndex(x => x.id == new_id);
            
            if (selected_pokemon_index < 0) {
                emit('close-sheet');
                return;
            }

            if (!local_pokemons[selected_pokemon_index].abilities) {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${local_pokemons[selected_pokemon_index].id}`);
                if (!response.ok) {
                    emit('close-sheet');
                    return;
                }

                const data = await response.json();
                const extension = extract_extension(data);

                local_pokemons[selected_pokemon_index] = { ...local_pokemons[selected_pokemon_index], ...extension };
                localStorage.setItem("pokemons", JSON.stringify(local_pokemons));
            }

            pokemon.value = local_pokemons[selected_pokemon_index];

            favorite_hover.value = false;
            const favorited = JSON.parse(localStorage.getItem("favorited_pokemons") ?? "[]");
            if (favorited.some(x => x == pokemon.value.id))
                favorite_hover.value = true;

            show_evolution_chain.value = false;
        },
        { immediate: true }
    );

    const get_stat = (stat) => Object.values(pokemon.value.stats)?.find(x => x.name == stat)?.base ?? "N/A";
    const image_fallback = (event) => event.target.src = '/images/pokeball-placeholder.png';
    const toggle_evolutions = () => show_evolution_chain.value = !show_evolution_chain.value;
    const toggle_favorite_hover = () => favorite_hover.value = !favorite_hover.value;

    function extract_extension(data) {
        return {
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
        };
    }

    function toggle_favorite() {
        let favorited = JSON.parse(localStorage.getItem("favorited_pokemons") ?? "[]");
        const selected_pokemon_index = favorited.findIndex(x => x == pokemon.value.id);

        if (selected_pokemon_index < 0) {
            favorited.push(pokemon.value.id);
        } else {
            favorited.splice(selected_pokemon_index, 1);
        }

        favorite_hover.value = !favorite_hover.value;
        localStorage.setItem("favorited_pokemons", JSON.stringify(favorited));
    }
</script>

<template>
    <section class="sheet" :class="isOpen ? '' : ' sheet-out-of-view'">
        <header class="mdc-top-app-bar">
            <div class="mdc-top-app-bar__row">
                <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
                    <button class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button"
                        aria-label="Close sheet" @click="emit('close-sheet')">close</button>
                    <span class="mdc-top-app-bar__title">{{ pokemon.name }}</span>
                </section>
                <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
                    <button class="material-icons mdc-top-app-bar__action-item mdc-icon-button"
                        aria-label="Favorite" @click="toggle_favorite" @mouseenter="toggle_favorite_hover" @mouseleave="toggle_favorite_hover">{{ favorite_hover ? 'favorite' : 'favorite_border' }}</button>
                </section>
            </div>
        </header>
        <main class="mdc-top-app-bar--fixed-adjust">
            <div class="container" v-if="Boolean(pokemon.id)">
                <div class="pokemon">
                    <div class="details">
                        <section>
                            <div class="image">
                                <img @error="image_fallback" :src="pokemon.image" :alt="pokemon.name">
                            </div>
                        </section>
                        <section>
                            <h2 class="pokemon-name">{{ pokemon.name }}</h2>
                            <div class="types">
                                <img v-for="item of pokemon.types" :src="item.img" :alt="item.name"
                                    :title="item.name.replace(/^./g, (letter) => letter.toUpperCase())">
                            </div>
                            <h2>Abilities</h2>
                            <div class="abilities">
                                <div v-for="item of pokemon.abilities" class="ability" :title="`${item.name}${item.isHidden ? ' (hidden)' : ''}`">
                                    <p>{{ item.name }}</p>
                                    <img v-if="item.isHidden" src="/svg/hidden.svg?v=1" alt="is-hidden">
                                </div>
                            </div>
                            <h2>Stats</h2>
                            <div class="stats">
                                <div class="stat" id="hp" title="Health Points">
                                    <p class="value">{{ get_stat("hp") }}</p>
                                    <p>HP</p>
                                </div>
                                <div class="stat" id="attack" title="Attack">
                                    <p class="value">{{ get_stat("attack") }}</p>
                                    <p>ATK</p>
                                </div>
                                <div class="stat" id="defense" title="Defense">
                                    <p class="value">{{ get_stat("defense") }}</p>
                                    <p>DEF</p>
                                </div>
                                <div class="stat" id="special-attack" title="Special Attack">
                                    <p class="value">{{ get_stat("special-attack") }}</p>
                                    <p>SP-ATK</p>
                                </div>
                                <div class="stat" id="special-defense" title="Special Defense">
                                    <p class="value">{{ get_stat("special-defense") }}</p>
                                    <p>SP-DEF</p>
                                </div>
                                <div class="stat" id="speed" title="Speed">
                                    <p class="value">{{ get_stat("speed") }}</p>
                                    <p>SPD</p>
                                </div>
                            </div>
                        </section>
                    </div>
                    <button id="toggle-evolution" @click="toggle_evolutions" class="mdc-button mdc-button--raised">
                        <span class="mdc-button__label">See Evolutions</span>
                    </button>
                </div>

                <EvolutionChain
                    :isOpen="show_evolution_chain"
                    :id="id"
                    @select-pokemon="(pokemon) => emit('select-pokemon', pokemon)"
                    @close-evolution="toggle_evolutions"
                />
            </div>
        </main>
    </section>
</template>

<style scoped>
    .sheet {
        background-color: color-mix(in hsl, var(--mdc-theme-primary), hsl(0, 0%, 20%));
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
        padding-bottom: 2rem;
    }

    .mdc-top-app-bar__title {
        text-transform: capitalize;
    }

    .container {
        font-family: Roboto, sans-serif;
        overflow: hidden;
        color: white;
        padding: 20px;
    }

    .details {
        margin-bottom: 1rem;
        display: flex;
        width: 100%;
        gap: 1rem;

        section:last-child {
            flex: 1;
        }
    }

    .image {
        background-image: radial-gradient(closest-side, color-mix(in hsl, var(--mdc-theme-primary), hsl(0, 0%, 0%, 50%)), transparent);
        border-radius: 0.4rem;
        position: relative;
        height: 20rem;
    }

    .image img {
        image-rendering: pixelated;
        aspect-ratio: 1 / 1;
        height: 100%;
    }

    .pokemon-name {
        text-transform: capitalize;
        margin-bottom: 1rem;
        font-size: 2rem;
    }

    .types {
        margin-bottom: 2rem;
        display: flex;
        gap: 0.4rem;

        img {
            height: 1.5rem;
        }
    }

    h2 {
        font-weight: lighter;
        margin-bottom: 1rem;
    }

    .abilities {
        background-color: color-mix(in hsl, var(--mdc-theme-primary), hsl(0, 0%, 18%));
        grid-template-columns: repeat(auto-fit, minmax(min(8rem, 100%), 1fr));
        border-radius: 0.4rem;
        margin-bottom: 2rem;
        width: fit-content;
        padding: 0.5rem;
        display: grid;
        gap: 0.4rem;
        width: 100%;

        .ability {
            background-color: var(--mdc-theme-primary);
            border-radius: 0.4rem;
            align-items: center;
            padding: 0.5rem;
            display: flex;
            gap: 0.4rem;

            img {
                height: 1rem;
            }
        }
    }

    .stats {
        background-color: color-mix(in hsl, var(--mdc-theme-primary), hsl(0, 0%, 18%));
        grid-template-columns: repeat(auto-fit, minmax(min(5rem, 100%), 1fr));
        border-radius: 0.4rem;
        padding: 0.5rem;
        display: grid;
        gap: 0.4rem;
        width: 100%;

        .stat {
            border-radius: 0.4rem;
            text-align: center;
            padding: 0.5rem;
            color: black;

            .value {
                font-size: 1.5rem;
                margin-bottom: 0.6rem;
            }

            p:not(.value) {
                font-size: 0.8rem;
            }

            &#hp {
                background-color: hsl(0, 100%, 80%);
            }

            &#attack {
                background-color: hsl(30, 100%, 80%);
            }

            &#defense {
                background-color: hsl(60, 100%, 80%);
            }

            &#special-attack {
                background-color: hsl(210, 100%, 80%);
            }

            &#special-defense {
                background-color: hsl(120, 80%, 80%);
            }

            &#speed {
                background-color: hsl(350, 100%, 90%);
            }
        }
    }

    #toggle-evolution {
        width: 100%;
    }

    @media screen and (max-width: 880px) {
        .details {
            flex-direction: column;
            overflow: hidden;
        }

        .image {
            justify-content: center;
            display: flex;
        }
    }
</style>