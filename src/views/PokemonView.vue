<script setup>
    import PokemonCard from '@/components/PokemonCard.vue';
import { onMounted, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

    const route = useRoute();
    const router = useRouter();

    let pokemon = ref({ });

    onMounted(() => {
        const id = route.params.id;

        const local_pokemons = JSON.parse(localStorage.getItem("pokemons") ?? "[]");
        pokemon.value = local_pokemons.find(x => x.id == id);
        if (!pokemon) router.push("/");
    });
</script>

<template>
    <PokemonCard
        :id="pokemon.id"
        :name="pokemon.name"
        :url="pokemon.url"
        :image="pokemon.image"
    />
</template>