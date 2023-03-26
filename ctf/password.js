submitBtn = document.getElementById("submitBtn");
passwordInput = document.getElementById("passwordInput");
var squeak = new Audio('squeak.mp3');
var light_squeak = new Audio('light_squeak.mp3');
var normal_squeak = new Audio('normal_squeak.mp3');
var quacking = new Audio('quacking.mp3');
var access = new Audio('access-granted.mp3')


passwordInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("submitBtn").click();
    }
  });

async function decrypt(ciphertext, password) {
    const pwUtf8 = new TextEncoder().encode(password);                                 // encode password as UTF-8
    const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8);                      // hash the password

    const ivStr = atob(ciphertext).slice(0,12);                                        // decode base64 iv
    const iv = new Uint8Array(Array.from(ivStr).map(ch => ch.charCodeAt(0)));          // iv as Uint8Array

    const alg = { name: 'AES-GCM', iv: iv };                                           // specify algorithm to use

    const key = await crypto.subtle.importKey('raw', pwHash, alg, false, ['decrypt']); // generate key from pw

    const ctStr = atob(ciphertext).slice(12);                                          // decode base64 ciphertext
    const ctUint8 = new Uint8Array(Array.from(ctStr).map(ch => ch.charCodeAt(0)));     // ciphertext as Uint8Array

    try {
        const plainBuffer = await crypto.subtle.decrypt(alg, key, ctUint8);            // decrypt ciphertext using key
        const plaintext = new TextDecoder().decode(plainBuffer);                       // plaintext from ArrayBuffer
        return plaintext;                                                              // return the plaintext
    } catch (e) {
        throw new Error('Decrypt failed');
    }
}

var intervalID = window.setInterval(updateScreen, 200);
var terminal = document.getElementById("terminal");
const msg = document.querySelector(".msg");

var txt = [
  "FORCE: XX0022. ENCYPT://000.222.2345",
  "TRYPASS: ********* AUTH CODE: ALPHA GAMMA: 1___ PRIORITY 1",
  "RETRY: STEFFI IS AWESOME",
  "Z:> /JELLY/GAMES/OVERWATCH_2/ EXECUTE -PLAYERS 0",
  "================================================",
  "Priority 1 // local / scanning...",
  "scanning ports...",
  "BACKDOOR FOUND (23.45.23.12.00000000)",
  "BACKDOOR FOUND (13.66.23.12.00110000)",
  "BACKDOOR FOUND (13.66.23.12.00110044)",
  "...",
  "...",
  "BRUTE.EXE -r -z",
  "...locating vulnerabilities...",
  "...vulnerabilities found...",
  "MCP/> DEPLOY CLU",
  "SCAN: __ 0100.0000.0554.0080",
  "SCAN: __ 0020.0000.0553.0080",
  "SCAN: __ 0001.0000.0554.0550",
  "SCAN: __ 0012.0000.0553.0030",
  "SCAN: __ 0100.0000.0554.0080",
  "SCAN: __ 0020.0000.0553.0080",
]

var docfrag = document.createDocumentFragment();

function updateScreen() {
  //Shuffle the "txt" array
  txt.push(txt.shift());
  //Rebuild document fragment
  txt.forEach(function(e) {
    var p = document.createElement("p");
    p.textContent = e;
    docfrag.appendChild(p);
  });
  //Clear DOM body
  while (terminal.firstChild) {
    terminal.removeChild(terminal.firstChild);
  }
  terminal.appendChild(docfrag);
}

var beep = document.getElementById("beep")

var interval;
function initiateLockdown() {
    interval = setInterval(function() {
        squeak.play();
        light_squeak.play();
        normal_squeak.play();
        quacking.play();
    }, 0); 
}

async function revealFlag() {
    var flag = await decrypt("hKykluuZGIuas8qG8vNvIBUSRdJsA+A6uabQIAnAekSSHcDrkc42yw==", passwordInput.value)
    console.log(flag)
    msg.style.background = "limegreen";
    msg.innerHTML = "ACCESS GRANTED";
    msg.style.boxShadow = "0 0 30px limegreen";
    terminal.style.display = "none";
    beep.style.visibility = "visible"
    clearInterval(interval);
    access.play();
}
