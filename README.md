# componentFactory

This component factory is able to attach a javascript component created by a factory function to a DOM element using the DOM elements dynamic property method.

### Usage

```javascript
import factory from './factory';

/**
 * An example component
 * @param {Element} element
 * @param {Object} settings
 * @return Object
 */
const exampleComponent = (element, settings) => {
  const { destroyEvent } = settings;

  /**
   * Constructor
   */
  function constructor() {
    bindEvents();
  }

  /**
   * Bind handlers to events
   */
  function bindEvents() {
    element.addEventListener(destroyEvent, onDestroyRequest);
  }

  /**
   * Destroy event handler
   * @param {Event} event
   */
  function onDestroyRequest(event) {
    element.removeEventListener(event.type, onDestroyRequest);
    // and clear any other listeners you might 
    // have added to this element or its children
  }

  constructor();

  return {
    // public api functions go here or leave this object blank
    // if you use events to communicate in a loose coupled setup
  };
};

factory(exampleComponent, '.exampleComponentDomElement', {
  exampleSetting: 'example',
});
```
