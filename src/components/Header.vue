<script setup>
    import { MDCTextField } from '@material/textfield';
    import { nextTick, ref } from 'vue';
    import { RouterLink, useRouter } from 'vue-router';

    const emit = defineEmits(['open-drawer']);

    const router = useRouter();

    const isSearchOpen = ref(false);

    let text_field;

    async function toggleSearch() {
        isSearchOpen.value = !isSearchOpen.value;
        if (!isSearchOpen.value) {
            text_field.value = "";
            text_field = null;
            return;
        }
        
        await nextTick();
        const text_field_element = document.querySelector('.mdc-text-field');
        text_field_element.focus();
        text_field = new MDCTextField(text_field_element);
    }

    function search(event) {
        if (event.key != "Enter") return;
        router.push(`/${text_field.value.toLowerCase()}`);
        toggleSearch();
    }
</script>

<template>
    <header class="mdc-top-app-bar">
        <div class="mdc-top-app-bar__row">
            <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
                <button class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button"
                    aria-label="Open navigation menu" @click="emit('open-drawer')">menu</button>
                <RouterLink to="/" class="mdc-top-app-bar__title">Pokedex</RouterLink>
            </section>
            <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
                <!-- <input v-if="isSearchOpen" type="text" v-model="searchBy" @keypress="search($event)"/> -->
                <label v-if="isSearchOpen" class="mdc-text-field mdc-text-field--outlined">
                    <span class="mdc-notched-outline">
                        <span class="mdc-notched-outline__leading"></span>
                        <span class="mdc-notched-outline__notch">
                        <span class="mdc-floating-label" id="my-label-id">Search By</span>
                        </span>
                        <span class="mdc-notched-outline__trailing"></span>
                    </span>
                    <input @keypress="search" type="text" class="mdc-text-field__input" aria-labelledby="my-label-id">
                </label>
                <button class="material-icons mdc-top-app-bar__action-item mdc-icon-button"
                    aria-label="Search" @click="toggleSearch">search</button>
            </section>
        </div>
    </header>
</template>

<style scoped>
    .mdc-top-app-bar__title,
    .mdc-floating-label--float-above,
    .mdc-text-field__input {
        color: white !important;
    }
</style>