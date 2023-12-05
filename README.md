# Questionario App

## Como rodar:

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

Visão Geral
Como evoluir o projeto a longo prazo:

Estrutura do Projeto
-Organizar o projeto de maneira modular, dividindo-o em componentes reutilizáveis, serviços e utilitários. Exemplo dos diretórios:

/src
|-- components
|   |-- fields
|       |-- TextField.vue
|       |-- EmailField.vue
|       |-- CheckboxField.vue
|       |-- CustomField.vue  // Novos tipos de campos podem ser adicionados aqui
|-- services
|   |-- FormService.js
|   |-- ApiService.js
|-- utils
|   |-- validation.js
|-- views
|   |-- FormView.vue
|-- App.vue
|-- main.js

-Usaria validadores customizados
// Exemplo
{
  type: 'text',
  title: 'Nome',
  validators: ['required', 'customValidator'],
  // ...
}
-Pegaria de forma dinâmica o style que vem pela requisição
-Aplicaria testes automatizados
assets
O diretório assets contém seus ativos não compilados, como arquivos Stylus ou Sass, imagens ou fontes.

components
O diretório components contém seus componentes Vue.js. Os componentes constituem as diferentes partes da sua página e podem ser reutilizados e importados em suas páginas, layouts e até mesmo outros componentes.

layouts
Os layouts são de grande ajuda quando você deseja alterar a aparência e o estilo do seu aplicativo Nuxt, seja para incluir uma barra lateral ou ter layouts distintos para dispositivos móveis e desktop.

pages
Este diretório contém as visualizações e rotas de sua aplicação. O Nuxt lerá todos os arquivos *.vue dentro deste diretório e configurará automaticamente o Vue Router.

plugins
O diretório plugins contém plugins JavaScript que você deseja executar antes de instanciar a raiz da aplicação Vue.js. Este é o local para adicionar plugins Vue e para injetar funções ou constantes. Sempre que precisar usar Vue.use(), você deve criar um arquivo em plugins/ e adicionar seu caminho aos plugins em nuxt.config.js.

static
Este diretório contém seus arquivos estáticos. Cada arquivo dentro deste diretório é mapeado para /.

Exemplo: /static/robots.txt é mapeado como /robots.txt.

store
Este diretório contém seus arquivos de armazenamento Vuex. Criar um arquivo neste diretório ativa automaticamente o Vuex.
=======
# Questionario
Questionário em Vue.js 2, Saas, Nuxt e consumindo api, heroku e javascript não utilizei biblioteca de componentes.
>>>>>>> b5186f07b4bb805b6ba1dc3e827a5eb5a578a2be
