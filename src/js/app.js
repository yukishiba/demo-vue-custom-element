'use strict';

import 'normalize.css';

// vue
import Vue from 'vue';

import vueCustomElement from 'vue-custom-element';
Vue.use(vueCustomElement);

import VuePhotoSwipe from 'vue-photoswipe';
Vue.use(VuePhotoSwipe);

import VFacilityGallery from 'vue/facility-gallery';
Vue.customElement('v-facility-gallery', VFacilityGallery);
