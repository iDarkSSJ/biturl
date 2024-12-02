"user strict"

const $main = document.querySelector("main")
const $switchBtn = document.getElementById("switch")
const $urlsHistoryBtn = document.getElementById("urls-history-btn")

const MODES = {
  NORMAL: "normal",
  CUSTOM: "custom",
}
let mode = MODES.NORMAL
let urlsHistory

const formClasses = ["custom-shortener", "max-w-[690px]", "box"]
const innerDivClasses = [
  "flex",
  "text-xl",
  "flex-col",
  "sm:flex-row",
  "gap-2.5",
  "sm:gap-0",
]

const createElement = (
  type,
  classes = [],
  attributes = {},
  textContent = ""
) => {
  const element = document.createElement(type)
  element.classList.add(...classes)

  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value)
  }

  if (textContent) {
    element.textContent = textContent
  }
  return element
}

const fetchUrl = async (link, hash, key) => {
  const url =
    mode === MODES.CUSTOM
      ? "https://biturl.idark.link/create-custom"
      : "https://biturl.idark.link/create"

  const result = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      link,
      key,
      hash,
    }),
  })

  const data = await result.json()
  return data
}

const urlOnSubmit = async (value, hash = "", key = "") => {
  const $error = document.querySelector(".error")
  const $box = document.querySelector(".box")
  const data = await fetchUrl(value, hash, key)
  if (!data.hash) {
    $error.textContent = data.error
    return
  }
  const link = `https://biturl.idark.link/q/${data.hash}`
  // add link to the urlsHistory
  urlsHistory.unshift({
    url: link,
    longLink: data.urlData[0].link,
    created_at: data.urlData[0].created_at,
  })
  localStorage.setItem("urlsHistory", JSON.stringify(urlsHistory))
  $box.remove()
  createOutputUrl(link, value)
}

const createAsideBox = (urlHistoryFragment) => {
  const fragment = document.createDocumentFragment()
  const section = createElement(
    "section",
    ["w-full", "h-dvh", "top-0", "absolute", "overflow-hidden"],
    { id: "aside-container" }
  )

  const backdrop = createElement("div", [
    "aside-backdrop",
    "w-full",
    "h-full",
    "absolute",
    "top-0",
    "backdrop-brightness-50",
    "animate-fadeIn",
  ])
  const aside = createElement("aside", [
    "aside",
    "animate-toLeft",
    "absolute",
    "top-0",
    "-right-full",
    "w-full",
    "sm:w-[633px]",
    "bg-[#121822]",
    "h-dvh",
    "flex",
    "flex-col",
  ])

  const header = createElement("div", [
    "w-full",
    "p-5",
    "text-xl",
    "flex",
    "justify-between",
    "items-center",
    "border-b-2",
    "border-gray-700",
  ])
  const title = createElement("span", [], {}, "Your BitURLs")
  const btn = createElement(
    "button",
    [
      "border-gray-500",
      "border-2",
      "rounded-lg",
      "w-10",
      "h-10",
      "flex",
      "justify-center",
      "items-center",
      "hover:bg-slate-500",
      "transition-colors",
    ],
    { id: "close-history-btn" }
  )
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>`

  const URLsBox = createElement("div", [
    "aside-urls-box",
    "p-5",
    "pt-2",
    "flex",
    "flex-col",
    "gap-4",
    "overflow-auto",
    "h-full",
    "custom-scrollbar",
  ])

  header.append(title, btn)
  if (urlHistoryFragment) URLsBox.append(urlHistoryFragment)
  aside.append(header, URLsBox)
  section.append(backdrop, aside)
  fragment.append(section)
  document.body.append(fragment)

  const closeAside = () => {
    const $asideContainer = document.getElementById("aside-container")
    const $backdrop = document.querySelector(".aside-backdrop")
    const $aside = document.querySelector(".aside")
    $backdrop.classList.add("animate-fadeOut")
    $aside.classList.add("animate-toRight")
    setTimeout(() => {
      $asideContainer.remove()
    }, 400)
  }

  btn.addEventListener("click", () => closeAside())
  backdrop.addEventListener("click", (e) => {
    if (!e.target.contains(aside)) {
      closeAside()
    }
  })
}

const addUrlHistorySingleBox = (url, longLink, date) => {
  const fragment = document.createDocumentFragment()

  const div = createElement("div", ["flex", "flex-col", "gap-4"])

  const flex = createElement("div", [
    "flex",
    "flex-col",
    "border-gray-300/20",
    "border-2",
    "p-3",
  ])
  const span = createElement(
    "span",
    ["text-lg", "whitespace-nowrap", "overflow-hidden", "text-ellipsis"],
    {},
    url
  )
  const a = createElement(
    "a",
    ["link", "whitespace-nowrap", "overflow-hidden", "text-ellipsis"],
    { href: longLink },
    longLink
  )
  const div2 = createElement("div", [
    "flex",
    "justify-between",
    "items-end",
    "m-1",
  ])

  const btn = createElement("button", [
    "flex",
    "gap-1",
    "rounded-md",
    "p-2",
    "w-fit",
    "bg-sky-500/90",
    "hover:bg-sky-400/90",
    "transition-colors",
  ])
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><g fill="none"><path fill="currentColor" fill-opacity=".16" d="M12.6 3H5.4A2.4 2.4 0 0 0 3 5.4v7.2A2.4 2.4 0 0 0 5.4 15h7.2a2.4 2.4 0 0 0 2.4-2.4V5.4A2.4 2.4 0 0 0 12.6 3"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M18 9h.6c1.33 0 2.4 1.07 2.4 2.4v7.2c0 1.33-1.07 2.4-2.4 2.4h-7.2C10.07 21 9 19.93 9 18.6V18M5.4 3h7.2A2.4 2.4 0 0 1 15 5.4v7.2a2.4 2.4 0 0 1-2.4 2.4H5.4A2.4 2.4 0 0 1 3 12.6V5.4A2.4 2.4 0 0 1 5.4 3"/></g></svg>Copy`
  const dateSpan = createElement(
    "span",
    ["text-gray-400"],
    {},
    formatDate(date)
  )

  flex.append(span, a, div2)
  div2.append(btn, dateSpan)
  div.append(flex)
  fragment.append(div)

  btn.addEventListener("click", () => {
    copyToClipboard(url)
  })

  return fragment
}

const createCustomUrlForm = () => {
  const fragment = document.createDocumentFragment()
  const form = createElement("form", formClasses)
  const h3 = createElement("h3", [], {}, "Paste the URL to be shortened")
  const wrapperDiv1 = createElement("div", [
    "flex",
    "text-xl",
    "flex-col",
    "gap-3",
  ])
  const urlInput = createElement("input", ["input-short"], {
    id: "custom-url-input",
    type: "text",
    placeholder: "Must include http(s)://",
    autocomplete: "off",
    required: "true",
  })
  const wrapperDiv2 = createElement("div", [
    "flex",
    "gap-3",
    "flex-col",
    "sm:flex-row",
  ])
  const hashInput = createElement("input", ["input-short"], {
    id: "custom-hash-input",
    type: "text",
    placeholder: "Link Hash",
    autocomplete: "off",
    required: "true",
  })
  const keyInput = createElement("input", ["input-short"], {
    id: "custom-key-input",
    type: "password",
    placeholder: "Auth key",
    autocomplete: "off",
    required: "true",
  })
  const btn = createElement("button", ["btn"], {}, "Shorten")

  const error = createElement("p", ["error", "text-red-400"])

  wrapperDiv2.append(hashInput, keyInput)
  wrapperDiv1.append(urlInput, wrapperDiv2, btn)
  form.append(h3, wrapperDiv1, error)
  fragment.append(form)
  $main.append(fragment)

  form.addEventListener("submit", (e) => {
    e.preventDefault()
    urlOnSubmit(urlInput.value, hashInput.value, keyInput.value)
  })
}

const createNormalUrlForm = () => {
  const fragment = document.createDocumentFragment()

  const form = createElement("form", [
    "normal-shortener",
    "max-w-[690px]",
    "box",
  ])
  const h3 = createElement("h3", [], {}, "Paste the URL to be shortened")
  const wrapperDiv = createElement("div", innerDivClasses)
  const urlInput = createElement(
    "input",
    ["input-short", "sm:rounded-r-none", "sm:border-r-0"],
    {
      id: "normal-url-input",
      type: "text",
      placeholder: "Must include http(s)://",
      required: "true",
    }
  )
  const btn = createElement(
    "button",
    ["btn", "sm:rounded-l-none", "w-full", "sm:w-auto"],
    {},
    "Shorten"
  )
  const error = createElement("p", ["error", "text-red-400"])

  wrapperDiv.append(urlInput, btn)
  form.append(h3, wrapperDiv, error)
  fragment.append(form)
  $main.append(fragment)

  form.addEventListener("submit", (e) => {
    e.preventDefault()
    urlOnSubmit(urlInput.value)
  })
}

const createOutputUrl = (url, longLink) => {
  const fragment = document.createDocumentFragment()
  const container = createElement("section", [
    "short-result",
    "sm:max-w-[690px]",
    "box",
    "flex",
    "flex-col",
    "max-w-full",
  ])
  const h3 = createElement("h3", [], {}, "Your shortened URL")
  const wrapperDiv = createElement("div", [
    "flex",
    "text-lg",
    "flex-col",
    "sm:flex-row",
    "gap-2.5",
    "sm:gap-0",
  ])
  const urlInput = createElement(
    "input",
    ["input-short", "sm:rounded-r-none", "sm:border-r-0"],
    {
      id: "url-output",
      type: "text",
      readonly: "",
      value: url,
    }
  )
  const btn = createElement(
    "button",
    ["btn", "text-lg", "sm:rounded-l-none", "w-full", "sm:w-auto"],
    { id: "btn-normal" },
    "Copy URL"
  )
  const p = createElement(
    "p",
    ["text-lg", "flex", "flex-col"],
    {},
    "Long link: "
  )
  const a = createElement(
    "a",
    [
      "original-url",
      "link",
      "inline-block",
      "max-w-full",
      "overflow-hidden",
      "text-ellipsis",
      "whitespace-nowrap",
    ],
    { href: longLink, target: "_blank" },
    longLink
  )

  wrapperDiv.append(urlInput, btn)
  p.append(a)
  container.append(h3, wrapperDiv, p)
  fragment.append(container)
  $main.append(fragment)

  btn.addEventListener("click", () => {
    copyToClipboard(url)
  })
}

const generateUrlsHistoryFragment = () => {
  const fragment = document.createDocumentFragment()

  if (urlsHistory.length === 0) {
    const span = createElement(
      "span",
      ["block", "w-full", "text-center"],
      {},
      "No recent URLs in your history"
    )
    fragment.append(span)
  } else {
    urlsHistory.forEach((element) => {
      const { url, longLink, created_at } = element
      const div = addUrlHistorySingleBox(url, longLink, created_at)
      fragment.append(div)
    })
  }
  return fragment
}

const copyToClipboard = (content) => {
  navigator.clipboard.writeText(content)
  const popup = createElement(
    "div",
    [
      "animate-fadeIn",
      "bg-emerald-500/90",
      "w-fit",
      "p-5",
      "rounded-md",
      "absolute",
      "top-2",
      "left-1/2",
      "-translate-x-1/2",
      "z-10",
    ],
    {},
    "Copied!🎉"
  )
  document.body.append(popup)

  setTimeout(() => {
    popup.classList.add("animate-fadeOut")
    setTimeout(() => {
      popup.remove()
    }, 400)
  }, 2500)
}

const formatDate = (date) => {
  // MM/DD/YYYY
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }
  return new Date(date).toLocaleString("en-US", options)
}

$switchBtn.addEventListener("click", () => {
  const $box = document.querySelector(".box")
  if (mode === MODES.NORMAL) {
    $box.remove()
    createCustomUrlForm()
    mode = MODES.CUSTOM
  } else {
    $box.remove()
    createNormalUrlForm()
    mode = MODES.NORMAL
  }
})

$urlsHistoryBtn.addEventListener("click", () => {
  const $urlsHistoryFragment = generateUrlsHistoryFragment()
  createAsideBox($urlsHistoryFragment)
  if (urlsHistory.length > 0) {
    const $aside = document.querySelector(".aside")
    const $asideUrlsBox = document.querySelector(".aside-urls-box")
    const clearHistoryBtn = createElement(
      "div",
      [
        "btn",
        "mx-5",
        "mt-4",
        "bg-sky-500/90",
        "text-white",
        "py-2",
        "text-center",
        "hover:bg-sky-400/90",
        "cursor-pointer",
      ],
      { id: "clear-history-btn" },
      "Clear History"
    )
    $aside.insertBefore(clearHistoryBtn, $asideUrlsBox)
    clearHistoryBtn.addEventListener("click", () => {
      localStorage.removeItem("urlsHistory")
      urlsHistory = []
      const span = createElement(
        "span",
        ["block", "w-full", "text-center"],
        {},
        "No recent URLs in your history"
      )
      $asideUrlsBox.innerHTML = ""
      $asideUrlsBox.append(span)
    })
  }
})

document.addEventListener("DOMContentLoaded", () => {
  urlsHistory = JSON.parse(localStorage.getItem("urlsHistory")) || []
  createNormalUrlForm()
})
