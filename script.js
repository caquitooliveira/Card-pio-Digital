const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressImput = document.getElementById("address")
const addresWarn =document.getElementById("address-warn")

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
    cartModal.style.display = "flex"
    updateCartModal();
})

//Fechar o modal do carrinho
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})


menu.addEventListener("click", function(event){
   // console.log(event.target)

    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name,price)
        
        // Adicionar no carrinho
    }  

})

// Função para adicionar no carrinho
function addToCart(name,price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        //Se o item já existe, auemta apenas a quantidade + 1
        existingItem.quantity += 1;

    }else{
    
    cart.push({
        name,
        price,
        quantity: 1,
    })

}

updateCartModal()

}

//Atualiza o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = ""; 
    let total = 0;

    cart.forEach(item => {
      const cartItemElement = document.createElement("div");
      cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

      cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
        <p clas= "font-medium">${item.name}</p>
        <p>${item.quantity}</p>
        <p class="font-medium mt-2">${item.price.toFixed(2)}</p>
        </div>

        
            <button class ="remove-btn" data-name=  "${item.name}">
                Remover
            </button>
               
       </div>
      `

      total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })


    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;


}

// Função para remover item do carrinho
cartItemsContainer.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-btn")){
        const name = event.target.getAttribute("data-name")
        
        removeItemcart(name);
    }
})


function removeItemcart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart [index];
        
        if(item.quantity >1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }


}


addressImput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressImput.classList.remove("border-red-500")
        addresWarn.classList.add("hidden")
    }


})


//Finalizar pedido
checkoutBtn.addEventListener("click", function(){

const isOpen = checkRestaurantOpen();
if(!isOpen){
    
    Toastify({
  text: "Restaurante Fechado!",
  duration: 3000,  
  close: true,
  gravity: "top", // `top` or `bottom`
  position: "left", // `left`, `center` or `right`
  stopOnFocus: true, // Prevents dismissing of toast on hover
  style: {
    background: "#ef4444",
  },
    }).showToast(); 
       
    return;
}

    if(cart.length === 0) return;
    if(addressImput.value === ""){
        addresWarn.classList.remove("hidden")
        addressImput.classList.add("border-red-500")
        return;
    }
})
//Enviar o pedido para api whats
const cartItems = cart.map((item) => {
    return (
       ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price}`
    )
}).join("")

const message = encodeURIComponent(cartItems)
const phone = "61"

window.open(`https://wa.me/${phone}?text=${message} Endereço ${addressImput.value}`, "_blank")

cart = [];
updateCartModal();


// verificar a hora 
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
    //true = restaurante está aberto
}


const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
     spanItem.classList.remove("bg-red-500");
     spanItem.classList.add("bg-green-500")
}else{
    spanItem.classList.remove("bg-green-500")
    spanItem.classList.add("bg-red-500")
}