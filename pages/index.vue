<template>

  <div id="app">
    <div v-if="formData" class="bar">
      <div class="progress-bar" v-if="formData.fields[currentFieldIndex].type !== 'endScreen'">
        <div class="progress" :style="{ width: progressPercentage }"></div>
      </div>
    </div>

    <div class="questionario">
    
      <template v-if="formData">
        <div class="wrapper-page">
          <div class="content">
          <template
            v-if="formData.fields[currentFieldIndex].type !== 'text'  &&formData.fields[currentFieldIndex].type !== 'email' && formData.fields[currentFieldIndex].type !== 'checkbox'"
            >
           <div style="text-align: center; padding: 20px;margin-top: 60px;">
            <i class="fa fa-paper-plane" style="font-size: 40px; margin-bottom: 10px;">
            </i>
            <h2 style="font-size: 24px;">
            {{ formData.fields[currentFieldIndex].title }}
            </h2>
            <p style="font-size: 16px; margin-top: 5px;">
            {{ formData.fields[currentFieldIndex].description }}
            </p>
          </div>

            </template>
            <div v-if="currentFieldIndex < formData.fields.length">
            
              <template
                v-if="
                  formData.fields[currentFieldIndex].type === 'text' ||
                  formData.fields[currentFieldIndex].type === 'email'
                "
              >
                <h2 style="margin-top:90px;margin-bottom:10px">
                {{ formData.fields[currentFieldIndex].title }}
                </h2>
                <p>
                {{ formData.fields[currentFieldIndex].description }}
                </p>
                <div class="input" style="margin-top:0px">
                  <input
                  :type="
                    formData.fields[currentFieldIndex].type === 'email'
                      ? 'email'
                      : 'text'
                  "
                  :value="getFieldValue(formData.fields[currentFieldIndex])"
                  @input="
                    updateFieldValue(
                      formData.fields[currentFieldIndex].id,
                      $event.target.value
                    )
                  "
                  :required="formData.fields[currentFieldIndex].required"
                  :placeholder="
                    formData.fields[currentFieldIndex].type === 'email'
                      ? 'exemplo@exemplo.com'
                      : 'Sua resposta...'
                  "
                  />
                </div>
              </template>

              <template
                v-else-if="
                  formData.fields[currentFieldIndex].type === 'checkbox'
                "
              >
                <h2>
                {{ formData.fields[currentFieldIndex].title }}
                </h2>
                <p>
                {{ formData.fields[currentFieldIndex].description }}
                </p>
                <div class="field-item">
                  <div class="field-group mt16">
                   <div class="field-tip mb16" style="color:#b0bec5;font-size:14px;margin-bottom:10px">
                      <i class="fas fa-list"  style="margin-right:5px"></i>Selecione quantos itens desejar.
                    </div>

                    <div
                      v-for="(option, index) in sortedOptions"
                      :key="option.id"
                      class="option"
                    >
                      <div
                        class="checkbox"
                        @click="toggleCheckbox(option)"
                        :class="{ selected: selectedOptions.includes(option) }"
                      >
                        <label
                          :for="'checkbox-' + index"
                          class="choice-fruit-wrapper"
                        >
                          <span class="box-fruit-letter"
                            ><span
                              class="letter"
                              style="text-transform: uppercase"
                              >{{ String.fromCharCode(97 + index) }}</span
                            ></span
                          >
                          {{ option.value }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <div>
             <button
                @click="nextField"
                v-if="currentFieldIndex < formData.fields.length - 1
                "
                class="responder-button"
              >
                Responder
              </button>
              </div>
            </div>

          </div>
          <div class="arrow-section">
            <button
              @click="prevField"
              v-if="currentFieldIndex > 0 && formData.fields[currentFieldIndex].type !== 'endScreen'"
              style="padding: 10px; border-radius: 50%"
            >
              <i class="fas fa-arrow-up"></i>
            </button>

            <button
              @click="nextField"
              v-if="
                currentFieldIndex < formData.fields.length - 1 
              "
              style="padding: 10px; border-radius: 50%"
            >
              <i class="fas fa-arrow-down"></i>
            </button>
          </div>
        </div>
      </template>

      <div v-else>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: null,
      currentFieldIndex: 0,
      formErrors: {},
      selectedOptions: [],
      rules: {
      checkbox: (value) => value.length > 0,
      text: (value) => value !== undefined && value.trim() !== '',
      email: (value) => value !== undefined && value.trim() !== '',
    },
    };
  },

  computed: {
    sortedOptions() {
    // Ordena as opções checkbox alfabeticamentef=
      return this.formData.fields[this.currentFieldIndex].options
        .slice()
        .sort((a, b) => a.value.localeCompare(b.value));
    },
    //Progresso barra
    progressPercentage() {
      return (this.currentFieldIndex / this.totalFields) * 100 + "%";
    },
    totalFields() {
      return this.formData ? this.formData.fields.length : 0;
    },
  },

  async mounted() {
      try {
      const formDataId = 1; // ID do formulario,
      const formData = await this.fetchFormData(formDataId);
      console.log(formData);
      // Inicializa o campo "value" do tipo "checkbox" como um array vazio, se não estiver definido
      formData.fields.forEach((field) => {
        if (field.type === "checkbox" && field.value === undefined) {
          this.$set(field, "value", []);
        }
      });
      this.formData = formData;
    } catch (error) {
        throw error;
    }
  },

  methods: {
      toggleCheckbox(option) {
        const index = this.selectedOptions.findIndex(
          (selectedOption) => selectedOption.id === option.id
        );

        if (index !== -1) {
          this.selectedOptions.splice(index, 1);
        } else {
          this.selectedOptions.push(option);
        }
      },

    async fetchFormData(formDataId) {
        try {
          const response = await fetch(
            `https://65665153eb8bb4b70ef3297d.mockapi.io/api/forms/${formDataId}`
          );
          if (!response.ok) {
            throw new Error(`Erro ao obter os dados do formulário: ${response.statusText}`);
          }
          const formData = await response.json();
          return formData;
        } catch (error) {
          throw error;
        }
      },
      
      // Atualiza checkbox
      updateCheckboxValue(fieldId, optionValue) {
        const field = this.formData.fields.find((field) => field.id === fieldId);
        const index = field.value.indexOf(optionValue);

        if (index !== -1) {
          field.value.splice(index, 1);
        } else {
          field.value.push(optionValue);
        }
      },
      //Obtem valor dos campos
      getFieldValue(field) {
        return field.value;
      },

      //Atualiza valor dos campos
      updateFieldValue(fieldId, value) {
        this.$set(
          this.formData.fields.find((field) => field.id === fieldId),
          "value",
          value
        );
      },
    
        //Passa para próxima questão
        nextField() {
          if (
            this.currentFieldIndex < this.formData.fields.length - 1 
          ) {
            this.currentFieldIndex++;
          } else {
            console.log("Preencha todos os campos obrigatórios antes de avançar.");
          }
        },

        //Volta para questão anterior
        prevField() {
          if (this.currentFieldIndex > 0) {
            this.currentFieldIndex--;
          }
        },

      async postResponse(responseData) {
        try {
          const response = await fetch(
            "https://65665153eb8bb4b70ef3297d.mockapi.io/api/respondents",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(responseData),
            }
          );
          if (!response.ok) {
            throw new Error(`Erro ao enviar resposta: ${response.statusText}`);
          }
          const responseData = await response.json();
        } catch (error) {
          throw error;
        }
      },
    },
  };
</script>

<style scoped lang="scss">
.progress-bar {
  width: 100%;
  height: 5px;
  background-color: #ddd;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 20px;
}

.progress {
  height: 100%;
  width: 0;
  background-color: #4caf50;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.content {
  width: 56%;
  margin: auto;
}

.arrow-section {
  width: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  
}
.wrapper-page {
  display: flex;
  width: 100%;
}
.input {
  position: relative;
  width: 100%;
}

.input input {
  width: 100%;
  padding: 10px;
  border: none;
  color: white;
  border-bottom: 1px solid #cecece;
  box-sizing: border-box;
  font-size: 16px;
  margin-top: 8px;
}

.input input:focus {
  outline: none;
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
}

.questionario {
  width: 100%;
  box-sizing: border-box;
  margin-top:10%;
  margin-left:5%;
}

.bar {
  width: 100%;
  box-sizing: border-box;
  margin-top:0%;
}

.responder-button {
  padding: 10px;
  border-radius: 7%;
  margin-top: 21px;
  background-color: #c0ca33;
  color: black;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox {
  border: 1px solid #cecece;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 15px;
  &:hover {
    cursor: pointer;
    background: rgba(255, 255, 255, 0.15);
    .box-fruit-letter {
      border: 1px solid #fff;
    }
  }
  &.selected {
    cursor: pointer;
    background: rgba(255, 255, 255, 0.15);
    .box-fruit-letter {
      border: 1px solid #fff;
    }
  }
}
input[type="checkbox"] {
  font-size: 19.6px;
  margin-bottom: 11.2px;
  margin-left: 10px;
  margin-top: 10px;
}

.choice-fruit-wrapper {
  display: flex;
}
.box-fruit-letter {
  border-radius: 3px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  background: rgba(255, 255, 255, 0.15);
  height: 22px;
  margin-right: 10px;
}
</style>
