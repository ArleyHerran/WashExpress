<template>
  <div>
    <h2 class="headline">Hoy</h2>

    <v-container fluid>
      <v-row dense>
      <v-col v-for="(tarjeta, index) in tarjetas" :key="index" cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2">
        <v-card :class="tarjeta.clase" outlined>
          <v-card-title>{{ tarjeta.titulo }}</v-card-title>
          <v-card-text>
            <!-- Mostrar el valor correspondiente al estado en cada tarjeta -->
            <h1>{{ obtenerValorEstado(tarjeta.clase) }}</h1>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    </v-container>
    
  </div>
</template>

<script setup>
import { ref, computed, watch,  onMounted} from 'vue';
import { useAppStore } from "../store/app";
const estados = useAppStore();

const tarjetas = [
  { titulo: "Balance General", clase: "balance" },
  { titulo: "Turnos Pendientes", clase: "pendientes" },
  { titulo: "Cancelados", clase: "cancelados" },
];

// Función para obtener el valor específico del estado según la clase de la tarjeta
const obtenerValorEstado = (clase) => {
  if (clase === "balance") {
    const valor = estados.dasboard.balance;
  
  // Formatear el valor como moneda colombiana (COP)
  const formatoMoneda = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP"
  });
  
  return formatoMoneda.format(valor)
  } else if (clase === "pendientes") {
    return estados.dasboard.turnosP; // Reemplaza 'pendientes' con la propiedad adecuada
  } else if (clase === "cancelados") {
    return estados.dasboard.cancelados; // Reemplaza 'cancelados' con la propiedad adecuada
  }
  return 0; // Valor por defecto si la clase no coincide con ninguna de las opciones
};

onMounted(() => {
  // Llamar a la acción al cargar el componente
 
 
});
</script>
  
  <style>
  .pendientes {
    background-color: #FFCC80; /* Color para turnos pendientes */
    color: #333;
  }
  
  .cancelados {
    background-color: #EF9A9A; /* Color para cancelados */
    color: #333;
  }
  
  .balance {
    background-color: #81C784; /* Color para balance */
    color: #333;
  }
  
  .headline {
    font-size: 24px;
    margin-bottom: 20px;
    color: rgb(187, 189, 190);
  }
  </style>