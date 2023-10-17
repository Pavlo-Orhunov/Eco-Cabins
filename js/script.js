"use strict"

window.addEventListener("load", windowLoad)

function windowLoad() {
  if (document.querySelector(".materials__slider")) {
    const swiper = new Swiper(".materials__slider", {
      speed: 500,
      loop: true,
      autoplay: {
        delay: 3000,
      },
      spaceBetween: 10,
      breakpoints: {
        600: {
          spaceBetween: 0,
        },
      },
      // If we need pagination
      pagination: {
        el: ".materials__pagination",
      },
    })
  }
}

// ------------- Preloader -------------
document.addEventListener("DOMContentLoaded", function () {
  var preloader = document.getElementById("preloader")
  setTimeout(function () {
    preloader.style.opacity = "0"
  }, 500)
  preloader.addEventListener("transitionend", function () {
    preloader.style.display = "none"
  })
})
// ------------- END OF Preloader -------------

// ------------- hamburger menu -------------
const iconMenu = document.querySelector(".icon-menu")
const menuBody = document.querySelector(".menu__body")
const menuLinks = document.querySelectorAll(".menu__link")

if (iconMenu) {
  iconMenu.addEventListener("click", function (e) {
    toggleMenu()
  })

  //event handlers for menu items
  menuLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      if (iconMenu.classList.contains("_active")) {
        toggleMenu()
      }
    })
  })

  // toggle menu function
  function toggleMenu() {
    document.body.classList.toggle("body--lock")
    iconMenu.classList.toggle("_active")
    menuBody.classList.toggle("_active")
  }

  // close hamburger menu on device rotating
  window.addEventListener("orientationchange", function () {
    if (document.body.classList.contains("body--lock")) {
      document.body.classList.remove("body--lock")
    }
    if (iconMenu.classList.contains("_active")) {
      iconMenu.classList.remove("_active")
    }
    if (menuBody.classList.contains("_active")) {
      menuBody.classList.remove("_active")
    }
  })
}
// ------------- END OF hamburger menu -------------

// ------------- shrinking header on scroll -------------
// Get the header element
const headerElement = document.querySelector(".header")

// Define the callback function for the IntersectionObserver
const callback = function (entries, observer) {
  if (entries[0].isIntersecting) {
    headerElement.classList.remove("header--scrolled")
  } else {
    headerElement.classList.add("header--scrolled")
  }
}

// Create an IntersectionObserver instance with the callback function
const headerObserver = new IntersectionObserver(callback)

// Add error handling in case the header element is not found
if (headerElement) {
  // Observe the header element for changes
  headerObserver.observe(headerElement)
} else {
  console.error("Header element not found.")
}
// ------------- END OF shrinking header on scroll -------------

// ------------- Moving Elements -------------
// Function to move elements based on attributes data-original-container, data-target-container, and data-max-width
function moveElements() {
  const elementsToMove = document.querySelectorAll("[data-original-container]")

  elementsToMove.forEach((element) => {
    const originalContainerName = element.getAttribute(
      "data-original-container"
    )
    const targetContainerName = element.getAttribute("data-target-container")
    const originalContainer = document.querySelector(
      `.${originalContainerName}`
    )

    // Checking for a value in an attribute data-target-container
    if (targetContainerName) {
      const targetContainer = document.querySelector(`.${targetContainerName}`)
      const maxWidthAttr = element.getAttribute("data-max-width")

      if (originalContainer && targetContainer && maxWidthAttr) {
        const maxWidth = parseFloat(maxWidthAttr)

        if (window.innerWidth <= maxWidth) {
          // Move element to target container if width is less than or equal to data-max-width
          targetContainer.appendChild(element)
        } else {
          // Return the element to its place if the width is greater than data-max-width
          originalContainer.appendChild(element)
        }
      }
    } else {
      // If the data-target-container attribute is not specified, leave the element in its place
      console.warn(
        `Warning: data-target-container attribute is missing for the element with data-original-container="${originalContainerName}".`
      )
    }
  })
}

// Call the function on DOMContentLoaded and window resize
document.addEventListener("DOMContentLoaded", moveElements)
window.addEventListener("resize", moveElements)
// ------------- END OF Moving Elements -------------

// ------------- Popup windows -------------
// Define variables
const popupLinks = document.querySelectorAll(".popup-link")
const popupCloseIcon = document.querySelectorAll(".close-popup")
const lockPadding = document.querySelectorAll(".lock-padding")
const body = document.querySelector("body")
const timeout = 500

let unlock = true

if (popupLinks.length > 0) {
  for (let index = 0; index < popupLinks.length; index++) {
    const popupLink = popupLinks[index]
    popupLink.addEventListener("click", function (e) {
      const popupName = popupLink.getAttribute("href").replace("#", "")
      const curentPopup = document.getElementById(popupName)
      popupOpen(curentPopup)
      e.preventDefault()
    })
  }
}

if (popupCloseIcon.length > 0) {
  for (let index = 0; index < popupCloseIcon.length; index++) {
    const el = popupCloseIcon[index]
    el.addEventListener("click", function (e) {
      popupClose(el.closest(".popup"))
      e.preventDefault()
    })
  }
}

function popupOpen(curentPopup) {
  if (curentPopup && unlock) {
    const popupActive = document.querySelector(".popup.open")
    if (popupActive) {
      popupClose(popupActive, false)
    } else {
      bodyLock()
    }
    curentPopup.classList.add("open")
    curentPopup.addEventListener("click", function (e) {
      if (!e.target.closest(".popup__content")) {
        popupClose(e.target.closest(".popup"))
      }
    })
  }
}

function popupClose(popupActive, doUnlock = true) {
  if (unlock) {
    const videoContainers = popupActive.querySelectorAll("video")
    if (videoContainers.length > 0) {
      videoContainers.forEach((video) => {
        video.pause()
      })
    }

    const iframes = popupActive.querySelectorAll("iframe")
    iframes.forEach((iframe) => {
      const src = iframe.getAttribute("src")
      if (src.includes("youtube.com") || src.includes("player.vimeo.com")) {
        iframe.src = src
      }
    })

    popupActive.classList.remove("open")
    if (doUnlock) {
      bodyUnLock()
    }
  }
}

function bodyLock() {
  const lockPaddingValue =
    window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px"

  if (lockPadding.length > 0) {
    for (let index = 0; index < lockPadding.length; index++) {
      const el = lockPadding[index]
      el.style.paddingRight = lockPaddingValue
    }
  }
  body.style.paddingRight = lockPaddingValue
  body.classList.add("body--lock")

  unlock = false
  setTimeout(function () {
    unlock = true
  }, timeout)
}

function bodyUnLock() {
  setTimeout(function () {
    if (lockPadding.length > 0) {
      for (let index = 0; index < lockPadding.length; index++) {
        const el = lockPadding[index]
        el.style.paddingRight = "0px"
      }
    }
    body.style.paddingRight = "0px"
    body.classList.remove("body--lock")
  }, timeout)

  unlock = false
  setTimeout(function () {
    unlock = true
  }, timeout)
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.code === "Escape") {
    const popupActive = document.querySelector(".popup.open")
    if (popupActive) {
      popupClose(popupActive)
    }
  }
})
;(function () {
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (css) {
      var node = this
      while (node) {
        if (node.matches(css)) return node
        else node = node.parentElement
      }
      return null
    }
  }
})()
;(function () {
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector
  }
})()
// ------------- END OF Popup windows -------------

// ---------- translation (localization) ---------------
let languageData

fetch("languages.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    return response.json()
  })
  .then((data) => {
    languageData = data
    switchLanguage()
  })
  .catch((error) => {
    console.error("Fetch error:", error)
  })

function switchLanguage() {
  const selectElement = document.getElementById("lng-select")
  const selectedLanguage = selectElement.value

  const elementsWithDataAttr = document.querySelectorAll("[data-tr]")
  elementsWithDataAttr.forEach((element) => {
    const dataAttr = element.getAttribute("data-tr")
    element.textContent = languageData[selectedLanguage][dataAttr]
  })
}
// ---------- END OF translation (localization) ---------------
