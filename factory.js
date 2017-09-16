/* globals window document MutationObserver */

import componentEvents from './events';

const hasMutationObserver = !!window.MutationObserver;
let mutationObserver;

// watches component element removals and
// triggers a destroy event on the element
// for the component to clean up after itself
if (hasMutationObserver) {
  mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      [...mutation.removedNodes].forEach(onNodeRemoved);
    });
  });
}

/**
 * Handler for when a DOM element has been removed
 * @param {Element} element
 */
const onNodeRemoved = element => element.dispatchEvent(new Event(componentEvents.DESTROY_REQUEST));

/**
 * Factory
 * @param {Function} component
 * @param {String} selector
 * @param {Object} [options={}]
 */
const factory = (component, selector, options = {}) => {
  const elements = [...document.querySelectorAll(selector)];
  const elementContainer = elements.length ? elements[0].parentNode : null;
  const defaultOptions = { selector, destroyEvent: componentEvents.DESTROY_REQUEST };

  let settings;

  elements
    .filter(element => !element.component)
    .forEach((element, index) => {
      settings = Object.assign({ index }, defaultOptions, options);
      element.component = component(element, settings);

      if (!hasMutationObserver) {
        element.addEventListener('DOMNodeRemoved', (event) => {
          event.target.removeEventListener('DOMNodeRemoved');
          onNodeRemoved(event.target);
        }, false);
      }
    });

  if (hasMutationObserver && elementContainer) {
    mutationObserver.observe(elementContainer, { childList: true });
  }
};

export default factory;
