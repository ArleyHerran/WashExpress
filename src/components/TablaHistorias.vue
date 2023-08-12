
<style scoped>
.v-icon.red--text {
  color: rgb(224, 86, 86);
}

.v-icon.green--text {
  color: rgb(97, 187, 97);
}
.conteA{
  padding: 10px;
}

.f {
  border: 1px solid rgb(122, 117, 117);
  margin: 0px;
  padding: 0px 8px;
  margin-left: 8px;
  border-radius: 10px;
  color: antiquewhite;
}
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);




}
.f:hover {
  border: 3px solid rgb(66, 32, 23);
}





.filter-container {
  max-width: 100%;
}

.date-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.filter-button {
  margin: auto;
  margin-bottom: 1rem;
  background-color: #3f51b5; /* You can adjust the color */
  color: white;
}
</style>

<template>
  <div class="conteA">
    <v-text-field
      v-model="search"
      label="Buscar por nombre o código"
      variant="outlined"
      append-inner-icon="mdi-magnify"
      density="compact"
      style="max-width: 550px; color:aqua;"
      
    />

   
  <div class="filter-container" >
   
   
      <v-col cols="12" md="6">
       
          <v-row>
            <v-col cols="12" sm="4">
              <span style="color: rgb(176, 176, 176);">Desde:</span>
              <input style="color: rgb(176, 176, 176);" type="date" class="filter-input" v-model="filtrof.fechai" />
            </v-col>
            <v-col cols="12" sm="4">
              <span style="color: rgb(176, 176, 176);">Hasta:</span>
              <input style="color: rgb(176, 176, 176);" type="date" class="filter-input" v-model="filtrof.fechaf" />
            </v-col>
            <v-col cols="12" md="4">
        <div class="d-flex align-center justify-center py-4">
    <v-btn
      prepend-icon="mdi-filter"
      small
      class="filter-button"
      @click="filtrara"
    >
      Filtrar
    </v-btn>
  </div>
      </v-col>
          </v-row>
       
      </v-col>
     
   
  </div>

    
    <!-- Agregar el diálogo/modal -->
    <formulario></formulario>
   
    <v-table dense  :sort-by="'Codigo'" :sort-desc="false" theme="dark" style="border: 1px solid #767575;">
      <thead>
        <tr>
          <th class="text-left">Placa</th>
          <th class="text-left">Propietario</th>
        
          <th class="text-left">Fecha</th>
       
          <th class="text-left">Acciones</th>
          <th class="text-left">Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in displayedItems" :key="index">
          <td>{{ item.placa }}</td>
          <td>{{ item.nombre }}</td>
          <td>{{ item.fecha }}</td>
          <td>
            <v-icon class="mr-2" color="green" @click="estados.opnenFormTurno({display:true,f:3,},item)"
              >mdi-eye</v-icon
            >
     
          </td>
          <td :style="{'color': estadoColor(item.estado)}">{{ estado(item.estado) }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination
      v-model="currentPage"
      :length="totalPages"
      :total-visible="5"
      :ellipsis="null"
      :boundary-links="false"
      @input="changePage"
      prev-icon="mdi-menu-left"
      next-icon="mdi-menu-right"
      style="border: 1px solid #767575; color: aqua;"
    />
  </div>
</template>

<script setup>

import { ref, computed, watch,  onMounted} from 'vue';
import { useAppStore } from "../store/app";
import Formulario from "@/components/FormTurno.vue";

//import { useRouter } from "vue-router";
const estados = useAppStore();

const currentPage = ref(1);
const itemsPerPage = ref(20);
const search = ref('');
const filtrof=ref({fechai:'',fechaf:''});

const desserts = ref(estados.historias);

onMounted(() => {
  // Llamar a la acción al cargar el componente
  estados.getTurnos();
  estados.getServicios();
});

const sortedItems = computed(() => {
  return filteredDesserts.value.sort((a, b) => {
    if (a.placa < b.placa) {
      return -1;
    }
    if (a.placa > b.placa) {
      return 1;
    }
    return 0;
  });
});


const filteredDesserts = computed(() => {
  currentPage.value = 1;
  const regex = new RegExp(search.value, "i");
  return desserts.value.filter(item => regex.test(item.nombre) || regex.test(item.placa));
});


const totalPages = computed(() => {
  return Math.ceil(totalItems.value / itemsPerPage.value);
});
const displayedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return sortedItems.value.slice(start, end);
});

const totalItems = computed(() => filteredDesserts.value.length);

function changePage(page) {
  currentPage.value = page;
}

function estado(v){
if(v==='delet')return'Eliminado';
if(v==='facturado')return'Facturado';
}

function estadoColor(v){
if(v==='delet')return'  Red';
if(v==='facturado')return'green';
}


function filtrara() {
  if (!esMismoMes(filtrof.value.fechai, filtrof.value.fechaf)) {
    alert("Solo puedes filtrar el contenido de un solo mes en especifico");
    return;
  }
  console.log(filtrof.value.fechai + "/" + filtrof.value.fechaf);
  if (filtrof.value.fechai > filtrof.value.fechaf) {
    alert(
      "Rango de fecha invalido: quizas la fecha final es inferior a la fecha inicial"
    );
    return;
  }
  estados.getHistorias(filtrof.value.fechai, filtrof.value.fechaf);
}


function esMismoMes(fecha1, fecha2) {
  const date1 = new Date(fecha1);
  const date2 = new Date(fecha2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}
watch(() => estados.historias, (newVal, oldVal) => {
  desserts.value = newVal;

});

filtrof.value.fechai = estados.hoy();
filtrof.value.fechaf = estados.hoy();
</script>


