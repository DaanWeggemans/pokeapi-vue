import FavoritesView from '@/views/FavoritesView.vue'
import HomeView from '@/views/HomeView.vue'
import PokemonView from '@/views/PokemonView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: HomeView
    },
    {
      path: "/:searchBy",
      component: HomeView
    },
    {
      path: "/favorites",
      component: FavoritesView
    },
    {
      path: "/pokemon/:id",
      component: PokemonView
    }
  ],
})

export default router
