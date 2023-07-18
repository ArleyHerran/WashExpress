// Utilities

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getAuth,
  createUserWithEmailAndPassword,
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
    loginInfo: { display: false, title: "", text: "", color: "", icon: "" },
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
    //FUNCION PARA AGREGAR TURNO
    async addTurno(turno) {
      try {
        // Add a new document with a generated id.
        const docRef = await addDoc(collection(db, "turnos"), turno);
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        alert("Ocurrio un error : " + e);
      }
    },
    //FUNCION PARA ELIMINAR TURNO
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
    //FUNCION PARA EDITAR TURNO
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
    //FUNCION PARA TRAER LOS TURNOS
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

    //CREAR USAURIO CON CORREO  Y CONTRASEÑA
    async registrar(email, password) {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          localStorage.setItem("usuario", JSON.stringify(userCredential));
          this.loginInfo.color = "success";
          this.loginInfo.icon = "$success";
          this.loginInfo.title = "Registro exitoso";
          this.loginInfo.text = "";
          this.loginInfo.display = true;

          setTimeout(function () {
            location.reload();
            this.loginInfo.display = false;
          }, 500);
       
          // ...
        })
        .catch((error) => {
          console.log("errror");
          const errorCode = error.code;
          this.loginInfo.color = "error";
          this.loginInfo.icon = "$error";
          this.loginInfo.title = "Error";
          const errorMessage = error.message;
          this.loginInfo.text = this.getAuthErrorMessage(errorCode);
          this.loginInfo.display = true;
          // ..
        });
    },

    //FUNCION QUE PERMITE LOGEAR AL USUARIO
    login(email, password) {
      const auth = getAuth();
      console.log(email);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          localStorage.setItem("usuario", JSON.stringify(userCredential));
          this.loginInfo.color = "success";
          this.loginInfo.icon = "$success";
          this.loginInfo.title = "Acceso exitoso";
          this.loginInfo.text = "";
          this.loginInfo.display = true;

          setTimeout(function () {
            location.reload();
            this.loginInfo.display = false;
          }, 500);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          this.loginInfo.color = "error";
          this.loginInfo.icon = "$error";
          this.loginInfo.title = "Error";
          this.loginInfo.text = this.getAuthErrorMessage(errorCode);
          console.log(error.message);
          this.loginInfo.display = true;
        });
    },

    //FUNCION QUE PERMITE CERRAR LA SESION
    cerrarSesion() {
      if (confirm("Esta seguro que desea cerrar la sesion?")) {
        const auth = getAuth();
        signOut(auth)
          .then(() => {
            // Sign-out successful.
            localStorage.setItem("usuario", null);
            location.reload();
          })
          .catch((error) => {
            // An error happened.
            alert("Error desconocido al cerrar la sesion");
          });
      }
    },

    //FECHA ACTUAL FUNCION
    hoy() {
      const date = new Date();
      const year = date.getFullYear();
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    },
    //lib error firebase

    getAuthErrorMessage(errorCode) {
      switch (errorCode) {
        case "auth/email-already-in-use":
          return "El correo electrónico ya está en uso.";

        case "auth/invalid-email":
          return "El correo electrónico proporcionado no es válido.";

        case "auth/user-not-found":
          return "No se encontró ningún usuario con el correo electrónico proporcionado.";

        case "auth/wrong-password":
          return "La contraseña es incorrecta.";

        case "auth/weak-password":
          return "La contraseña debe tener al menos 6 caracteres.";

        case "auth/operation-not-allowed":
          return "Esta operación no está permitida.";

        case "auth/invalid-verification-code":
          return "El código de verificación no es válido.";

        case "auth/invalid-verification-id":
          return "El ID de verificación no es válido.";

        // Agrega más casos para otros códigos de error de autenticación que desees manejar

        default:
          return "Ha ocurrido un error de autenticación desconocido.";
      }
    },
  },

  getters: {
    ////////
  },
});
