
(function ($) {
    "use strict";


    console.log("vallom nadakko")

    /*[ Load page ]
    ===========================================================*/
    $(".animsition").animsition({
        inClass: 'fade-in',
        outClass: 'fade-out',
        inDuration: 1500,
        outDuration: 800,
        linkElement: '.animsition-link',
        loading: true,
        loadingParentElement: 'html',
        loadingClass: 'animsition-loading-1',
        loadingInner: '<div class="loader05"></div>',
        timeout: false,
        timeoutCountdown: 5000,
        onLoadEvent: true,
        browser: [ 'animation-duration', '-webkit-animation-duration'],
        overlay : false,
        overlayClass : 'animsition-overlay-slide',
        overlayParentElement : 'html',
        transition: function(url){ window.location.href = url; }
    });
    
    /*[ Back to top ]
    ===========================================================*/
    var windowH = $(window).height()/2;

    $(window).on('scroll',function(){
        if ($(this).scrollTop() > windowH) {
            $("#myBtn").css('display','flex');
        } else {
            $("#myBtn").css('display','none');
        }
    });

    $('#myBtn').on("click", function(){
        $('html, body').animate({scrollTop: 0}, 300);
    });


    /*==================================================================
    [ Fixed Header ]*/
    var headerDesktop = $('.container-menu-desktop');
    var wrapMenu = $('.wrap-menu-desktop');

    if($('.top-bar').length > 0) {
        var posWrapHeader = $('.top-bar').height();
    }
    else {
        var posWrapHeader = 0;
    }
    

    if($(window).scrollTop() > posWrapHeader) {
        $(headerDesktop).addClass('fix-menu-desktop');
        $(wrapMenu).css('top',0); 
    }  
    else {
        $(headerDesktop).removeClass('fix-menu-desktop');
        $(wrapMenu).css('top',posWrapHeader - $(this).scrollTop()); 
    }

    $(window).on('scroll',function(){
        if($(this).scrollTop() > posWrapHeader) {
            $(headerDesktop).addClass('fix-menu-desktop');
            $(wrapMenu).css('top',0); 
        }  
        else {
            $(headerDesktop).removeClass('fix-menu-desktop');
            $(wrapMenu).css('top',posWrapHeader - $(this).scrollTop()); 
        } 
    });


    /*==================================================================
    [ Menu mobile ]*/
    $('.btn-show-menu-mobile').on('click', function(){
        $(this).toggleClass('is-active');
        $('.menu-mobile').slideToggle();
    });

    var arrowMainMenu = $('.arrow-main-menu-m');

    for(var i=0; i<arrowMainMenu.length; i++){
        $(arrowMainMenu[i]).on('click', function(){
            $(this).parent().find('.sub-menu-m').slideToggle();
            $(this).toggleClass('turn-arrow-main-menu-m');
        })
    }

    $(window).resize(function(){
        if($(window).width() >= 992){
            if($('.menu-mobile').css('display') == 'block') {
                $('.menu-mobile').css('display','none');
                $('.btn-show-menu-mobile').toggleClass('is-active');
            }

            $('.sub-menu-m').each(function(){
                if($(this).css('display') == 'block') { console.log('hello');
                    $(this).css('display','none');
                    $(arrowMainMenu).removeClass('turn-arrow-main-menu-m');
                }
            });
                
        }
    });


    /*==================================================================
    [ Show / hide modal search ]*/
    $('.js-show-modal-search').on('click', function(){
        $('.modal-search-header').addClass('show-modal-search');
        $(this).css('opacity','0');
    });

    $('.js-hide-modal-search').on('click', function(){
        $('.modal-search-header').removeClass('show-modal-search');
        $('.js-show-modal-search').css('opacity','1');
    });

    $('.container-search-header').on('click', function(e){
        e.stopPropagation();
    });


    /*==================================================================
    [ Isotope ]*/
    
    $(document).ready(function () {
        console.log("nadakkilla");
        var categoryName = document.getElementById("categoryname").value;
        var $topeContainer = $('.isotope-grid');
        var $filter = $('.filter-tope-group');
        var $paginationContainer = $('.pagination-container');
    
        var productsPerPage = 3;
        var currentPage = 1;
        var currentFilter = '*';
    
        if (categoryName !== "false") {
            currentFilter = categoryName;
        }
         let brandFilter;
        function paginateProducts() {
            
            // Apply Isotope filter
            if (brandFilter) {
               
                let filteredBrandProducts = $('.isotope-item').filter(function () {
                    
                    const productBrands = $(this).attr('class').split(" "); // Get the class attribute
                    const brandClasses = productBrands.flatMap(className => className.split(',')); // Split each class name by comma and flatten the array
                     return brandClasses.some(className => className === brandFilter.substring(1));
                });
                
                let startIndex = (currentPage - 1) * productsPerPage;
                let endIndex = startIndex + productsPerPage;
                
                // Limit the filtered products to the range determined by the current page
                let productsForCurrentPage = filteredBrandProducts.slice(startIndex, endIndex);

                $topeContainer.isotope({ filter: productsForCurrentPage });

                // Calculate total pages based on filtered products
                
                let totalPages = Math.ceil(filteredBrandProducts.length / productsPerPage);
            
                // Generate pagination buttons
                var paginationDiv = $('.pagination');
                paginationDiv.empty();
                for (var i = 1; i <= totalPages; i++) {
                    var btn = $('<li>').addClass('page-item').append(
                        $('<a>').addClass('page-link').attr('href', '#').text(i).on('click', function (e) {
                            e.preventDefault();
                            currentPage = $(this).text();
                            paginateProducts();
                        })
                    );
                    if (i == currentPage) {
                        btn.addClass('active');
                    }
                    paginationDiv.append(btn);
                }


               
            }else{
                let filteredItems;
            
            var filterValue = function () {
                filteredItems = $('.isotope-item').filter(currentFilter);
                var index = filteredItems.index(this);
                return index >= (currentPage - 1) * productsPerPage && index < currentPage * productsPerPage;
            };

         
            $topeContainer.isotope({ filter: filterValue });
                

                        
    
            // Calculate total pages based on filtered products
            let totalPages;
            if (currentFilter === "*") {
                var allProducts = $('.isotope-item');
                totalPages = Math.ceil(allProducts.length / productsPerPage);
            } else {
                totalPages = Math.ceil(filteredItems.length / productsPerPage);
            }
        
    
            // Generate pagination buttons
            var paginationDiv = $('.pagination');
            paginationDiv.empty();
            for (var i = 1; i <= totalPages; i++) {
                var btn = $('<li>').addClass('page-item').append(
                    $('<a>').addClass('page-link').attr('href', '#').text(i).on('click', function (e) {
                        e.preventDefault();
                        currentPage = $(this).text();
                        paginateProducts();
                    })
                );
                if (i == currentPage) {
                    btn.addClass('active');
                }
                paginationDiv.append(btn);
            }
        }

        }
    
        $filter.on('click', 'button', function () {
            brandFilter=null;
            currentFilter = $(this).attr('data-filter');
            currentPage = 1; // Reset to the first page when a new filter is applied
            paginateProducts();
        });
    
        $('.filter-link').on('click', function () {
             brandFilter = $(this).attr('data-filter');
            console.log(brandFilter);
            currentPage = 1; // Reset to the first page when a new filter is applied
            paginateProducts();
        });
    
        $paginationContainer.on('click', '.page-link', function (e) {
            e.preventDefault();
            var targetPage = parseInt($(this).text());
            currentPage = targetPage;
            paginateProducts();
        });
    
        // Search functionality

      
      
        $('.search-input').on('keyup', function () {
            var searchValue = $(this).val().toLowerCase();
              console.log(searchValue);
              if(searchValue.length===0){
                
                paginateProducts();
                  // Filter Isotope items based on search value
            }else{
                $('.isotope-grid').isotope({
                    filter: function () {
                        // Get the product name
                        var productName = $(this).find('.js-name-b2').text().toLowerCase().trim();
                       
                        return productName.startsWith(searchValue);
                    },
                });
                
               console.log($('.isotope-grid'));

            }

          
           
           
        });
    
        paginateProducts();
        $(window).on('load', function () {
            console.log("inititafj");
            if (categoryName) {
                console.log(categoryName);
                var $categoryButton = $filter.find('button[data-filter=".' + categoryName + '"]');
                if ($categoryButton.length > 0) {
                    $categoryButton.trigger('click');
                }
            }
    
            
        });
        
    });
    
    
    
    
    var isotopeButton = $('.filter-tope-group button');
    // console.log(isotopeButton);

    $(isotopeButton).each(function(){
        $(this).on('click', function(){
            for(var i=0; i<isotopeButton.length; i++) {
                console.log(this);
                $(isotopeButton[i]).removeClass('how-active1');
            }

            $(this).addClass('how-active1');
        });
    });

    

    /*==================================================================
    [ Filter / Search product ]*/
    $('.js-show-filter').on('click',function(){
        $(this).toggleClass('show-filter');
        $('.panel-filter').slideToggle(400);

        if($('.js-show-search').hasClass('show-search')) {
            $('.js-show-search').removeClass('show-search');
            $('.panel-search').slideUp(400);
        }    
    });

  $('.js-show-search').on('click', function () {
    // Toggle the 'show-search' class on the search button
    $(this).toggleClass('show-search');

    // Slide toggle the search panel
    $('.panel-search').slideToggle(400);

    // Check if the filter panel is currently shown, and if so, hide it
    if ($('.js-show-filter').hasClass('show-filter')) {
        $('.js-show-filter').removeClass('show-filter');
        $('.panel-filter').slideUp(400);
    }

    // Search functionality
    
});





    /*==================================================================
    [ Cart ]*/
    $('.js-show-cart').on('click',function(){
        $('.js-panel-cart').addClass('show-header-cart');
    });

    $('.js-hide-cart').on('click',function(){
        $('.js-panel-cart').removeClass('show-header-cart');
    });

    /*==================================================================
    [ Cart ]*/
    $('.js-show-sidebar').on('click',function(){
        $('.js-sidebar').addClass('show-sidebar');
    });

    $('.js-hide-sidebar').on('click',function(){
        $('.js-sidebar').removeClass('show-sidebar');
    });

    /*==================================================================
    [ +/- num product ]*/
    $('.btn-num-product-down').on('click', function(){
        var numProduct = Number($(this).next().val());
        if(numProduct > 0) $(this).next().val(numProduct - 1);
    });

    $('.btn-num-product-up').on('click', function(){
        var numProduct = Number($(this).prev().val());
        $(this).prev().val(numProduct + 1);
    });

    /*==================================================================
    [ Rating ]*/
    $('.wrap-rating').each(function(){
        var item = $(this).find('.item-rating');
        var rated = -1;
        var input = $(this).find('input');
        $(input).val(0);

        $(item).on('mouseenter', function(){
            var index = item.index(this);
            var i = 0;
            for(i=0; i<=index; i++) {
                $(item[i]).removeClass('zmdi-star-outline');
                $(item[i]).addClass('zmdi-star');
            }

            for(var j=i; j<item.length; j++) {
                $(item[j]).addClass('zmdi-star-outline');
                $(item[j]).removeClass('zmdi-star');
            }
        });

        $(item).on('click', function(){
            var index = item.index(this);
            rated = index;
            $(input).val(index+1);
        });

        $(this).on('mouseleave', function(){
            var i = 0;
            for(i=0; i<=rated; i++) {
                $(item[i]).removeClass('zmdi-star-outline');
                $(item[i]).addClass('zmdi-star');
            }

            for(var j=i; j<item.length; j++) {
                $(item[j]).addClass('zmdi-star-outline');
                $(item[j]).removeClass('zmdi-star');
            }
        });
    });
    
    /*==================================================================
    [ Show modal1 ]*/
    $('.js-show-modal1').on('click',function(e){
        e.preventDefault();
        var productName = $(this).data('product-name')
        fetch(`/productbrands?productName=${productName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            console.log(data);
            var productImage = $(this).data('product-image') + '?' + new Date().getTime();
            var productCategory =$(this).data("product-category")
            var productBrand = $(this).data('product-brand');
            var productRegion = $(this).data('product-region')
            var productDescription = $(this).data('product-description');
     



        $('#productimage').attr('src', productImage);
            $('#productname').text(productName);
            $('#productcategory').text(productCategory);
            $('#productbrand').text(productBrand);
            $('#productregion').text(productRegion);
            $('#productdescription').text(productDescription);

            var brandList = document.getElementById('brandList');
            brandList.innerHTML = ''; // Clear previous content
           
                var li = document.createElement('li');
                li.textContent = data.brand;
                brandList.appendChild(li);
           
          
        $('.js-modal1').addClass('show-modal1');
    }).catch(error=>{
        console.error('There was a problem with the fetch operation:', error);

    })
});

    $('.js-hide-modal1').on('click',function(){
        console.log("hello")
        setTimeout(()=>{
            $('#productimage').attr('src', '');

        },500)
       
        $('.js-modal1').removeClass('show-modal1');
    });



})(jQuery);