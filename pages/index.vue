<template>
  <div id="app">
    <div v-if="formData" class="bar">
      <div
        class="progress-bar"
        v-if="formData.fields[currentFieldIndex].type !== 'endScreen'"
      >
        <div class="progress" :style="{ width: progressPercentage }"></div>
      </div>
    </div>

    <div class="questionario">
      <template v-if="formData">
        <div class="wrapper-page">
          <div class="content">
            <template
              v-if="
                formData.fields[currentFieldIndex].type !== 'text' &&
                formData.fields[currentFieldIndex].type !== 'email' &&
                formData.fields[currentFieldIndex].type !== 'checkbox'
              "
            >
              <div style="text-align: center; padding: 20px; margin-top: 60px">
                <i
                  class="fa fa-paper-plane"
                  style="font-size: 40px; margin-bottom: 10px"
                >
                </i>
                <p style="font-size: 24px">
                  {{ formData.fields[currentFieldIndex].title }}
                </p>
                <p style="font-size: 16px; margin-top: 5px">
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
                <p
                  style="margin-top: 90px; margin-bottom: 10px; font-size: 24px"
                >
                  {{ formData.fields[currentFieldIndex].title }}
                </p>
                <p>
                  {{ formData.fields[currentFieldIndex].description }}
                </p>
                <div class="input" style="margin-top: 0px">
                  <input
                  :type="formData.fields[currentFieldIndex].type === 'email' ? 'email' : 'text'"
                  v-model="formData.fields[currentFieldIndex].value"
                  @input="validateField"
                  :class="{
                    'invalid-field': !isFieldValid || (formData.fields[currentFieldIndex].required && !getFieldValue(formData.fields[currentFieldIndex]))
                  }"
                  :placeholder="formData.fields[currentFieldIndex].type === 'email' ? 'exemplo@exemplo.com' : 'Sua resposta...'"
                />
                </div>
                <span v-if="!isFieldValid" class="error-message">
                  {{ errorMessage }}
                </span>
              </template>

              <template
                v-else-if="
                  formData.fields[currentFieldIndex].type === 'checkbox'
                "
              >
                <p style="font-size: 24px">
                  {{ formData.fields[currentFieldIndex].title }}
                </p>
                <p>
                  {{ formData.fields[currentFieldIndex].description }}
                </p>
                <div class="field-item">
                  <div class="field-group mt16">
                    <div
                      class="field-tip mb16"
                      style="
                        color: #b0bec5;
                        font-size: 14px;
                        margin-bottom: 10px;
                      "
                    >
                      <i class="fas fa-list" style="margin-right: 5px"></i
                      >Selecione quantos itens desejar.
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
                <span v-if="!isFieldValid" class="error-message">
                  Essa resposta é obrigatória.
                </span>
              </template>

              <div>
                <button
                  @click="nextField"
                  @keydown.enter.prevent="nextField"
                  v-if="currentFieldIndex < formData.fields.length - 1"
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
              v-if="
                currentFieldIndex > 0 &&
                formData.fields[currentFieldIndex].type !== 'endScreen'
              "
              style="padding: 10px; border-radius: 50%"
            >
              <i class="fas fa-arrow-up"></i>
            </button>

            <button
              @click="nextField"
              v-if="currentFieldIndex < formData.fields.length - 1"
              style="padding: 10px; border-radius: 50%"
            >
              <i class="fas fa-arrow-down"></i>
            </button>
          </div>
        </div>
      </template>

      <div v-else></div>
    </div>
  </div>
</template>

<script>
export default {
  css: ["~/assets/main.scss"],

  data() {
    return {
      formData: null, // Armazena os dados do formulário.
      currentFieldIndex: 0, // Índice do campo atual no formulário.
      selectedOptions: [], // Opções selecionadas para campos do tipo checkbox.
      isFieldValid: true, // Indica se o campo atual é válido.
      errorMessage: "Essa resposta é obrigatória.", // Mensagem de erro padrão.
    };
  },

  computed: {
    // Ordena as opções de checkbox alfabeticamente.
    sortedOptions() {
      return this.formData.fields[this.currentFieldIndex].options
        .slice()
        .sort((a, b) => a.value.localeCompare(b.value));
    },
    // Calcula a porcentagem de progresso no formulário.
    progressPercentage() {
      return (this.currentFieldIndex / this.totalFields) * 100 + "%";
    },
    // Retorna o número total de campos no formulário.
    totalFields() {
      return this.formData ? this.formData.fields.length : 0;
    },
    // Verifica se o botão "Próximo" deve ser exibido.
    isNextButtonVisible() {
      return this.currentFieldIndex < this.formData.fields.length - 1;
    },
    // Verifica se o botão "Voltar" deve ser exibido.
    isPrevButtonVisible() {
      return (
        this.currentFieldIndex > 0 &&
        this.formData.fields[this.currentFieldIndex].type !== "endScreen"
      );
    },
  },

  async mounted() {
    try {
      const formDataId = 1; // ID do formulário a ser carregado.
      const formData = await this.fetchFormData(formDataId); // Carrega dados do formulário.
      // Inicializa campos de checkbox como arrays vazios, se não estiverem definidos.
      formData.fields.forEach((field) => {
        if (field.type === "checkbox" && field.value === undefined) {
          this.$set(field, "value", []);
        }
      });
      this.formData = formData; // Atualiza os dados do formulário.
    } catch (error) {
      throw error;
    }
  },

  methods: {
    // Alternância de seleção para opções de checkbox.
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

    // Obtém dados do formulário de uma API simulada.
    async fetchFormData(formDataId) {
      try {
        const response = await fetch(
          `https://65665153eb8bb4b70ef3297d.mockapi.io/api/forms/${formDataId}`
        );
        if (!response.ok) {
          throw new Error(
            `Erro ao obter os dados do formulário: ${response.statusText}`
          );
        }
        return await response.json();
      } catch (error) {
        throw error;
      }
    },

    // Obtém o valor atual de um campo no formulário.
   getFieldValue(field) {
      if (field.value && field.value.target) {
        return field.value.target.value;
      } else if (field.value && field.value.data !== undefined) {
        return field.value.data;
      } else if (field.value !== undefined) {
        return field.value;
      } else {
        return "";
      }
    },

    // Atualiza o valor de um campo no formulário.
    updateFieldValue(fieldId, value) {
      this.$set(
        this.formData.fields.find((field) => field.id === fieldId),
        "value",
        value
      );
    },

    // Valida o campo atual antes de prosseguir.
    validateField() {
      const currentField = this.formData.fields[this.currentFieldIndex];

      if (currentField.type === 'checkbox') {
        this.isFieldValid = this.selectedOptions.length > 0;
      } else if (currentField.type === 'email') {
        const fieldValue = this.getFieldValue(currentField);
        this.isFieldValid = this.isValidEmail(fieldValue);
        this.errorMessage = this.isFieldValid ? '' : 'Insira um e-mail válido.';
      } else if (currentField.type === 'text') {
        const fieldValue = this.getFieldValue(currentField);
        this.isFieldValid = fieldValue !== null && fieldValue !== '';
        this.errorMessage = this.isFieldValid ? '' : 'Essa resposta é obrigatória.';
      } else {
        const fieldValue = this.getFieldValue(currentField);
        this.isFieldValid = fieldValue !== null;
        this.errorMessage = this.isFieldValid ? '' : 'Essa resposta é obrigatória.';
      }
    },

    // Função auxiliar para validar um endereço de e-mail.
    isValidEmail(value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },

    // Move para a próxima pergunta no formulário.
    async nextField() {
      this.validateField();

      if (this.isFieldValid) {
        const responseData = {
          responses: this.formData.fields
            .filter((field) => field.value !== undefined && field.value !== null)
            .map((field) => ({
              field_slug: field.slug || field.title || 'fallback_slug',
              field_title: field.title,
              field_type: field.type,
              value: field.value,
            })),
        };

        try {
          await this.postResponse(responseData);
          this.currentFieldIndex++;
        } catch (error) {
          if (error.response && error.response.status === 400) {
            // Ignora erro 400 (Bad Request) e continua com o formulário
            this.currentFieldIndex++;
          } else {
            console.error("Erro ao enviar resposta:", error);
          }
        }
      } else {
        return false;
      }
    },

    // Move para a pergunta anterior no formulário.
    prevField() {
      if (this.currentFieldIndex > 0) {
        this.currentFieldIndex--;
      }
    },

    // Envia os dados do formulário para uma API simulada.
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
        if (response.status === 400) {
          // Ignora o erro 400 e continua o fluxo
          console.warn("Aviso: Erro 400 na solicitação, mas continuando o fluxo.");
        } else {
          // Lança um erro para outros códigos de status não esperados
          throw new Error(`Erro ao enviar resposta. Status: ${response.status}`);
        }
      }

      const apiResponseData = await response.json();
      console.log("Resposta da API:", apiResponseData);
    } catch (error) {
      console.error("Erro no postResponse:", error);
      throw error;
    }
  },
  },
};
</script>

// Estilos

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
  background-color: #C0CA33;
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

:root {
  font-family: "Lato", "Helvetica", "Arial", sans-serif;
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.questionario {
  width: 100%;
  box-sizing: border-box;
  margin-top: 10%;
  margin-left: 5%;
}

.bar {
  width: 100%;
  box-sizing: border-box;
  margin-top: 0%;
}

.responder-button {
  padding: 10px;
  border-radius: 7%;
  margin-top: 21px;
  background-color: #c0ca33;
  color: black;
  border-color: #536dfe;
  cursor: pointer;
  display: inline;
  align-items: center;
  justify-content: center;
}
.error-message {
  background: #ff1744;
  border-radius: 0 0 5px 5px;
  color: #fff;
  display: inline-block;
  font-size: 12px;
  margin-top: 0;
  padding: 4px 8px;
}
.invalid-field {
  border-bottom-color: #ff1744 !important;
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
