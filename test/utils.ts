import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import Draggable from 'vuedraggable'
// @ts-ignore
import VJsf from '../lib/VJsfNoDeps.js'
// @ts-ignore
import { defaultTemplate } from '../doc/examples'
import { mount } from '@vue/test-utils'
// @ts-ignore
import ExampleForm from './example-form.vue'
import Ajv from 'ajv'
import ajvFormats from 'ajv-formats'
import ajvLocalize from 'ajv-i18n'

const App = {
  computed: {
    count() {
      return this.$state.count
    }
  }
}

const app = createApp(App)

const vuetify = createVuetify({
  components,
  directives
})

app.use(vuetify)

app.component('VJsf', VJsf)
app.component('Draggable', Draggable)

export function getExampleWrapper(example) {
  const vuetify = createVuetify({
    components,
    directives
  })

  const template = (example.template || defaultTemplate)
    .replace('"model"', '"props.modelWrapper.model"')
    .replace('"schema"', '"props.schema"')
    .replace('"options"', '"props.options"')
    .replace(/logEvent/g, 'props.logEvent')

  if (template.includes('slot-scope')) {
    // TODO: investigate
    console.log('No test for example with scoped slots')
    return
  }

  // const Ajv = require('ajv')
  const ajv = new Ajv({ allErrors: true })

  const options = {
    ...example.options,
    ajv,
    ajvFormats,
    ajvLocalize,
    httpLib: {
      get: (url) => {
        const result = example.httpMocks[url]
        if (!result) {
          console.warn(`in example ${example.id}, missing mock for url ${url}`)
          return new Promise(resolve => resolve({ data: {} }))
        }
        return new Promise(resolve => resolve({ data: result }))
      }
    }
  }

  const modelWrapper = { model: example.model || {} }

  const events = []

  const wrapper = mount(ExampleForm, {
    props: {
      modelWrapper,
      schema: example.schema,
      options,
      logEvent: (event) => {
        events.push(event)
      }
    },
    global: {
      plugins: [vuetify]
    }
  })

  return { wrapper, modelWrapper, events }
}
