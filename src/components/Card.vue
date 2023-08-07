<template>
    <div>
      <h2 class="headline">Hoy</h2>
      <v-row>
        <v-col v-for="(tarjeta, index) in tarjetas" :key="index" cols="4">
          <v-card :class="tarjeta.clase" outlined>
            <v-card-title>{{ tarjeta.titulo }}</v-card-title>
            <v-card-text>
              <!-- Contenido relacionado con la tarjeta -->
              <h1>235</h1>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        tarjetas: [
        { titulo: "Balance General", clase: "balance" },
          { titulo: "Turnos Pendientes", clase: "pendientes" },
          { titulo: "Cancelados", clase: "cancelados" },
          
        ]
      };
    },
  };
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