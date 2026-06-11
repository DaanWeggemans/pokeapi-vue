<script setup>
    import { MDCTopAppBar } from '@material/top-app-bar';
    import { MDCDrawer } from '@material/drawer';
    import { RouterView } from 'vue-router';
    import { onMounted } from 'vue';
    import Header from './components/Header.vue';
    import Drawer from './components/Drawer.vue';

    let top_app_bar;
    let navigation_drawer;

    onMounted(() => {
        const top_app_bar_element = document.querySelector('.mdc-top-app-bar');
        top_app_bar = new MDCTopAppBar(top_app_bar_element);
        const navigation_drawer_element = document.querySelector('.mdc-drawer');
        navigation_drawer = MDCDrawer.attachTo(navigation_drawer_element);

        navigation_drawer_element.querySelector('.mdc-list').addEventListener('click', () => navigation_drawer.open = false);
    });

    const openDrawer = () => navigation_drawer.open = true;
</script>

<template>
    <Header @open-drawer="openDrawer" />
    <Drawer />
    <main class="mdc-top-app-bar--fixed-adjust">
        <RouterView />
    </main>
</template>