// Initialize an array to store state values and an index to track the current state
let states: any[] = [];
let currentIndex = 0;

// Define the container variable
let container: HTMLElement | null = null;
let rootComponent: any = null; // Store the root component
let prevVNode: VNode | null = null; // Store the previous VNode

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
  reconcile(container, prevVNode, vnode);
  prevVNode = vnode; // Update the previous VNode
}

// Helper function to reconcile VNodes
function reconcile(
  parentDom: HTMLElement | null,
  oldVNode: VNode | string | null,
  newVNode: VNode | string | null,
  index = 0
) {
  if (!oldVNode) {
    console.log(oldVNode, newVNode);
    // If there's no old VNode, append the new VNode
    if (newVNode) parentDom?.appendChild(createDomElement(newVNode));
  } else if (!newVNode) {
    // If there's no new VNode, remove the old VNode
    parentDom?.removeChild(parentDom.childNodes[index]);
  } else if (typeof oldVNode === "string" || typeof newVNode === "string") {
    if (oldVNode !== newVNode) {
      // If the VNodes are different, replace the old VNode with the new VNode
      parentDom?.replaceChild(
        createDomElement(newVNode),
        parentDom.childNodes[index]
      );
    }
  } else if (oldVNode.type !== newVNode.type) {
    // If the types are different, replace the old VNode with the new VNode
    parentDom?.replaceChild(
      createDomElement(newVNode),
      parentDom.childNodes[index]
    );
  } else {
    // If the types are the same, update the props and reconcile the children
    updateProps(
      parentDom.childNodes[index] as HTMLElement,
      oldVNode.props,
      newVNode.props
    );
    reconcileChildren(
      parentDom.childNodes[index] as HTMLElement,
      oldVNode.children,
      newVNode.children
    );
  }
}

// Helper function to create a DOM element from a VNode
function createDomElement(vnode: VNode | string): Node {
  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  }

  const { type, props, children } = vnode;

  if (typeof type === "function") {
    // If type is a function (component), call it to get the VNode and render it
    return createDomElement(type(props));
  }

  const element = document.createElement(type);

  // Set the element's properties and attributes
  if (props) {
    setProps(element, props);
  }

  // Recursively render the children into the newly created element
  children
    .filter((child) => Boolean(child))
    .forEach((child) => element.appendChild(createDomElement(child)));

  return element;
}

// Function to set properties and attributes on a DOM element
function setProps(element: HTMLElement, props: { [key: string]: any }) {
  Object.keys(props).forEach((key) => {
    if (key.startsWith("on") && typeof props[key] === "function") {
      // Add event listeners (e.g., onclick, oninput)
      element.addEventListener(key.substring(2).toLowerCase(), props[key]);
    } else {
      // Set attributes (e.g., id, className)
      element.setAttribute(key, props[key]);
    }
  });
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
    currentIndex = 0; // Reset the state index
    const newVNode = rootComponent();
    reconcile(container, prevVNode, newVNode);
    prevVNode = newVNode; // Update the previous VNode
  }
}

// Helper function to update props on a DOM element
function updateProps(dom: HTMLElement, oldProps: any, newProps: any) {
  // Remove old or changed event listeners
  for (const name in oldProps) {
    if (name.startsWith("on") && typeof oldProps[name] === "function") {
      dom.removeEventListener(name.substring(2).toLowerCase(), oldProps[name]);
    } else if (!(name in newProps)) {
      dom.removeAttribute(name);
    }
  }
  // Add new or changed props
  for (const name in newProps) {
    if (name.startsWith("on") && typeof newProps[name] === "function") {
      dom.addEventListener(name.substring(2).toLowerCase(), newProps[name]);
    } else if (oldProps[name] !== newProps[name]) {
      dom.setAttribute(name, newProps[name]);
    }
  }
}

// Helper function to reconcile children
function reconcileChildren(
  dom: HTMLElement,
  oldChildren: (VNode | string)[],
  newChildren: (VNode | string)[]
) {
  const max = Math.max(oldChildren.length, newChildren.length);
  for (let i = 0; i < max; i++) {
    reconcile(dom, oldChildren[i], newChildren[i], i);
  }
}

// Export the MyReact object
export default MyReact;
