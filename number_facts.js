// *******************************************************************************************
// NUMBER FACTS STEP ONE: GET A SINGLE FACT ABOUT YOUR FAVROITE NUMBER

// Select our ul on our page...
const factList = document.getElementById("number_facts_ul");

function getSinglePromise(url) {
  const request = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    request.onload = () => {
      if (request.readyState !== 4) return;

      if (request.status >= 200 && request.status < 300) {
        resolve({
          data: JSON.parse(request.response),
          status: request.status,
          request: request,
        });
      } else {
        reject({
          msg: "SERVER ERROR!",
          status: request.status,
          request: request,
        });
      }
    };

    request.onerror = function handleError() {
      request = null;
      reject({
        msg: "NETWORK ERROR!",
      });
    };

    request.open("GET", url);

    request.send();
  });
}

// TOGGLE COMMENT ON/OFF FUNCTION CALL BELOW TO SEE/HIDE RESULT.

getSinglePromise("http://numbersapi.com/22/trivia?json")
  .then((res) => {
    let li = document.createElement("li");
    li.append(`${res.data.text}`);
    factList.append(li);
  })
  .catch((err) => console.log(err));

// *******************************************************************************************
// NUMBER FACTS STEP TWO: GET DATA ON MULTIPLE NUMBERS IN A SINGLE REQUEST

function getMultiplePromises(arr) {
  let allPromises = [];
  for (let i = 0; i <= arr.length - 1; i++) {
    allPromises.push(
      getSinglePromise(`http://numbersapi.com/${arr[i]}/trivia?json`)
    );
  }
  Promise.all(allPromises)
    .then((res) => {
      for (let i = 0; i <= res.length - 1; i++) {
        let li = document.createElement("li");
        li.append(`${res[i].data.text}`);
        factList.append(li);
      }
    })
    .catch((err) => console.log(err));
}

// TOGGLE COMMENT ON/OFF FUNCTION CALL BELOW TO SEE/HIDE RESULT.

// getMultiplePromises([22, 45, 54, 68]);

// *******************************************************************************************
// NUMBER FACTS STEP THREE: GET 4 FACTS ON YOUR FAVORITE NUMBER AND DISPLAY THEM ON THE PAGE

function getNumFacts(num, quantity) {
  let allPromises = [];
  for (let i = 1; i <= quantity; i++) {
    allPromises.push(
      getSinglePromise(`http://numbersapi.com/${num}/trivia?json`)
    );
  }
  Promise.all(allPromises)
    .then((res) => {
      for (let i = 0; i <= res.length - 1; i++) {
        let li = document.createElement("li");
        li.append(`${res[i].data.text}`);
        factList.append(li);
      }
    })
    .catch((err) => console.log(err));
}

// TOGGLE COMMENT ON/OFF FUNCTION CALL BELOW TO SEE/HIDE RESULT.

// getNumFacts(22, 4);
