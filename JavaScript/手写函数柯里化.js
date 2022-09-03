function add(x) {
  return (y) => {
    console.log("x + y", x + y);
    return x + y;
  };
}

const addBase10 = add(10);

addBase10(5);
addBase10(10);
addBase10(15);
