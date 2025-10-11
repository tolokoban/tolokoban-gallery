/**
 * @param {string} id
 * @returns {HTMLElement}
 */
function get(id) {
  const elem = document.getElementById(id);
  if (!elem) throw new Error(`Unable to find element with id "${id}"!`);

  return elem;
}

/**
 * @param {string} tagName
 * @param  {...any} rest
 * @returns {HTMLElement}
 */
function dom(tagName, ...rest) {
  const elem = document.createElement(tagName);
  for (const opt of rest) {
    if (Array.isArray(opt)) {
      for (const child of opt) elem.appendChild(child);
    } else if (opt && typeof opt === "object") {
      for (const key of Object.keys(opt)) {
        elem.setAttribute(key, opt[key]);
      }
    } else {
      elem.textContent = `${opt}`;
    }
  }
  return elem;
}

/**
 *
 * @param {string} name
 * @returns
 */
function createThumbnail(name) {
  const a = dom(
    "a",
    {
      href: `img/${name}.webp`,
      title: `${name}`,
      style: `--src:url(img/${name}.thumbnail.webp);width:${Math.floor(240 + 240 * Math.random())}px`,
    },
    [
      dom(
        "div",
        `20${name.slice(0, 2)} / ${name.slice(2, 4)} / ${name.slice(4, 6)}`,
      ),
    ],
  );
  return a;
}

function start() {
  const root = get("root");
  for (const name of L) {
    root.appendChild(createThumbnail(name));
  }
  get("tgd-logo").style.opacity = "0";
}
