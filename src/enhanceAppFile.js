import Debug from './components/Debug';
import Form from './components/Form.vue';

export default ({ Vue }) => {
  Vue.component('PluginFlexSearchDebug', Debug);
  Vue.component('PluginFlexSearchForm', Form);
};
