import MyReact from "./MyReact"; // Import the custom React-like framework

const Header = (props: any) => {
  return MyReact.createElement("h1", null, `Count: ${props.count}`); // Display the count
};

const Button = (props: any) => {
  return MyReact.createElement(
    "button",
    { onclick: props.onClick },
    "Increment"
  ); // Button to increment the count
};

// Define the App component
function App() {
  const [count, setCount] = MyReact.useState(0); // Use the useState hook to manage a count state variable

  const increment = () => setCount(count + 1);

  // Return the virtual DOM structure for the App component
  return MyReact.createElement(
    "div",
    null,
    Header({ count }),
    Button({ onClick: increment })
  );
}

// Export the App component
export default App;
