console.log("welcome.js !");

function fetchData() {
  return new Promise((resolve, reject) => {
    const success = Math.random() > 0.5;

    setTimeout(() => {
      if (success) {
        resolve("Success");
      } else {
        reject(new Error("Error when fetchingData"));
      }
    }, 1000);
  });
}

fetchData()
  .then((data) => {
    console.log("Result :", data);
  })
  .catch((error) => {
    console.error("Error :", error.message);
  })
  .finally(() => {
    console.log("End of fetch");
  });
