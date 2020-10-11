// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-nocheck
import Vue from 'vue';
import {
  Input,
  Field,
  Button,
  Icon,
  Select,
  Tag,
  Tabs,
  Switch,
  Radio,
  Toast,
  Dropdown
} from 'buefy';

// Import Buefy Components
Vue.use(Dropdown);
Vue.use(Input);
Vue.use(Icon);
Vue.use(Field);
Vue.use(Select);
Vue.use(Tag);
Vue.use(Switch);
Vue.use(Radio);
Vue.use(Toast);
Vue.use(Button);
Vue.use(Tabs);

Vue.filter('pre', (text) => {
  if (!text) return;

  // Remove first blank line
  text = text.replace(/^\s*[\r\n]/g, '');

  // Find how many whitespaces before the first character of the first line
  const whitespaces = /^[ \t]*./.exec(text).toString().slice(0, -1);

  // Replace first occurrance of whitespace on each line
  let newText = [];
  text.split(/\r\n|\r|\n/).forEach((line) => {
    newText.push(line.replace(whitespaces, ''));
  });
  newText = newText.join('\r\n');

  return newText;
});

Vue.filter('capitalize', function (value) {
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});
