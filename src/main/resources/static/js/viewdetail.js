const URL = 'http://localhost:8080/products';
$(document).ready(function(){
    $('.image').on('click', function(){
        const productId = $(this).data('id');
        $.ajax({
            url: `${URL}/get/${productId}`,
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                console.log('Product data:', response);
                displayProductDetails(response);
            },
            error: function (error) {
                console.error('Error fetching product:', error);
            }
        });
    });
    $('.add-to-cart').on('click', function () {
        const productId = $(this).data('id');
        addToCart(productId);
    });
})
function displayProductDetails(product){
$('#productName').text(product.name);
$('#productImage').text('src', product.imageUrl)
$('#productPrice').text(product.price)
$('#productDescription').text(product.description)
    $('#productDetailModal').show();
}
function addToCart(productId){
    const existingProductIndex = cart.findIndex(item => item.id === productId);
if(existingProductIndex > -1){
    cart[existingProductIndex].quantity += 1;
}else{
    $.ajax({
        url:`${URL}/get/${productId}`,
        type: 'POST',
        contentType: 'application/json',
        success: function (respone){
            cart.push({
                id: respone.id,
                name: respone.price,
                quantity: 1
            });
            console.log('cart uplated:' , cart);
            alert(`${response.name} has been added to your cart.`);
        },
        error: function (error){
            console.error('Error adding product to cart:', error);
        }
    })
}
}