/**
 * Single product JS
 *
 * @package Buy Once or Subscribe for WooCommerce Subscriptions
 * @since 1.0.0
 */

jQuery(
    function ($) {
        let bos4w_plan_select           = $( '.bos4w-buy-type' );
        let bos4w_button_text           = $( '.single_add_to_cart_button' );
        let bos4w_variable_product      = $( 'form.variations_form' );
        let bos4w_display_dropdown_wrap = $( '.bos4w-display-wrap' );
        let bos4w_display_dropdown      = $( '#bos4w-dropdown-plan' );

        if (wpr_bos4w_js.bos4w_is_product) {
            bos4w_button_text.html( wpr_bos4w_js.bos4w_buy_now );
        }

        if (bos4w_variable_product.length > 0) {
            bos4w_display_dropdown_wrap.hide();
        }

        if ($('form.cart').hasClass('bundle_form')) {
            console.log('Loaded!');
            jQuery(document.body).on(
                'woocommerce-bundled-item-totals-changed',
                function (event, bundle) {
                    setTimeout(function () {
//                        console.log(bundle.get_bundle().get_price_html());
                        let bundle_price_html = bundle.get_bundle().get_price_html(),
                            bundle_price_inner_html = $(bundle_price_html).html();

                        let the_price = bundle_price_inner_html.match(/\d+/g);
                        let bundle_price = the_price[0] + '.' + the_price[1];

                        if( the_price[2] && the_price[3] ) {
                            bundle_price = the_price[2] + '.' + the_price[3];
                        }

                        bundle_price = parseFloat(bundle_price);

                        bos4w_display_dropdown.find('option').each(function (index, element) {
                            let text = element.text;
                            let current_price = element.dataset.price;
                            let discount_amount = element.dataset.discount;

                            let dec = (discount_amount / 100).toFixed(2);
                            let mult = bundle_price * dec;
                            let new_price = bundle_price - mult;

                            element.dataset.price = new_price.toFixed(2);
                            new_price = new_price.toFixed(2);

                            if(',' === wpr_bos4w_js.decimal_separator) {
                                current_price = current_price.replace('.', ',');
                                new_price = new_price.replace('.', ',');
                            }

                            text = text.replace(addZeroes(current_price), addZeroes(new_price));
                            $(this).text(text);
                        });

                        $('#bos4w-selected-price').val($("#bos4w-dropdown-plan option:selected").attr("data-price"));

                    }, 500);
                }
            );
        } else if ($('form.cart').hasClass('composite_form')) {
            $( '.composite_data' ).on( 'wc-composite-initializing', function( event, composite ) {
                console.log('Loaded!');
                composite.actions.add_action( 'component_totals_changed', function() {

                    let composite_price_html       = composite.composite_price_view.get_price_html(),
                        composite_price_inner_html = $( composite_price_html ).html();

                    let the_price = composite_price_inner_html.match(/\d+/g);
                    let composite_price = the_price[0] + '.' + the_price[1];

                    if( the_price[2] && the_price[3] ) {
                        composite_price = the_price[2] + '.' + the_price[3];
                    }

                    composite_price = parseFloat(composite_price);

                    bos4w_display_dropdown.find('option').each(function (index, element) {
                        let text = element.text;
                        let current_price = element.dataset.price;
                        let discount_amount = element.dataset.discount;

                        let dec = (discount_amount / 100).toFixed(2);
                        let mult = composite_price * dec;
                        let new_price = composite_price - mult;

                        element.dataset.price = new_price.toFixed(2);
                        new_price = new_price.toFixed(2);

                        if(',' === wpr_bos4w_js.decimal_separator) {
                            current_price = current_price.replace('.', ',');
                            new_price = new_price.replace('.', ',');
                        }

                        text = text.replace(addZeroes(current_price), addZeroes(new_price));
                        $(this).text(text);
                    });

                    setTimeout(function () {
                        $('#bos4w-selected-price').val($("#bos4w-dropdown-plan option:selected").attr("data-price"));
                    }, 500);
                }, 51, this );
            } );
        } else {
            $( '.single_variation_wrap' ).on(
                'show_variation',
                function (event, variation) {
                    bos4w_display_dropdown_wrap.show();
                    // Fired when the user selects all the required dropdowns / attributes!
                    // and a final variation is selected / shown!
                    $.each(
                        variation.bos4w_discounted_price,
                        function( index, value ) {
                            bos4w_display_dropdown[0].options[index].innerHTML = value;
                        }
                    );
                }
            );
        }

        bos4w_display_dropdown.on('change', function () {
            $('#bos4w-selected-price').val($(this).find(":selected").attr("data-price"));
        });

        bos4w_button_text.html( wpr_bos4w_js.bos4w_buy_now );

        bos4w_plan_select.on(
            'click',
            function () {
                let bos4w_select = $(this).val();
                if( '1' === bos4w_select ) {
                    $( '.bos4w-display-dropdown' ).show('slow');
                } else {
                    $( '.bos4w-display-dropdown' ).hide('slow');
                }

                if (wpr_bos4w_js.bos4w_is_product) {
                    if ('1' === bos4w_select) {
                        bos4w_button_text.html( wpr_bos4w_js.bos4w_subscribe );
                    } else {
                        bos4w_button_text.html( wpr_bos4w_js.bos4w_buy_now );
                    }
                }
            }
        );

        function addZeroes(num) {
            let value,res;

            value = Number(num);
            if(isNaN(Number(num))) {
                value = num;
            }

            if(',' === wpr_bos4w_js.decimal_separator) {
                res = num.split(",");
            } else {
                res = num.split(".");
            }

            if(res.length === 1 || res[1].length < 3) {
                value = res[0] + '.' + res[1];
                value = Number(value).toFixed(2);
            }

            if(',' === wpr_bos4w_js.decimal_separator) {
                value = String(value).replace('.', ',');
            }

            return value;
        }
    }
);
