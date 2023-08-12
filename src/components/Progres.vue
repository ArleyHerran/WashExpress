<template>
    <v-dialog v-model="estados.progres.display" persistent max-width="400px">
      <v-card>
        <v-card-text>
          <div class="text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <p>{{estados.progres.ms}}</p>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { useAppStore } from "../store/app";
  import { ref, computed } from 'vue';
  
  const estados = useAppStore();
  

 
  </script>
  