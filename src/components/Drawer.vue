<template>
    <v-navigation-drawer
      v-model="estados.drawer"
      temporary
      app
      hide-overlay
      no-scrollbar
      style="background: #292929; color: aliceblue"
    >
      <div class="no-scrollbar">
        <!-- contenido de drawer aquí -->
        <v-list-item
          style="background: #4e6374; color: aliceblue"
          class="pa-6"
        prepend-avatar="data:image/png;base64,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"
          title="Lavado 1A"
        ></v-list-item>
        <v-divider></v-divider>
        <v-list density="compact" nav class="menu-list">
          <v-list-item
            v-for="item in menuItems"
            :key="item.value"
            :v-bind:color="item.color_ico"
            :title="item.title"
            :value="item.value"
            @click="navigateTo(item)"
            v-bind:class="{ active: item.active }"
            style="display: flex"
          >
            <template v-slot:prepend>
              <v-icon
                :class="{
                  'custom-icon': true,
                  'custom-icon-active': item.active,
                }"
                :style="{ color: item.color_ico }"
              >
                {{ item.icon }}
              </v-icon>
            </template>
          </v-list-item>
        </v-list>
      </div>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="estados.cerrarSesion()" color="primary">
            Cerrar sesion
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </template>
  
  <script setup>
  import { useAppStore } from "../store/app";
  import { useRouter } from "vue-router";
  import { onMounted } from "vue";
  //import config from '@/components/Config.vue'
  
  const estados = useAppStore();
  const router = useRouter();
  
  const menuItems = [
    {
      color_ico: "#79b5ff",
      icon: "mdi-view-dashboard",
      title: "Dasboard",
      value: "Dasboard",
      active: true,
    },
    {
      color_ico: "#4dcb6a",
      icon: "mdi-timer-outline",
      title: "Turnos",
      value: "Turnos",
      active: false,
    },
    {
      color_ico: "#ffae00",
      icon: "mdi-history",
      title: "Historias",
      value: "Historia",
      active: false,
    },
   /* {
      color_ico: "#b17dff",
      icon: "mdi-cash-minus",
      title: "Salidas",
      value: "Gastos",
      active: false,
    },
    {
      color_ico: "#eb5858",
      icon: "mdi-shopping",
      title: "Productos",
      value: "Productos",
      active: false,
    },*/
  ];
  
  function navigateTo(item) {
    menuItems.forEach((i) => (i.active = false)); // establece active en false para todos los elementos
    item.active = true; // establece active en true para el elemento seleccionado
    router.push({ name: item.value });
  }
  
  onMounted(async () => {
   // await estados.userobserver();
  });
  </script>