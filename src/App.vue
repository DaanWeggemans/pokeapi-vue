<script setup>
    import { MDCTopAppBar } from '@material/top-app-bar';
    import { MDCDrawer } from '@material/drawer';
    import { RouterView } from 'vue-router';
    import { nextTick, onMounted, ref, watch } from 'vue';
    import Header from './components/Header.vue';
    import Drawer from './components/Drawer.vue';
    import Sheet from './components/Sheet.vue';
    
    const selected_pokemon = ref({ });
    const saved_scroll_y = ref(0);

    let top_app_bar;
    let navigation_drawer;

    onMounted(() => {
        const top_app_bar_element = document.querySelector('.mdc-top-app-bar');
        top_app_bar = new MDCTopAppBar(top_app_bar_element);
        const navigation_drawer_element = document.querySelector('.mdc-drawer');
        navigation_drawer = MDCDrawer.attachTo(navigation_drawer_element);

        navigation_drawer_element.querySelector('.mdc-list').addEventListener('click', () => navigation_drawer.open = false);
    });

    watch(selected_pokemon, async (newVal) => {
        if (newVal?.id) {
            saved_scroll_y.value = window.scrollY;
        } else {
            await nextTick();
            window.scrollTo(0, saved_scroll_y.value);
        }
    });

    const openDrawer = () => navigation_drawer.open = true;
    const selectPokemon = (pokemon) => selected_pokemon.value = pokemon;
    const closeSheet = () => selected_pokemon.value = { };
</script>

<template>
    <Header
        @open-drawer="openDrawer"
    />
    <Drawer />
    <main class="mdc-top-app-bar--fixed-adjust">
        <RouterView v-slot="{ Component }">
            <component
                :is="Component"
                :style="{ display: selected_pokemon?.id && 'none' }"
                @select-pokemon="selectPokemon"
            />
        </RouterView>
    </main>
    <Sheet
        :isOpen="Boolean(selected_pokemon.id)"
        :id="selected_pokemon.id ?? 0"
        @select-pokemon="selectPokemon"
        @close-sheet="closeSheet"
    />
</template>

<style scoped>
    .mdc-top-app-bar--fixed-adjust {
        background-color: color-mix(in hsl, var(--mdc-theme-primary), hsl(0, 0%, 20%));
        min-height: 100vh;
    }
</style>