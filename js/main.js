import { SendMail } from "./components/mailer.js";

(() => {
    const { createApp } = Vue

    let overlay = document.querySelector(".shape-overlays");
    let clicky = document.querySelector(".clicky");
let paths = document.querySelectorAll(".shape-overlays__path");

let numPoints = 10;
let numPaths = paths.length;
let delayPointsMax = 0.3;
let delayPerPath = 0.25;
let duration = 0.9;
let isOpened = false;
let pointsDelay = [];
let allPoints = [];

let tl = gsap.timeline({ 
  onUpdate: render,
  defaults: {
    ease: "power2.inOut",
    duration: 0.9
  }
});

for (let i = 0; i < numPaths; i++) {
  let points = [];
  allPoints.push(points);
  for (let j = 0; j < numPoints; j++) {
    points.push(100);
  }
}

clicky.addEventListener("click", onClick);
toggle();

function onClick() {
  
  if (!tl.isActive()) {
    isOpened = !isOpened;
    toggle();
  }
}

function toggle() {
    
  tl.progress(0).clear();
  
  for (let i = 0; i < numPoints; i++) {
    pointsDelay[i] = Math.random() * delayPointsMax;
  }
  
  for (let i = 0; i < numPaths; i++) {
    let points = allPoints[i];
    let pathDelay = delayPerPath * (isOpened ? i : (numPaths - i - 1));
        
    for (let j = 0; j < numPoints; j++) {      
      let delay = pointsDelay[j];      
      tl.to(points, {
        [j]: 0
      }, delay + pathDelay);
    }
  }
}

function render() {
  
  for (let i = 0; i < numPaths; i++) {
    let path = paths[i];
    let points = allPoints[i];
    
    let d = "";
    d += isOpened ? `M 0 0 V ${points[0]} C` : `M 0 ${points[0]} C`;
    
    for (let j = 0; j < numPoints - 1; j++) {
      
      let p = (j + 1) / (numPoints - 1) * 100;
      let cp = p - (1 / (numPoints - 1) * 100) / 2;
      d += ` ${cp} ${points[j]} ${cp} ${points[j+1]} ${p} ${points[j+1]}`;
    }
    
    d += isOpened ? ` V 100 H 0` : ` V 0 H 0`;
    path.setAttribute("d", d)
  }  
}

    createApp({
        data() {
            return {
                message: 'Hello Vue!'
            }
        },

        methods: {
            processMailFailure(result) {
                this.$refs.emailMessage.style.display = "block";
                this.$refs.emailMessage.innerHTML = "";
                this.$refs.emailMessage.innerHTML = "Ruh Roh Raggy, An error has occured";
                console.log(result)
            },

            processMailSuccess(result) {
                this.$refs.emailMessage.style.display = "block";
                this.$refs.emailMessage.innerHTML = "";
                this.$refs.emailMessage.innerHTML = "Great Success! Your email has been sent. I will replay to you shortly :)";
                console.log(result)
            },

            processMail(event) {    
                // use the SendMail component to process mail
                SendMail(this.$el.parentNode)
                    .then(data => this.processMailSuccess(data))
                    .catch(err => this.processMailFailure(err));
            }
        }
    }).mount('#mail-form')
})();