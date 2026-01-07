(function () {
    const root = document.documentElement;

    function updateRadius() {
        const atBottom =
            Math.ceil(root.scrollTop + root.clientHeight) >= root.scrollHeight;

        root.classList.toggle("at-bottom", atBottom);
    }

    document.addEventListener("scroll", updateRadius, { passive: true });
    window.addEventListener("resize", updateRadius);
    window.addEventListener("load", updateRadius);
})();

let amount_balance = 38000

const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
})


function reset(){

    document.querySelector(".shopping_warning").style.display = "none"
}


// Define all sections
const notification = document.querySelector(".notification_page");
const tap = document.querySelector(".tap_page");
const scan = document.querySelector(".scan_page");
const send = document.querySelector(".send_page");
const points = document.querySelector(".points_page");
const history = document.querySelector(".history_page");
const topup = document.querySelector(".topup_page");
const coupon = document.querySelector(".coupon_page");
const bills = document.querySelector(".bills_page");
const stamp = document.querySelector(".stamp_page");
const shopping = document.querySelector(".shopping_page");
const mileage = document.querySelector(".mileage_page");
const phone = document.querySelector(".phone_page");
const favorites = document.querySelector(".favorites_page");
const all = document.querySelector(".all_page");
const homepage = document.querySelector(".homepage")
const body = document.querySelector("body")



function display_error(xpath,value){

    document.querySelector(xpath).style.display = value

}


function formatted_amount(amount){
    let formatted = Number(amount).toLocaleString('en-US'); 
    return formatted
}

// reset

document.querySelector(".navigation").addEventListener('click',(e)=>{

    if (e.target.tagName === 'div'||'img'){
        console.log('reached')
        reset()
    }

})



function getElementHeight(selector) {
    const el = document.querySelector(selector);
    if (!el) return null;

    const pxHeight = el.offsetHeight; // element height in pixels 
    const viewportHeight = window.innerHeight; // viewport height in pixels 
    const vhValue = (pxHeight / viewportHeight) * 100;
    // offsetHeight gives the element’s visible height (including padding, border)
    return el.offsetHeight;
}


// main funciton
function hideAllSections(element_class, dtype) {
    document.querySelectorAll("body > section").forEach(sec => {
        sec.style.display = "none";
    });

    document.querySelector("body > section." + element_class).style.display = dtype

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    let class_of_elem = "." + element_class

    heightvh = getElementHeight(class_of_elem)
    if (heightvh < 700) {
        document.querySelector("body > .navigation").classList.add("short-section");
    } else {
        document.querySelector("body > .navigation").classList.remove("short-section");
    }


}

const sendForm = document.getElementById('sendForm');
const sendPage = document.querySelector('.send_page');
const successPage = document.querySelector('.send_success_page');

function success_form_submit() {
    sendForm.classList.add('dnone'); // show success page 
    successPage.classList.remove('dnone');
    successPage.style.display = 'flex'; // or 'block' 
};



const topupForm = document.getElementById('topupForm');
const topupPage = document.querySelector('.topup_page');
const topupSuccess = document.querySelector('.topup_success');
const backTopupBtn = document.getElementById('backTopupBtn');




function enableFields() {
    // enable inputs
    document.getElementById('nameInput').disabled = false;
    document.getElementById('emailInput').disabled = false;

    // hide Edit, Settings, Logout
    document.getElementById('editBtn').style.display = 'none';
    document.getElementById('settingsBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'none';

    // add Save and Cancel buttons
    const actions = document.querySelector('.account_actions');

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.type = 'button';
    saveBtn.id = 'saveBtn';
    actions.appendChild(saveBtn);

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.type = 'button';
    cancelBtn.id = 'cancelBtn';
    actions.appendChild(cancelBtn);

    // Save: disable fields, restore original buttons
    saveBtn.onclick = function () {
        document.getElementById('nameInput').disabled = true;
        document.getElementById('emailInput').disabled = true;

        saveBtn.remove();
        cancelBtn.remove();

        document.getElementById('editBtn').style.display = 'inline-block';
        document.getElementById('settingsBtn').style.display = 'inline-block';
        document.getElementById('logoutBtn').style.display = 'inline-block';
    };

    // Cancel: disable fields, discard changes, restore original buttons
    cancelBtn.onclick = function () {
        document.getElementById('nameInput').disabled = true;
        document.getElementById('emailInput').disabled = true;

        cancelBtn.remove();
        saveBtn.remove();

        document.getElementById('editBtn').style.display = 'inline-block';
        document.getElementById('settingsBtn').style.display = 'inline-block';
        document.getElementById('logoutBtn').style.display = 'inline-block';
    };
}



// recalculate balance
function recalculated_amount(val, method){
    if (method == "add"){
        amount_balance = amount_balance + val
    }
    else if(method == "sub"){
        amount_balance = amount_balance - val
    }

    let formattedd = formatted_amount(amount_balance)

    document.querySelector(".add_bal_img_span>h4").textContent = formattedd
    document.querySelector(".wallet_balance_amount").textContent = formattedd
    document.querySelector(".tap_balance_amount").textContent = formattedd

    console.log(amount_balance, formattedd)

    return amount_balance
}


// add history
function update_history(activity, amount, date){

    let history_container = document.querySelector(".history_list")
    let formattedd = formatted_amount(Number(amount))
    console.log(activity, formattedd, date)

    let div = document.createElement('div')

    if (activity == "Payment sent"){

    div.innerHTML = `<div class="history_item">
                <div class="history_left">
                    <p class="history_title">${activity}</p>
                    <p class="history_date">${date}</p>
                </div>
                <div class="history_right debit">- ¥${amount}</div>
            </div>`

    history_container.prepend(div)

    }
    
    else{

    div.innerHTML = `<div class="history_item">
                <div class="history_left">
                    <p class="history_title">${activity}</p>
                    <p class="history_date">${date}</p>
                </div>
                <div class="history_right credit">+ ¥${amount}</div>
            </div>`

    history_container.prepend(div)

    }

}


// Send money flow
// get the amount through api

function send_money_function(event){

    event.preventDefault()

    const warning_message = document.querySelector(".send_money_warning")
    const successPage = document.querySelector('.send_success_page');
    const receipentId = document.querySelector("#recipient")
    let validData = true

    warning_message.textContent = ""
    validData = true


    if (!receipentId.value.includes("@") || receipentId.value.length < 3){
        warning_message.textContent = "Incorrect ID"
        validData = false
    }

    let sending_amount = document.querySelector("#amount").value

    if (amount_balance < sending_amount){
        warning_message.textContent = "Insufficient Balance Amount"
        validData = false
        console.log("what's happening?")
    }
    

    if (validData){

        hideAllSections('send_success_page, flex');
        
        successPage.classList.remove('dnone');
        successPage.style.display = 'flex'; // or 'block' 

        recalculated_amount(sending_amount, 'sub')

        update_history("Payment sent", sending_amount, today)

        receipentId.value = ""
        document.querySelector("#amount").value = ""
    }



}


// topup
function top_up_function(event){
    
    event.preventDefault()

    let methodValue = document.querySelector("#method")
    const top_up_warning = document.querySelector(".top_up_warning")
    let amount_val = document.querySelector("#amount_topup")

    if (methodValue.value == "bank"){

        amount_val = Number(amount_val.value) 
        recalculated_amount(amount_val, 'add')

        let formattedd = formatted_amount(amount_val)

        update_history("Top-up", formattedd, today)
        hideAllSections('topup_success', 'flex')

        document.querySelector("#amount_topup").value = "0"
    }
    else{
        top_up_warning.textContent = "No Credit/Debit card found"
    }

}


// shopping
document.querySelector(".shopping_page").addEventListener('click',(e)=>{
    
    if (e.target.tagName === 'BUTTON'){
        display_error(".shopping_warning", "block")
    }

})


// bills
document.querySelector(".bills_list").addEventListener('click', (e)=>{

    if (e.target.tagName === "BUTTON"){
        document.querySelector(".qasend").click()
    }

    let sending_amount = document.querySelector("#amount")
    const receipentId = document.querySelector("#recipient")

    if ((e.target.parentElement.textContent).includes("Electricity")){
        sending_amount.value = 1200
        receipentId.value = "electricity@upi"
    }
    else if ((e.target.parentElement.textContent).includes("Water")){
        sending_amount.value = 500
        receipentId.value = "water@upi"
    }
    else if ((e.target.parentElement.textContent).includes("Internet")){
        sending_amount.value = 999
        receipentId.value = "internet@upi"
    }

})


