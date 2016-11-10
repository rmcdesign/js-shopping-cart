;(function(window, $) {

    "use strict";

    // TODO: Precompile templates
    var cart_list_source   = $("#cart-list-template").html();
    var cart_list_template = Handlebars.compile(cart_list_source);

    var products_source   = $("#product-list-template").html();
    var products_template = Handlebars.compile(products_source);

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

    // using this to get original stock values - prob should save them better
    var data_backup = $.extend(true,{},data);

    $("#product-list").html(products_template(data));

    // stick everything in an object to have less global variables
    var app = {};

    app.init = function() {
        app.setVariables();
        app.bindEvents();
    };

    app.setVariables = function() {
        app.$doc = $(document);
        app.$productList = $('#product-list');
        app.$shoppingBasket = $('#shopping-basket');
        app.footwearItems = 0;
        app.cart = { total: 0 };
    };

    app.bindEvents = function() {
        app.$doc.on("click", ".add-to-cart", app.addItemToCart);
        app.$doc.on("click", ".delete", app.removeItemFromCartList);
        app.$doc.on("click", ".toggle-cart", app.toggleCart);
        app.$doc.on("click", ".apply-voucher", app.validateVoucher);
        app.$doc.on("keyup", "#voucher", function() {
            if(event.keyCode == 13){
                app.validateVoucher();
            }
        });
    };

    app.toggleCart = function() {
        app.$productList.slideToggle("fast");
        app.$shoppingBasket.slideToggle("fast");
    };

    app.removeItemFromCartList = function() {
        var id = $(this).data('id'),
            $item = $(this).parent('.cart-item');
        $item.slideUp(400, function () {
            $item.remove();
            app.deleteItemFromCart(id);
        });
    };

    app.addItemToCart = function() {
        var id = $(this).data('id'),
            item = data.products[id],
            inCart = false;

        if(typeof app.cart.items === 'undefined') {
            app.cart.items = [];
        } else {
            for (var i = 0; i < app.cart.items.length; i++) {
                if(typeof app.cart.items[i] != 'undefined' && app.cart.items[i].id === id) {
                    inCart = true;
                    if(data.products[id].quantity > 0) {
                        app.cart.items[i].count++;
                        data.products[id].quantity--;
                        app.updateTotal();
                    } else {
                        console.log('no stock left');
                    }
                }
            }
        }

        if(!inCart) {
            item.count = 1;
            app.cart.items.push(item);
            data.products[id].quantity--;
            app.updateTotal();
        }

        // TODO: when deleting need to recalculate footwear count
        if(item.category.indexOf('Footwear') ) {
            app.footwearItems++;
        }

    };

    app.deleteItemFromCart = function(id) {
        data.products[id].quantity = data_backup.products[id].quantity;
        for(var i = 0; i < app.cart.items.length; i++) {
            if(app.cart.items[i].id === id) {
                app.cart.items.splice(i, 1);
            }
        }
        app.updateTotal();
    };

    app.updateTotal = function() {

        app.updateCartList();
        app.updateList();

        var basketCount = 0,
            subTotal = 0,
            $btnCount = $('.basket-count');

        $(".cart-item").each(function () {

            var self = $(this),
                q = parseFloat(self.find('.cart-quantity').text()),
                p = parseFloat(self.find('.cart-price').text()).toFixed(2);

            basketCount += q;
            subTotal += (p * q);
        });

        app.cart.total = subTotal.toFixed(2);

        if(basketCount === 1) {
            $btnCount.html(basketCount + ' item');
        } else if(basketCount > 1) {
            $btnCount.html(basketCount + ' items');
        } else {
            $btnCount.html('Basket empty');
        }

        $('.cart-total').html('£' + app.cart.total);

    };

    app.updateCartList = function() {
        $("#shopping-cart-list").html(cart_list_template(app.cart));
    };

    app.updateList = function() {
        $("#product-list").html(products_template(data));
    };

    app.applyDiscount = function(amount) {
        var newAmount = app.cart.total - amount;
        app.cart.total = newAmount.toFixed(2);
        $('.show-discount').html('Discount applied: -£' + amount.toFixed(2) );
        $('.cart-total').html('£' + app.cart.total);
    };

    app.voucherStatus = function(valid) {

        var $discountStatus = $('.discount-status');

        if(valid) {
            $discountStatus.addClass('voucher-valid').fadeIn().html('Your voucher as been successfully applied');
        } else {
            $discountStatus.fadeIn().html('Sorry the voucher you entered was invalid');
        }

        setTimeout(function(){
            $discountStatus.slideUp();
        }, 3000);

    };

    // TODO: handle multiple vouchers and remove when they become invalid

    app.validateVoucher = function() {

        var $voucher = $('#voucher'),
            code = $voucher.val();

        $voucher.val('');
        $('.show-discount').html('');

        switch(code.toUpperCase()) {
            case 'FIVEOFF':
                app.applyDiscount(5);
                app.voucherStatus(true);
                break;
            case 'BIGSPENDER':
                app.applyDiscount(10);
                app.voucherStatus(true);
                break;
            case 'FOOTWEAR':
                if(app.footwearItems > 0) {
                    app.applyDiscount(15);
                    app.voucherStatus(true);
                }
                break;
            default:
                app.voucherStatus(false);
        }

    };

    app.init();


})(window, jQuery);