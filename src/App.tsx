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

const Input = (props: any) => {
  console.log("Input");
  const [value, setValue] = MyReact.useState("");
  const onChange = (e: any) => {
    setValue(e.target.value);
  };

  return MyReact.createElement("input", {
    value: value,
    oninput: onChange, // Use oninput instead of onchange
    onblur: () => {
      //   console.log("blur happened");
    },
  });
};

const Greeting = () => {
  console.log("greeting");
  return MyReact.createElement(
    "div",
    null,
    Input(null)
    // value ? MyReact.createElement("div", null, `Hi, ${value}`) : null
  );
};

// Define the App component
function App() {
  console.log("app render");
  const [count, setCount] = MyReact.useState(1); // Use the useState hook to manage a count state variable

  const increment = function () {
    return setCount(count + 1);
  };

  // Return the virtual DOM structure for the App component
  return MyReact.createElement(
    "div",
    null,
    Header({ count }),
    Button({ onClick: increment }),
    Greeting(null)
  );
}

// Export the App component
export default App;
