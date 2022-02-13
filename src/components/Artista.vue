<!-- @format -->

<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="desserts"
          :search="search"
          :sort-by="sortBy.toLowerCase()"
          class="elevation-12"
        >
          <template v-slot:[`item.image`]="{ item }">
            <div class="p-1">
              <v-img
                :src="item.image"
                :alt="item.name"
                class="shadow-sm rounded-circle"
                width="2rem"
                height="2rem"
              ></v-img>
            </div>
          </template>
          <template v-slot:top>
            <v-toolbar class="mb-2" color="black" dark>
              <v-toolbar-title>Registro de artistas</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-dialog
                transition="fab-transition"
                v-model="dialog"
                max-width="500px"
              >
                <v-toolbar dark color="purple">
                  <v-toolbar-title>{{ formTitle }} </v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-toolbar-items>
                    <v-btn icon dark @click="dialog = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-toolbar-items>
                </v-toolbar>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn class="mx-2" fab dark v-bind="attrs" v-on="on">
                    <v-icon dark> mdi-plus </v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.name"
                            label="Nombre"
                            prepend-icon="mdi-account"
                            :rules="[(v) => !!v || 'Campo Obligatorio *']"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.date"
                            type="date"
                            label="Fecha Nacimiento"
                            prepend-icon="mdi-calendar"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.biography"
                            label="biografia"
                            prepend-icon="mdi-cellphone"
                            :rules="[(v) => !!v || 'Campo Obligatorio *']"
                            type="text"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="6" md="4">
                          <v-file-input
                            id="photo_profile"
                            v-model="editedItem.image"
                            :rules="[(v) => !!v || 'Campo Obligatorio *']"
                            accept="image/png, image/jpeg, image/bmp"
                            placeholder="Seleccione una imagen"
                            prepend-icon="mdi-file-image-outline"
                            label="Avatar"
                          ></v-file-input>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.gender"
                            label="Genero"
                            prepend-icon="mdi-person"
                            :rules="[(v) => !!v || 'Campo Obligatorio *']"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-snackbar
                      v-model="snackbar"
                      color="green"
                      :timeout="2000"
                      absolute
                      bottom
                      left
                    >
                      {{ textSnackbar }}
                    </v-snackbar>
                    <v-btn color="blue darken-1" text @click="close">
                      Cancelar
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save">
                      Guardar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5">
                    Quieres eliminar este contacto?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >Cancel</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
            <v-col cols="12" sm="12">
              <v-text-field
                v-model="search"
                clearable
                flat
                solo-inverted
                hide-details
                prepend-inner-icon="mdi-magnify"
                label="Buscar contacto"
              ></v-text-field>
            </v-col>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              x-small
              class="mx-2"
              fab
              color="blue"
              @click="editItem(item)"
            >
              <v-icon color="white"> mdi-pencil </v-icon>
            </v-btn>
            <v-btn
              x-small
              class="mx-2"
              fab
              color="red"
              @click="deleteItem(item)"
            >
              <v-icon color="white"> mdi-delete </v-icon>
            </v-btn>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize"> Refresca </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    image: "",
    dialog: false,
    snackbar: false,
    textSnackbar: "Artista guardado",
    dialogDelete: false,
    search: "",
    filter: {},

    sortBy: "name",
    headers: [
      {
        text: "Nombre",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Fecha nacimiento", value: "date", sortable: false },
      { text: "Biografia", value: "biography", sortable: false },
      { text: "Imagen", value: "image", sortable: false },
      { text: "Genero", value: "gender", sortable: false },

      { text: "Acciones", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      date: "",
      biography: "",
      image: [],
      gender: "",
    },
    defaultItem: {
      name: "",
      date: "",
      biography: "",
      image: [],
      gender: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo artista" : "Editar artista";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      var url = "http://localhost:8081/uploads/";
      fetch("http://localhost:8081/api/singers", {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          var recorrer = data;
          recorrer.forEach((element) => {
            var recuperar = {
              name: element.name,
              date: element.date,
              biography: element.biography,
              image: url + element.image,
              gender: element.gender,
            };
            this.desserts.push(recuperar);
          });
        })
        .catch((error) => {
          error == alert("error en servidor");
        });
    },

   
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        const formData = new FormData();
        let photo = document.querySelector("#photo_profile");
        formData.append("name", this.editedItem.name);
        formData.append("date", this.editedItem.date);
        formData.append("biography", this.editedItem.biography);
        formData.append("image", photo.files[0]);
        formData.append("gender", this.editedItem.gender);

        fetch(
          "http://localhost:8081/api/singers",

          {
            method: "POST",
            body: formData,
          }
        )
          .then((data) => {
            data == this.textSnackbar;
            this.snackbar = true;
            setTimeout(() => {
              this.close();
            }, 1000);
          })
          .catch((error) => {
            error == alert("error en servidor");
          });
        this.desserts.push(this.editedItem);
      }
    },
  },
  mounted() {},
};
</script>
