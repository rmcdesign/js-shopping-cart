;(function(window, $) {

    var cart_source   = $("#cart-template").html();
    var cart_template = Handlebars.compile(cart_source);

    var products_source   = $("#product-list-template").html();
    var products_template = Handlebars.compile(products_source);

    var footwearItems = 0;

    var cart = {
      "total": 0
    };
    var data = {
        "products": [
            {
                "id": 0,
                "name": "Almond Toe Court Shoes, Patent Black",
                "category": "Women’s Footwear",
                "Price": 99.00,
                "reducedBy": 0,
                "quantity": 5
            },
            {
                "id": 1,
                "name": "Suede Shoes, Blue",
                "category": "Women’s Footwear",
                "Price": 42.00,
                "reducedBy": 0,
                "quantity": 4
            },
            {
                "id": 2,
                "name": "Leather Driver Saddle Loafers, Tan",
                "category": "Men’s Footwear",
                "Price": 34.00,
                "reducedBy": 0,
                "quantity": 12
            }
        ]
    };

    var data_backup = $.extend(true,{},data);

    $("#product-list").html(products_template(data));


    function addItemToCart(id) {
        var item = data.products[id];
        var itemId = item.id;
        console.log(itemId);
        var inCart = false;

        if(typeof cart.items === 'undefined') {
            cart.items = [];
        } else {
          for (i = 0; i < cart.items.length; i++) {
            if(typeof cart.items[i] != 'undefined' && cart.items[i].id === id) {
                inCart = true;
                console.log('in cart already');
                if(data.products[id].quantity > 0) {
                    cart.items[i].count++;
                    data.products[id].quantity--;
                    updateCart();
                    updateList();
                } else {
                    console.log('no stock left');
                }
            }
          }
        }

        if(!inCart) {
            console.log('first for this item');
            item.count = 1;
            cart.items.push(item);
            data.products[id].quantity--;
            updateCart();
            updateList();
        }

        // need to check when deleting too
        if( item.category.indexOf('Footwear') ) {
            footwearItems++;
        }

    }

    function subtractItemFromCart(id) {

      if(cart.items[id].count > 0) {
          cart.items[id].count--;
          data.products[id].quantity++;
          updateCart();
          updateList();
      } else {
          console.log('nothing to delete');
      }

    }

    function deleteItemFromCart(id) {
      //console.log(cart.items);
      data.products[id].quantity = data_backup.products[id].quantity;
      console.log(cart.items[id]);
      delete cart.items[id];


      updateList();
      updateCart();

    }

    // fucntion updateBasketCount(ammount) {
    //
    // }

    function updateCart() {
        $("#shopping-cart").html(cart_template(cart));
    }

    function updateList() {
        $("#product-list").html(products_template(data));
    }

    $(document).on("click", ".add-to-cart", function() {
        var id = $(this).data('id');
        console.log(id + ' button pressed');
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


})(window, jQuery);
