const search=document.querySelector("#search")
const typefilter=document.querySelector("#typeFilter")
const categoryfilter=document.querySelector("#categoryFilter")
const sortfilter=document.querySelector("#sortFilter")
const transactionlist=document.querySelector("#transactionList")
const filtertransactions=()=>{
    let list=[transactions]
    const searchtext=search.value.toLowerCase().trim()
    const selectedtype=typefilter.value
    const selectedcategory=categoryfilter.value
    const sort=sortfilter.value
    if(searchtext){
        list=list.filter(item=>{
            return item.title.toLowerCase().includes(searchtext)
        })
    }
    if(selectedtype!=="all"){
        list=list.filter(item=>{
            return item.type===selectedtype
        })
    }
    if(selectedcategory!=="all"){
        list=list.filter(item=>{
            return item.category===selectedcategory
        })
    }
    if(sort==="date"){
        list.sort((a,b)=>new Date(b.date)-new Date(a.date))
    }
    if(sort==="amountHigh"){
        list.sort((a,b)=>Number(b.amount)-Number(a.amount))
    }
    if(sort==="amountLow"){
        list.sort((a,b)=>Number(a.amount)-Number(b.amount))
    }
    transactionlist.innerHTML=""
    list.forEach(item=>{
        const row=document.createElement("div")
        row.className="transaction"
        row.innerHTML=`
        <span>${item.date}</span>
        <span>${item.title}</span>
        <span>${item.category}</span>
        <span>${item.type}</span>
        <strong class="${item.type==="income"?"incomeamount":"expenseamount"}">
        ${item.type==="income"?"+":"−"} ₹ ${Number(item.amount).toLocaleString("en-IN")}
        </strong>
        <div class="transactionactions">
        <button class="editbutton" data-id="${item.id}">
        <i class="fa-solid fa-pen"></i>
        </button>
        <button class="deletebutton" data-id="${item.id}">
        <i class="fa-solid fa-trash"></i>
        </button>
        </div>`
        
        transactionlist.appendChild(row)})
}
search.addEventListener("input",filtertransactions)
typefilter.addEventListener("change",filtertransactions)
categoryfilter.addEventListener("change",filtertransactions)
sortfilter.addEventListener("change",filtertransactions)