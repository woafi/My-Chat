// toastify.js

const version = "1.11.0";

const defaults = {
  oldestFirst: true,
  text: "Toastify is awesome!",
  node: undefined,
  duration: 3000,
  selector: undefined,
  callback: function () {},
  destination: undefined,
  newWindow: false,
  close: false,
  gravity: "toastify-top",
  positionLeft: false,
  position: '',
  backgroundColor: '',
  avatar: "",
  className: "",
  stopOnFocus: true,
  onClick: function () {},
  offset: { x: 0, y: 0 },
  escapeMarkup: true,
  style: { background: '' }
};

function getAxisOffset(axis, options) {
  const val = options.offset[axis];
  return isNaN(val) ? val : `${val}px`;
}

function containsClass(elem, yourClass) {
  if (!elem || typeof yourClass !== "string") return false;
  return elem.className?.trim().split(/\s+/gi).includes(yourClass);
}

function reposition() {
  const topLeftOffsetSize = { top: 15, bottom: 15 };
  const topRightOffsetSize = { top: 15, bottom: 15 };
  const offsetSize = { top: 15, bottom: 15 };
  const allToasts = document.getElementsByClassName("toastify");

  for (let i = 0; i < allToasts.length; i++) {
    let toast = allToasts[i];
    let gravity = containsClass(toast, "toastify-top") ? "top" : "bottom";
    let classUsed = `toastify-${gravity}`;
    let height = toast.offsetHeight;
    let offset = 15;
    let width = window.innerWidth || screen.width;

    if (width <= 360) {
      toast.style[gravity] = offsetSize[gravity] + "px";
      offsetSize[gravity] += height + offset;
    } else if (containsClass(toast, "toastify-left")) {
      toast.style[gravity] = topLeftOffsetSize[gravity] + "px";
      topLeftOffsetSize[gravity] += height + offset;
    } else {
      toast.style[gravity] = topRightOffsetSize[gravity] + "px";
      topRightOffsetSize[gravity] += height + offset;
    }
  }
}

function buildToast(options) {
  const div = document.createElement("div");
  div.className = "toastify on " + options.className;

  if (options.position) {
    div.className += ` toastify-${options.position}`;
  } else if (options.positionLeft) {
    div.className += " toastify-left";
    console.warn('Property `positionLeft` is deprecated. Use `position` instead.');
  } else {
    div.className += " toastify-right";
  }

  div.className += ` ${options.gravity}`;

  for (const prop in options.style) {
    div.style[prop] = options.style[prop];
  }

  if (options.node && options.node.nodeType === Node.ELEMENT_NODE) {
    div.appendChild(options.node);
  } else {
    div[options.escapeMarkup ? "innerText" : "innerHTML"] = options.text;

    if (options.avatar) {
      const img = document.createElement("img");
      img.src = options.avatar;
      img.className = "toastify-avatar";
      (options.position === "left" || options.positionLeft)
        ? div.appendChild(img)
        : div.insertAdjacentElement("afterbegin", img);
    }
  }

  if (options.close) {
    const close = document.createElement("span");
    close.innerHTML = "&#10006;";
    close.className = "toast-close";

    close.addEventListener("click", (e) => {
      e.stopPropagation();
      removeElement(div, options);
      clearTimeout(div.timeOutValue);
    });

    const width = window.innerWidth || screen.width;
    (options.position === "left" && width > 360)
      ? div.insertAdjacentElement("afterbegin", close)
      : div.appendChild(close);
  }

  if (options.stopOnFocus && options.duration > 0) {
    div.addEventListener("mouseover", () => clearTimeout(div.timeOutValue));
    div.addEventListener("mouseleave", () => {
      div.timeOutValue = setTimeout(() => removeElement(div, options), options.duration);
    });
  }

  if (options.destination) {
    div.addEventListener("click", (e) => {
      e.stopPropagation();
      options.newWindow
        ? window.open(options.destination, "_blank")
        : window.location = options.destination;
    });
  } else if (typeof options.onClick === "function") {
    div.addEventListener("click", (e) => {
      e.stopPropagation();
      options.onClick();
    });
  }

  if (typeof options.offset === "object") {
    const x = getAxisOffset("x", options);
    const y = getAxisOffset("y", options);
    const xOffset = options.position === "left" ? x : `-${x}`;
    const yOffset = options.gravity === "toastify-top" ? y : `-${y}`;
    div.style.transform = `translate(${xOffset},${yOffset})`;
  }

  return div;
}

function removeElement(el, options) {
  el.className = el.className.replace(" on", "");
  setTimeout(() => {
    if (options.node?.parentNode) {
      options.node.parentNode.removeChild(options.node);
    }
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
    options.callback.call(el);
    reposition();
  }, 400);
}

/**
 * Main exported function: showToast
 * @param {Object} opts - Toast options
 */
export default function showToast(opts = {}) {
  const options = {
    ...defaults,
    ...opts,
    style: { ...defaults.style, ...(opts.style || {}) },
    offset: { ...defaults.offset, ...(opts.offset || {}) },
    backgroundColor: opts.backgroundColor || defaults.backgroundColor,
  };

  options.style.background = options.backgroundColor || options.style.background;

  const toast = buildToast(options);

  const root = typeof options.selector === "string"
    ? document.getElementById(options.selector)
    : options.selector instanceof HTMLElement || options.selector instanceof ShadowRoot
      ? options.selector
      : document.body;

  if (!root) throw "Root element is not defined";

  const insertAt = defaults.oldestFirst ? root.firstChild : null;
  root.insertBefore(toast, insertAt);

  reposition();

  if (options.duration > 0) {
    toast.timeOutValue = setTimeout(() => removeElement(toast, options), options.duration);
  }

  return toast;
}

//Example usage 
// import showToast from './toastify.js';

// showToast({
//   text: "Hello, this is a toast!",
//   duration: 4000,
//   backgroundColor: "#333",
//   position: "right",
//   gravity: "toastify-top",
//   close: true,
//   onClick: () => alert("Toast clicked!")
// });
