<script setup></script>

<template>
    <aside class="mdc-drawer mdc-drawer--modal">
        <div class="mdc-drawer__content">
            <img class="mdc-drawer-logo" src="/images/pokedex-logo.png" alt="Pokedex">
            <nav class="mdc-list">
                <RouterLink v-slot="{ href, isActive, navigate }" to="/" custom>
                    <a :href="href" @click.prevent="navigate" class="mdc-list-item" :class="isActive ? 'mdc-list-item--activated' : null" :aria-current="isActive ? 'page' : null">
                        <span class="mdc-list-item__ripple"></span>
                        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">catching_pokemon</i>
                        <span class="mdc-list-item__text">Pokemons</span>
                    </a>
                </RouterLink>
                <RouterLink v-slot="{ href, isActive, navigate }" to="/favorites" custom>
                    <a :href="href" @click.prevent="navigate" class="mdc-list-item" :class="isActive ? 'mdc-list-item--activated' : null" :aria-current="isActive ? 'page' : null">
                        <span class="mdc-list-item__ripple"></span>
                        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">favorite</i>
                        <span class="mdc-list-item__text">Favorites</span>
                    </a>
                </RouterLink>
            </nav>
        </div>
    </aside>

    <div class="mdc-drawer-scrim"></div>
</template>

<style scoped>
    .mdc-drawer {
        color: white;
    }

    .mdc-drawer-logo {
        width: 100%;
    }

    .mdc-list-item {
        padding: 1rem 1rem !important;
        display: flex;
        gap: 0.5rem;
    }
</style>