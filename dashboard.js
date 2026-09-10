let transactions=JSON.parse(localStorage.getItem("transactions"))
let editingid=null
const save=()=>{
    localStorage.setItem("transactions",JSON.stringify(transactions))
}
if(!transactions){
    transactions=[
        {id:1,title:"Grocery shopping",amount:850,type:"expense",category:"Food",date:"2025-09-12"},
        {id:2,title:"Monthly salary",amount:35000,type:"income",category:"Salary",date:"2025-09-10"},
        {id:3,title:"Netflix subscription",amount:499,type:"expense",category:"Entertainment",date:"2025-09-08"},
        {id:4,title:"Freelance project",amount:2000,type:"income",category:"Freelance",date:"2025-09-06"},
        {id:5,title:"Electricity bill",amount:1200,type:"expense",category:"Bills",date:"2025-09-04"},
        {id:6,title:"Flight tickets",amount:6000,type:"expense",category:"Travel",date:"2025-09-01"}
    ]
    save()
}
const updatesummary=()=>{
    const totalincome=document.querySelector("#totalIncome")
    const totalexpense=document.querySelector("#totalExpense")
    const totalbalance=document.querySelector("#totalBalance")
    let income=0
    let expense=0
    transactions.forEach(item=>{
        if(item.type==="income"){
            income+=Number(item.amount)
        }else{
            expense+=Number(item.amount)
        }
    })
    const startingbalance=Number(localStorage.getItem("balance"))||0
    const balance=startingbalance+income-expense
    totalincome.textContent="₹ "+income.toLocaleString("en-IN")
    totalexpense.textContent="₹ "+expense.toLocaleString("en-IN")
    totalbalance.textContent="₹ "+balance.toLocaleString("en-IN")
}
const monthselect=document.querySelector("#monthSelect")
const updatemonths=()=>{
    const months=[...new Set(transactions.map(item=>item.date.slice(0,7)))]
    const currentmonth=new Date().toISOString().slice(0,7)
    if(!months.includes(currentmonth)){
        months.push(currentmonth)
    }
    months.sort((a,b)=>b.localeCompare(a))
    monthselect.innerHTML=""
    months.forEach(item=>{
        const option=document.createElement("option")
        option.value=item
        option.textContent=new Date(item+"-01T00:00:00").toLocaleDateString("en-IN",{
            month:"short",
            year:"numeric"
        })
        monthselect.appendChild(option)
    })
}
const updatemonthlysummary=()=>{
    const monthlyincome=document.querySelector("#monthlyIncome")
    const monthlyexpenses=document.querySelector("#monthlyExpenses")
    const savingamount=document.querySelector("#savingAmount")
    const selectedmonth=monthselect.value
    let income=0
    let expense=0
    transactions.forEach(item=>{
        if(item.date.slice(0,7)===selectedmonth){
         if(item.type==="income"){
         income+=Number(item.amount)
          }else{
         expense+=Number(item.amount)
            }
        }
    })
    monthlyincome.textContent="₹ "+income.toLocaleString("en-IN")
    monthlyexpenses.textContent="₹ "+expense.toLocaleString("en-IN")
    savingamount.textContent="₹ "+(income-expense).toLocaleString("en-IN")
}
const updatecategorysummary=()=>{
    const categorylist=document.querySelector("#categoryList")
    const categorytotal=document.querySelector("#categoryTotal")
    const categories={}
    let total=0
    transactions.forEach(item=>{
        if(item.type==="expense"){
            const category=item.category||"Others"
            categories[category]=(categories[category]||0)+Number(item.amount)
            total+=Number(item.amount)
        }
    })
    categorylist.innerHTML=""
    Object.entries(categories)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,6)
    .forEach(item=>{
        const row=document.createElement("div")
        row.innerHTML=`
        <span><i></i>${item[0]}</span>
        <strong>₹ ${item[1].toLocaleString("en-IN")}</strong>
        `
        categorylist.appendChild(row)
    })
    categorytotal.textContent="₹ "+total.toLocaleString("en-IN")
}
monthselect.addEventListener("change",updatemonthlysummary)
updatemonths()
updatemonthlysummary()

const transactionform=document.querySelector("#transactionForm")
transactionform.addEventListener("submit",e=>{
    e.preventDefault()
    const amount=document.querySelector("#amount")
    const title=document.querySelector("#title")
    const category=document.querySelector("#category")
    const type=document.querySelector("#type")
    const date=document.querySelector("#date")
    const amounterror=document.querySelector("#amountError")
    const titleerror=document.querySelector("#titleError")
    const dateerror=document.querySelector("#dateError")
    amounterror.textContent=""
    titleerror.textContent=""
    dateerror.textContent=""
    let valid=true
    if(!amount.value||Number(amount.value)<=0){
        amounterror.textContent="Enter a valid amount"
        valid=false
    }
    if(!title.value.trim()){
        titleerror.textContent="Enter a description"
        valid=false
    }
    if(!date.value){
        dateerror.textContent="Select a date"
        valid=false
    }
    if(!valid){
        return
    }
    if(editingid!==null){
        const transaction=transactions.find(item=>item.id===editingid)
        if(transaction){
            transaction.amount=Number(amount.value)
            transaction.title=title.value.trim()
            transaction.category=category.value||"Others"
            transaction.type=type.value
            transaction.date=date.value
        }
        editingid=null
    }else{
        const newtransaction={
            id:Date.now(),
            amount:Number(amount.value),
            title:title.value.trim(),
            category:category.value||"Others",
            type:type.value,
            date:date.value
        }
        transactions.push(newtransaction)
    }
    save()
    filtertransactions()
    updatesummary()
    updatemonths()
    updatemonthlysummary()
    updatecategorysummary()
    transactionform.reset()
    transactionform.querySelector("button[type='submit']").textContent="Add Transaction"
})
document.querySelector("#transactionList").addEventListener("click",e=>{
    const editbutton=e.target.closest(".editbutton")
    const deletebutton=e.target.closest(".deletebutton")
    if(editbutton){
        const id=Number(editbutton.dataset.id)
        const transaction=transactions.find(item=>item.id===id)
        if(!transaction){
            return
        }
        editingid=id
        document.querySelector("#amount").value=transaction.amount
        document.querySelector("#title").value=transaction.title
        document.querySelector("#category").value=transaction.category
        document.querySelector("#type").value=transaction.type
        document.querySelector("#date").value=transaction.date
        transactionform.querySelector("button[type='submit']").textContent="Save Changes"
        document.querySelector("#title").focus()
    }
    if(deletebutton){
        const id=Number(deletebutton.dataset.id)
        if(confirm("Delete this transaction?")){
            transactions=transactions.filter(item=>item.id!==id)
            save()
            filtertransactions()
            updatesummary()
            updatemonths()
            updatemonthlysummary()
            updatecategorysummary()
        }
    }
})
updatesummary()
updatecategorysummary()
