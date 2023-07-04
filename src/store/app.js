// Utilities

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  getDocs,
  runTransaction,
  endAt,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../confiFirebase";
import { defineStore } from "pinia";

import { useRouter } from "vue-router";

export const useAppStore = defineStore("app", {
  state: () => ({
    formTurno: { display: false, f: 0 },
    edit: null,
    turnos: [],
    
  }),
  actions: {
  
    // Función para agregar un nuevo producto a la colección "productos"
    opnenFormTurno(d, ob) {
      if (d.f === 1) {
      }
      {
        this.edit = ob;
      }
      this.formTurno = d;
    },
    async addTurno(turno) {
     
      try {
      
        
        // Add a new document with a generated id.
const docRef = await addDoc(collection(db, "turnos"),turno);
console.log("Document written with ID: ", docRef.id);
 
      } catch (e) {
        alert("Ocurrio un error : "+ e);
       
      }
      
    },
    async eliminarTurno(v) {
      if (confirm("¿Estás seguro que deseas eliminar este producto?")) {
        const docRef = await doc(db, "turnos", v);
        try {
          await deleteDoc(docRef);
          alert("Turno Eliminado");
        } catch (error) {
          console.error("Error eliminando el documento: ", error);
        }
      }
    },

    async editarTurno(turno) {
      try {
        await runTransaction(db, async (transaction) => {
          await setDoc(doc(db, "turnos", turno.id), turno);
        });
        alert("Cambios guardados con exito");
      } catch (e) {
        alert("Ocurrio un error :", e);
      }
    },
    async getTurnos() {
      const q = query(collection(db, "turnos"), where("placa", "!=", ""));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const turnos = [];
      
        querySnapshot.forEach((doc) => {
          const turno = doc.data();
      turno.id = doc.id; // Agregar el ID del documento al objeto "turno"
      turnos.push(turno);
        
        });
        this.turnos = turnos;
     
      });
    },


  

   
    //FECHA ACTUAL FUNCION
    hoy() {
      const date = new Date();
      const year = date.getFullYear();
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    },
  },

  getters: {
    ////////
  },
});
