<template>
 
    

    <v-container style="height: 400px;">
      <v-row
        class="fill-height"
        align-content="center"
        justify="center"
      >
        <v-col
          class="text-subtitle-1 text-center"
          cols="12"
        >
          Cargando...
        </v-col>
        <v-col cols="6">
          <v-progress-linear
            color="deep-purple-accent-4"
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>
        </v-col>
      </v-row>
    </v-container>
 
</template>

<script setup>
import { ref, computed, watch,  onMounted} from 'vue';
import { useAppStore } from "../store/app";
//import { useRouter } from "vue-router";
const estados = useAppStore();
onMounted(() => {
  // Llamar a la acción al cargar el componente
  //estados.userLogin();
});
</script>