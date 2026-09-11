const currency = document.querySelector("#currency")
const symbol = document.querySelector("#balanceSymbol")
const form = document.querySelector("#setupForm")
const name = document.querySelector("#name")
const balance = document.querySelector("#balance")

const symbols = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    AUD: "A$"
}
name.value = localStorage.getItem("name") || ""
currency.value = localStorage.getItem("currency") || "INR"
balance.value = localStorage.getItem("balance") || ""
symbol.textContent = symbols[currency.value]
currency.addEventListener("change", () => {
    symbol.textContent = symbols[currency.value]
    localStorage.setItem("currency", currency.value)
})

name.addEventListener("input", () => {
    localStorage.setItem("name", name.value)
})
balance.addEventListener("input", () => {
    localStorage.setItem("balance", balance.value)
})
form.addEventListener("submit", (e) => {
    e.preventDefault()
    localStorage.setItem("name", name.value)
    localStorage.setItem("currency", currency.value)
    localStorage.setItem("balance", balance.value)
    window.location.href = "dashboard.html"
})