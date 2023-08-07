<style scoped>
.contenedor{
  padding: 10px 20px;
}
</style>

<template>
    <div style="background: rgb(30, 32, 44); height:100% ;" >
      <Drawer/>
      <Bar/> 
<div class="contenedor">

  <slot ></slot>
</div>    
  </div>
  </template>
  
  <script setup>
    import Bar from '@/components/Bar.vue'
    import Drawer from '@/components/Drawer.vue'
 
    import { useAppStore } from "../store/app";
  
 
  </script>