// Initialize an array to store state values and an index to track the current state
let states: any[] = [];
let currentIndex = 0;

// Define the container variable
let container: HTMLElement | null = null;
let rootComponent: any = null; // Store the root component

// Define the VNode interface for type safety
interface VNode {
  type: string | ((props: any) => VNode); // Can be a string (for HTML elements) or a function (for components)
  props: { [key: string]: any } | null; // Props for the element or component, can be null
  children: (VNode | string)[]; // Child nodes can be VNodes or strings (text nodes)
}

// Define the MyReact object with methods to create elements, render them, and manage state
const MyReact = {
  createElement,
  render,
  useState,
};

// Function to create a virtual DOM node
function createElement(
  type: string | ((props: any) => VNode),
  props: { [key: string]: any } = {},
  ...children: (VNode | string)[]
): VNode {
  return { type, props, children }; // Return a VNode object
}

// Function to render a virtual DOM node into the container
function render(component: () => VNode, targetContainer: HTMLElement | null) {
  container = targetContainer; // Set the global container
  rootComponent = component; // Set the root component
  currentIndex = 0; // Reset the state index

  // Call the root component to get the VNode and render it
  const vnode = component();
  renderVNode(vnode, container);
}

// Helper function to render a VNode
function renderVNode(
  vnode: VNode | string,
  targetContainer: HTMLElement | null
) {
  // If the vnode is a string, create a text node and append it to the container
  if (typeof vnode === "string") {
    targetContainer?.appendChild(document.createTextNode(vnode));
    return;
  }

  // Destructure the vnode
  const { type, props, children } = vnode;

  // Handle function types in `renderVNode`
  if (typeof type === "function") {
    // If type is a function (component), call it to get the VNode and render it
    const componentVNode = type(props);
    renderVNode(componentVNode, targetContainer);
    return;
  } else {
    // Otherwise, create an HTML element
    const element = document.createElement(type);

    // Check if props are not null
    if (props) {
      // Set the element's properties and attributes
      Object.keys(props).forEach((key) => {
        if (key.startsWith("on") && typeof props[key] === "function") {
          // Add event listeners (e.g., onclick)
          element.addEventListener(key.substring(2).toLowerCase(), props[key]);
        } else {
          // Set attributes (e.g., id, className)
          element.setAttribute(key, props[key]);
        }
      });
    }

    // Recursively render the children into the newly created element
    children.forEach((child) => renderVNode(child, element));

    // Ensure `element` is always an `HTMLElement` before appending
    targetContainer?.appendChild(element);
  }
}

// Hook to manage state within components
function useState(initialState: any) {
  const stateIndex = currentIndex; // Capture the current state index
  currentIndex++; // Increment the state index for the next useState call

  // Initialize state if it doesn't exist
  if (states[stateIndex] === undefined) {
    states[stateIndex] = initialState;
  }

  // Function to update the state
  function setState(newState: any) {
    states[stateIndex] = newState; // Update the state
    reRender(); // Re-render the application
  }

  // Return the state and the setState function
  return [states[stateIndex], setState];
}

// Function to re-render the application
function reRender() {
  if (container && rootComponent) {
    container.innerHTML = ""; // Clear the container
    currentIndex = 0; // Reset the state index
    render(rootComponent, container); // Re-render the root component
  }
}

// Export the MyReact object
export default MyReact;
