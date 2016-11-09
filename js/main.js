;(function(window, $) {

    var cart_list_source   = $("#cart-list-template").html();
    var cart_list_template = Handlebars.compile(cart_list_source);

    var products_source   = $("#product-list-template").html();
    var products_template = Handlebars.compile(products_source);

    var footwearItems = 0;

    var cart = {
        total: 0
    };
    var data = {
        "products": [
            {
                "id": 0,
                "name": "Almond Toe Court Shoes, Patent Black",
                "category": "Women’s Footwear",
                "price": "99.00",
                "reducedBy": 0,
                "quantity": 5
            },
            {
                "id": 1,
                "name": "Suede Shoes, Blue",
                "category": "Women’s Footwear",
                "price": "42.00",
                "reducedBy": 0,
                "quantity": 4
            },
            {
                "id": 2,
                "name": "Leather Driver Saddle Loafers, Tan",
                "category": "Men’s Footwear",
                "price": "34.00",
                "reducedBy": 0,
                "quantity": 12
            },
            {
                "id": 3,
                "name": "Flip Flops, Red",
                "category": "Men’s Footwear",
                "price": "19.00",
                "reducedBy": 0,
                "quantity": 6
            },
            {
                "id": 4,
                "name": "Flip Flops, Blue",
                "category": "Men’s Footwear",
                "price": "19.00",
                "reducedBy": 0,
                "quantity": 0
            },
            {
                "id": 5,
                "name": "Gold Button Cardigan, Black",
                "category": "Women’s Casualwear",
                "price": "167.00",
                "reducedBy": 0,
                "quantity": 6
            },
            {
                "id": 6,
                "name": "Cotton Shorts, Medium Red",
                "category": "Women’s Casualwear",
                "price": "30.00",
                "reducedBy": 0,
                "quantity": 5
            },
            {
                "id": 7,
                "name": "Fine Stripe Short Sleeve Shirt, Grey",
                "category": "Men’s Casualwear",
                "price": "49.99",
                "reducedBy": 0,
                "quantity": 9
            },
            {
                "id": 8,
                "name": "Fine Stripe Short Sleeve Shirt, Green",
                "category": "Men’s Casualwear",
                "price": "39.99",
                "reducedBy": 10,
                "quantity": 3
            },
            {
                "id": 9,
                "name": "Sharkskin Waistcoat, Charcoal",
                "category": "Men’s Formalwear",
                "price": "75.00",
                "reducedBy": 0,
                "quantity": 2
            },
            {
                "id": 10,
                "name": "Lightweight Patch Pocket Blazer, Deer",
                "category": "Men’s Formalwear",
                "price": "175.50",
                "reducedBy": 0,
                "quantity": 1
            },
            {
                "id": 11,
                "name": "Bird Print Dress, Black",
                "category": "Women’s Formalwear",
                "price": "270.00",
                "reducedBy": 0,
                "quantity": 10
            },
            {
                "id": 12,
                "name": "Mid Twist Cut-Out Dress, Pink",
                "category": "Women’s Formalwear",
                "price": "540.00",
                "reducedBy": 0,
                "quantity": 5
            }
        ]
    };

    var data_backup = $.extend(true,{},data);

    $("#product-list").html(products_template(data));


    function addItemToCart(id) {
        var item = data.products[id];
        var inCart = false;

        if(typeof cart.items === 'undefined') {
            cart.items = [];
        } else {
            for (i = 0; i < cart.items.length; i++) {
                if(typeof cart.items[i] != 'undefined' && cart.items[i].id === id) {
                    inCart = true;
                    if(data.products[id].quantity > 0) {
                        cart.items[i].count++;
                        data.products[id].quantity--;
                        updateTotal();
                    } else {
                        console.log('no stock left');
                    }
                }
            }
        }

        if(!inCart) {
            item.count = 1;
            cart.items.push(item);
            data.products[id].quantity--;
            updateTotal();
        }

        if( item.category.indexOf('Footwear') ) {
            footwearItems++;
        }

    }

    function subtractItemFromCart(id) {
        for(var i = 0; i < cart.items.length; i++) {
            if (cart.items[i].id === id) {
                if(cart.items[i].count > 0) {
                    cart.items[i].count--;
                    data.products[i].quantity++;
                    updateTotal();
                } else {
                    console.log('nothing to delete');
                }
            }
        }
    }

    function deleteItemFromCart(id) {
        data.products[id].quantity = data_backup.products[id].quantity;
        for(var i = 0; i < cart.items.length; i++) {
            if(cart.items[i].id === id) {
                cart.items.splice(i, 1);
            }
        }
        updateTotal();
    }

    function updateTotal() {

        updateCartList();
        updateList();
        var basketCount = 0;
        var subTotal = 0;
        var $btnCount = $('.basket-count');
        var $checkoutBtn = $('.checkout');
        $(".cart-item").each(function () {
            var self = $(this);
            var q = parseFloat(self.find('.cart-quantity').text());
            var p = parseFloat(self.find('.cart-price').text()).toFixed(2);
            basketCount += q;
            subTotal += (p * q);
        });
        cart.total = subTotal.toFixed(2);

        if(basketCount === 1) {
            $btnCount.html(basketCount + ' item');
        } else if(basketCount > 1) {
            $btnCount.html(basketCount + ' items');
        } else {
            $btnCount.html('Basket empty');
        }

        $('.cart-total').html('£' + cart.total);

    }

    function updateCartList() {
        $("#shopping-cart-list").html(cart_list_template(cart));
    }

    function updateList() {
        $("#product-list").html(products_template(data));
    }

    function applyDiscount(amount) {
        var newAmount = cart.total - amount;
        cart.total = newAmount.toFixed(2);
        $('.show-discount').html('Discount applied: -£' + amount.toFixed(2) );
        $('.cart-total').html('£' + cart.total);
    }

    function voucherStatus(valid) {

        if(valid) {
            $('.discount-status').addClass('voucher-valid').fadeIn().html('Your voucher as been successfully applied');
        } else {
            $('.discount-status').fadeIn().html('Sorry the voucher you entered was invalid');
        }

        setTimeout(function(){
            $('.discount-status').slideUp();
        }, 3000);

    }

    $(document).on("click", ".add-to-cart", function() {
        var id = $(this).data('id');
        addItemToCart(id);
    });

    $(document).on("click", ".minus-item", function() {
        var id = $(this).data('id');
        subtractItemFromCart(id);
    });

    $(document).on("click", ".delete", function() {
        var id = $(this).data('id');
        var $item = $(this).parent('.cart-item');
        $item.slideUp(400, function() {
            $item.remove();
            deleteItemFromCart(id);
        });
    });

    $('.toggle-cart').on('click', function() {
        var $productList = $('#product-list');
        var $shoppingBasket = $('#shopping-basket');
        $productList.slideToggle("fast");
        $shoppingBasket.slideToggle("fast");
    });



    $(document).on("keyup", "#voucher", function() {
        if(event.keyCode == 13){
            validateVoucher();
        }
    });

    $(document).on("click", ".apply-voucher", validateVoucher);

    function validateVoucher() {

        var $voucher = $('#voucher');

        var code = $voucher.val();

        $voucher.val('');
        $('.show-discount').html('');

        switch(code.toUpperCase()) {
            case 'FIVEOFF':
                applyDiscount(5);
                voucherStatus(true);
                break;
            case 'BIGSPENDER':
                applyDiscount(10);
                voucherStatus(true);
                break;
            case 'FOOTWEAR':
                if(footwearItems > 0) {
                    applyDiscount(15);
                    voucherStatus(true);
                }
                break;
            default:
                voucherStatus(false);
        }



    }


})(window, jQuery);