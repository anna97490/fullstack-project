<template>
  <div class="profile">
    <Header />
    <div class="container">
      <div class="profile-fields">
        <h1 class="title">
          Bienvenue sur votre profil {{ userInfo.firstname }} !
        </h1>
        <div class="profile-container">
          <div class="justify">
            <div class="picture-container">
              <img 
                class="profile-picture"
                v-if="this.userInfo.imageUrl"
                :src="this.userInfo.imageUrl"
                alt="Photo de profil de l'utilisateur connecté">
              <img
                class="profile-picture"
                v-else src="../assets/img-user-default.jpg"
                alt="Photo de profil par défaut">
              <span
                class="profile-datas"
                data-aos="fade-right"
                data-aos-delay="200">
                <strong>{{ userInfo.firstname }} {{ userInfo.lastname }}</strong>
              </span>
            </div>
          </div>
          <div class="profile-file">
            <form class="form">
              <label for="file-input">
                <strong>Choisir une nouvelle image de profil:</strong>
              </label>
              <input
                type="file"
                id="file-input"
                name="image"
                enctype="multipart/form-data"
                @change="onFileSelected"
                aria-label="Choisir une image">
            </form>
          </div>
          <div class="btn-container">
            <button class="save-btn" @click="addPicture()">
              <strong>Enregistrer l'image</strong>
            </button>
          </div>
          <div class="border"></div>
          <div class="datas-container">
            <div class="datas">
              <span
                class="profile-datas"
                data-aos="fade-right"
                data-aos-delay="1200">
                <strong>Email: </strong> {{ userInfo.email }}
              </span>
              <span
                class="profile-datas"
                data-aos="fade-right"
                data-aos-delay="1700">
                Inscrit depuis le {{ dateTime(userInfo.createdAt) }}
              </span>
              <span
                class="profile-datas"
                v-if="this.isAdmin === true"
                data-aos="fade-right"
                data-aos-delay="2100">
                <strong>Rôle:</strong>Modérateur
              </span>
            </div>
          </div>
          <button @click="deleteProfile()" type="button" class="delete-btn">
            <strong>Supprimer votre compte</strong>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import instance from '../axios'
import Header from '../components/Header.vue'
import moment from 'moment'

export default {
  name: 'Posts',
  components: {
    Header,
  },
  data() {
    return {
      userInfo: {},
      selectedFile: null,
      account: null,
      isAdmin: false,
    }
  },
  mounted() {
    // Récupération des infos du user courant
    this.account = JSON.parse(localStorage.getItem('user'))
    if (this.account.userId) {
      instance.get(`http://localhost:3000/api/auth/${this.account.userId}`, {
        headers: { Authorization: 'Bearer ' + this.account.token },
      })
      .then((res) => {
        this.userInfo = res.data
        this.isAdmin = this.account.isAdmin
      })
      .catch((err) => {
        console.log(err)
      })
    }
  },
  methods: {
    // Date de création du compte
    dateTime: function (value) {
      return moment(value).format('DD.MM.YY')
    },
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
    },
    // Photo de profil
    addPicture() {
      let user = JSON.parse(localStorage.getItem('user'))
      const fd = new FormData()
      fd.append('image', this.selectedFile)
      instance.put(`http://localhost:3000/api/auth/${user.userId}/update`, fd, {
        headers: {
          Authorization: 'Bearer ' + user.token,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        this.$router.go()
      })
      .catch((err) => {
        console.log(err)
      })
    },
    // Supprimer le profil
    deleteProfile: function () {
      if (confirm('Souhaitez-vous vraiment supprimer votre compte?')) {
        instance.delete(`http://localhost:3000/api/auth/${this.account.userId}/delete`, {
          headers: { Authorization: 'Bearer ' + this.account.token },
        })
        .then(() => {
          alert('Le profil a bien été supprimé !')
          localStorage.clear()
          this.$router.go()
        })
        .catch((err) => {
          console.log(err)
          alert('Une erreur est survenue lors de la suppression de votre profil!')
        })
      }
    }
  }
}
</script>

<style scoped>
.container {
  padding: 22px;
}

.profile-fields {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
  height: auto;
  width: 540px;
  padding: 32px;
  margin: auto;
  background: #fff;
  border: 17px solid #1877f2;
  border-radius: 16px;
  box-shadow: 0 15px 29px rgb(0 0 0 / 20%), 0 8px 16px rgb(0 0 0 / 5%);;
}

.title {
  width: 100%;
  margin: 6px 0 15px 0;
  text-align: center;
  font-size: 20px;
}

.justify {
  display: flex;
  justify-content: center;
}

.picture-container {
  display: flex;
  width: 180px;
  flex-wrap: wrap;
  border-radius: 8px;
  background-color: #f3f3f3;
  box-shadow: 0 2px 13px rgb(0 0 0 / 30%), 0 8px 16px rgb(0 0 0 / 10%);;
}

.profile-datas {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 5px 0;
  padding: 12px;
  font-size: 15px;
  border-radius: 6px;
}

.profile-datas strong {
  margin-right: 5px;
}

.profile-picture {
  width: 200px;
  height: 160px;
  border-radius: 8px 8px 0 0;
}


.profile-file {
  margin-top: 15px;
}

.profile-file label {
  font-size: 15px;
}

.form {
  width: 60%;
}

#file-input {
  margin-bottom: 10px;
  font-size: 12px;
}

.profile__img {
  display: flex;
  align-items: center;
}

.picture-default {
  width: 100px;
  height: 100px;
  border: 2px solid #ff5618;
  border-radius: 80px;
}

.btn-container {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.save-btn {
  width: 150px;
  padding: 12px;
  font-size: 14px;
  border: none;
  border-radius: 25px;
  color: #fff;
  background: linear-gradient(#f99655, #bd3007);
  transform: scale(0.9);
  transition-property: transform;
  transition-duration: 0.4s;
  box-shadow: 0 10px 13px rgb(0 0 0 / 30%), 0 8px 16px rgb(0 0 0 / 10%);
}

.save-btn:hover {
  transform: scale(1);
  cursor: pointer;
}

.border {
  border-bottom: 1px solid #d5d5d58c;
}

.datas-container {
  display: flex;
  justify-content: center;
  margin: 35px 0 2px 0;
  padding: 0 20px;
  flex-wrap: wrap;
  border-radius: 4px;
  background-color: #f3f3f3;
  box-shadow: 0 2px 13px rgb(0 0 0 / 30%), 0 8px 16px rgb(0 0 0 / 10%);;
}

.delete-btn {
  width: 190px;
  margin-top: 15px;
  padding: 12px;
  font-size: 15px;
  border: none;
  border-radius: 25px;
  transform: scale(0.9);
  transition-property: transform;
  transition-duration: 0.4s;
  background: linear-gradient(#ef660d, #971508);
  color: #fff;
  z-index: 1;
  box-shadow: 0 10px 13px rgb(0 0 0 / 30%), 0 8px 16px rgb(0 0 0 / 10%);
  cursor: pointer;
}

.delete-btn:hover {
  transform: scale(1);
  cursor: pointer;
}

/* MEDIA QUERIES */
@media screen and (min-width: 769px) and (max-width: 992px) {
  .profile-fields {
    width: 95%;
  }
}

@media screen and (min-width: 300px) and (max-width: 768px) {
  .profile-fields {
    width: 99%;
  }

  .delete-btn {
    word-break: break-word;
    float: none;
  }
}
</style>
