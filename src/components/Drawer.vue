<template>
    <v-navigation-drawer
      v-model="estados.drawer"
      temporary
      app
      hide-overlay
      no-scrollbar
      style="background: #292929; color: aliceblue"
    >
    <perfil></perfil>
    <progre></progre>
      <div class="no-scrollbar">
        <!-- contenido de drawer aquí -->
        <v-list-item
          style="background: #4e6374; color: aliceblue"
          class="pa-6"
        :prepend-avatar="estados.user.img"
          :title="estados.user.nombre"
        ><h5 style="cursor:pointer;" @click="estados.formPerfil=true;">Editar Perfil  <v-icon>mdi-pencil-box-outline</v-icon></h5> </v-list-item>
       
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
  import perfil from '@/components/EditarPerfil.vue'
  import progre from '@/components/Progres.vue'
  
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
if(!estados.datas){
 estados.getUserDataFirebase();
  //estados.prueba();
  estados.getTurnos();
  estados.getServicios();
  const fe=estados.hoy();
  estados.getHistorias(fe,fe);
  estados.getBalance();
  estados.datas=true;
}
   
  });
  </script>