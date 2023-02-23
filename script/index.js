
let lg = 1024;

const menu_btn = document.getElementById('menu-btn');
const close_btn = document.getElementById('close-btn');
const navbar = document.querySelector('.navbar');
const dark_layer = document.querySelector('.dark-layer');

function toggleNavbar(){
    navbar.classList.toggle('active');
    dark_layer.classList.toggle('active');
    cartDialog.removeClass('active');
}

menu_btn.addEventListener('click', toggleNavbar, false);
close_btn.addEventListener('click', toggleNavbar, false);


$(document).ready(function(){
    let owlFirst = $('.owl-carousel.first');
    let owlSecond = $('.owl-carousel.second');
    owlFirst.owlCarousel({
        items: 1,
        autoplay: true,
        autoplayTimeoout: 5e3,
        autoplayHoverPause: true,
        loop: true,
        nav: true,
        navText: [$('.prevbtn1'), $('.nextbtn1')],
        autoWidth: true,
        rtl: false,
        URLhashListener: true,
        startPosition: 'slide1',
        rewindNav: true
    });
    owlSecond.owlCarousel({
        item: 1,
        autoWidth: true,
        nav: true,
        loop: true,
        navText: [$('.prevbtn2'), $('.nextbtn2')]
    })

    function activeEle(){
        let element = $('.owl-item.active').find(':first-child');
        let hash = element.attr('data-hash');

        let slide = $('.slide');
        slide.removeClass('active');

        let activeElement = slide.filter(`[href=\"#${hash}\"]`);
        activeElement.addClass('active');
    }

    let timeout = function(){
        return setInterval(activeEle, 1);
    }
    timeout();
});

let activeImg = $('.owl-carousel.first');
let overlayImage = $('.overlay-image');
activeImg.on('click', toggleswitch)
let close = $('.close');
close.on('click', toggleswitch)

function toggleswitch(){
    cartDialog.removeClass('active');
    if(window.innerWidth >= lg) overlayImage.toggleClass('active');
}



// // variables to use
let cart = [],                              // cart
AddToCart = $('#add-to-cart'),              //asdd to cart button
cartData = $('.data'),                      // cart HTML element
resultDisplay = $('.result-display'),       // incrementable or decrementable value
cartButton = $('.cart'),
cartDialog = $('.cart-dialog'),
notify = $('#notify'),
add = $('.add'),                            // add button
minus = $('.minus'),                        // minus button
counter = 0;                                //incrementing and decrementing counter



let buttonText = `<button class="cursor-pointer bg-orange-x w-full flex justify-center py-4 text-white-x font-bold mt-7 hover:opacity-50 rounded-lg select-none" role="button">Checkout</button>`,
pText = `<p class="text-very-dark-blue text-sm text-center">Your cart is empty</p>`,
src = './images/image-product-1-thumbnail.jpg',
price = 125;

// HTML Markup to be added
function Adding_To_Cart(value, src, price){
    this.src = src;
    this.price = price;
    this.result = (this.price * value);

    return {
        text: `<div class="flex justify-between items-center pt-4" data-value="${value}">
            <img class="max-w-[50px] object-cover rounded-md" src="${this.src}" alt="${this.src.substring(this.src.lastIndexOf('/') + 1).split('.')[0]}">
            <div class="text-dark-grayish-blue text-base">
                <p>Fall Limited Edition Sneakers</p>
                <p>$${this.price}.00 x ${value}&nbsp; <span class="font-extrabold text-very-dark-blue">$${this.result}.00</span> </p>
            </div>
            <button class="delete cursor-pointer" role="button">
                <img src="./images/icon-delete.svg" alt="icon-delete">
            </button>
        </div>`,
        id: cart.length
    }
};

let Notification = {
    value: 0,
    add(param){
        this.value += param;
        this.append();
        return this
    },
    minus(param){
        this.value -= param;
        this.value = this.value < 0 ? 0 : this.value;
        this.append();
        return this.value
    },
    append(){
        if(this.value == 0){
            notify.html('');
        } else{
            let notifyText = `<span class="absolute -top-1/4 right-0 py-[1px] px-[5px] text-white-x font-bold bg-orange-x text-[9px] rounded-md">${this.value}</span>`;
            notify.html(notifyText);
        }
    }
}

// appending items to the cart elements
function insert(){
    cartData.html('');
    if(cart.length == 0){
        cartData.html(pText);
        notify.html('');
        Notification.value = 0;
    } else{
        for(item of cart){
            cartData.append(item.text);
        }
        cartData.append(buttonText);
        let deleteCart = document.querySelectorAll('.delete');
        deleteCart.forEach((item, index) =>{
            item.addEventListener('click', function(e){
                removing(e, index);
            });
        });
    }
}


// removing items from the cart array
function removing(e, index){
    let parent = $(e.target).parent().parent();
    parent.animate({
        opacity: 0.0
    }, 3e2, function(){
        Notification.minus(+parent.data('value'));
        cart.splice(index, 1);
        insert();
    })
}

// appending to the cart array
AddToCart.on('click', function(e){
    e.preventDefault();
    let loader = `<img src="./images/loader.gif" alt="loader-image">`;
    let innerContent = $(e.target).html();
    $(e.target).html(loader)
    let displayTimeout = setTimeout(() => {
        $(e.target).html(innerContent);
        let value = resultDisplay.text();
        if(+value == 0) console.log('no value added')
        else {
            let data = new Adding_To_Cart(+value, src, price);
            data.value = +value;
            
            // Notification.append(+value);
            cart.push(data);
            if(cart.length > 6){
                cart.length = 6;
            }else{
                Notification.add(+value);
            }
            insert();
        }

        $(navbar).removeClass('active');
        $(dark_layer).removeClass('active');
        cartDialog.removeClass('active');
    }, 2000, function(){
        $(e.target).html(innerContent);
    });
    
});

// incrementing the resultDislpay
add.on('click', function(){
    if(++counter > 10) counter = 10;
    resultDisplay.html(counter);

    $(navbar).removeClass('active');
    $(dark_layer).removeClass('active');
    cartDialog.removeClass('active');
});

// decrementing the resultDislpay
minus.on('click', function(){
    if(--counter < 0) counter = 0;
    resultDisplay.html(counter);

    $(navbar).removeClass('active');
    $(dark_layer).removeClass('active');
    cartDialog.removeClass('active');
});

cartButton.on('click', function(){
    cartDialog.toggleClass('active');
    Notification.value = 0;
    notify.html('');
});

$(window).on('scroll', function(){
    $(navbar).removeClass('active');
    $(dark_layer).removeClass('active');
    cartDialog.removeClass('active');
});

let animate = new ScrollReveal({
    origin: 'bottom',
    duration: 1000,
    distance: '60px'
}); 


animate.reveal('.menu-bar');
animate.reveal('.logo', {duration: 1200});
if(window.innerWidth >= lg) animate.reveal('nav.navbar ul', {duration: 1400});
animate.reveal('.cart', {duration: 1600});
animate.reveal('.profile-pic img', {duration: 1800});
animate.reveal('.wrapper .image-display', {duration: 1200, origin: 'left'});

let displaySlides = $('.wrapper .display-slides > .slide');
displaySlides.each(index => {
    animate.reveal('.wrapper .display-slides', {duration: (1000 + (index * 600))});
});

animate.reveal('.content > h3', {duration: 2000});
animate.reveal('.content > h1', {duration: 2200});
animate.reveal('.content > p', {duration: 2400});
animate.reveal('.content > .price', {duration: 2600});
animate.reveal('.content > .cart-box', {duration: 2800});
