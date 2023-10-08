import Debug from './components/Debug.vue';
import Form from './components/Form.vue';

export default ({ Vue }) => {
  Vue.component('PluginFlexSearchDebug', Debug);
  Vue.component('PluginFlexSearchForm', Form);
};
