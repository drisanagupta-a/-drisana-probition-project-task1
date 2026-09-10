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

const displaytransactions=()=>{
const transactionlist=document.querySelector("#transactionList")
    transactionlist.innerHTML=""
    transactions.forEach(item=>{
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
                <button class="editbutton" data-id="${item.id}"><i class="fa-solid fa-pen"></i></button>
                <button class="deletebutton" data-id="${item.id}"><i class="fa-solid fa-trash"></i></button>
                </div>`
                transactionlist.appendChild(row)
    })
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
            transaction.date=date.value }

        editingid=null
    }       else{
            transactions.push({
            id:Date.now(),
            amount:Number(amount.value),
            title:title.value.trim(),
            category:category.value||"Others",
            type:type.value,
            date:date.value
        })
    }
            save()
            displaytransactions()
            updatesummary()
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
        displaytransactions()
        updatesummary()
        }
    }})
   displaytransactions()
   updatesummary()