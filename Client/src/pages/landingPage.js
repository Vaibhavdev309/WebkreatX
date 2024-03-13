// faq accordian

let accordion = document.querySelector(".accordion");
let accordionItems = accordion.querySelectorAll(".item");

for (let i = 0; i < accordionItems.length; i++) {
  let questionItem = accordionItems[i].querySelector(".question");
  questionItem.addEventListener("click", function () {
    if (accordionItems[i].classList.contains("active")) {
      accordionItems[i].classList.remove("active");
    } else {
      try {
        accordion.querySelector(".active").classList.remove("active");
      } catch (msg) {}
      accordionItems[i].classList.add("active");
    }
  });
}

//profile section

const items = document.querySelectorAll(".gaitem");
let imageURLs = ["ayush.jpeg", "kushagra.jpeg", "ayush.jpeg", "kushagra.jpeg"];

let deviceType = "";
let events = {
  mouse: {
    start: "mouseover",
    end: "mouseout",
  },
  touch: {
    start: "touchstart",
    end: "touchend",
  },
};
const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};
isTouchDevice();
items.forEach((gaitem, index) => {
  let img = document.createElement("img");
  img.setAttribute("src", imageURLs[index]);
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  gaitem.appendChild(img);
  
  gaitem.style.flex = "1";
  gaitem.style.transition = "flex 0.8s ease";
  gaitem.addEventListener(events[deviceType].start, () => {
    gaitem.style.flex = "1.8"; 
  });
  gaitem.addEventListener(events[deviceType].end, () => {
    gaitem.style.flex = "1"; 
  });
});
