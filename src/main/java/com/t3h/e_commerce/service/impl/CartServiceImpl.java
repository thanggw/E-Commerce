package com.t3h.e_commerce.service.impl;

import com.t3h.e_commerce.dto.ApiResponse;
import com.t3h.e_commerce.dto.requests.AddToCartRequest;
import com.t3h.e_commerce.dto.requests.CartItemUpdate;
import com.t3h.e_commerce.dto.responses.CartResponse;
import com.t3h.e_commerce.entity.CartEntity;
import com.t3h.e_commerce.entity.CartItemEntity;
import com.t3h.e_commerce.entity.ProductEntity;
import com.t3h.e_commerce.entity.UserEntity;
import com.t3h.e_commerce.exception.CustomExceptionHandler;
import com.t3h.e_commerce.mapper.CartMapper;
import com.t3h.e_commerce.repository.CartItemRepository;
import com.t3h.e_commerce.repository.CartRepository;
import com.t3h.e_commerce.repository.ProductRepository;
import com.t3h.e_commerce.service.ICartService;
import com.t3h.e_commerce.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements ICartService {
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final IUserService iUserService;

    @Override
    public CartResponse addToCart(AddToCartRequest request, int page, int size) {

        UserEntity userLoggedIn = iUserService.getUserLoggedIn();

        if (userLoggedIn == null){
            throw CustomExceptionHandler.unauthorizedException("User not logged in");
        }

        CartEntity cartEntity = userLoggedIn.getCart();

        List<CartItemEntity> cartItemEntities = cartEntity.getCartItems();

        if (cartItemEntities.isEmpty()){
                cartEntity.setCartItems(new ArrayList<>());
        }

        //check in cart was existed before adding to cart
        int quantityPurchased = request.getQuantity();
        int productIdPurchasedId = request.getProductId();

        ProductEntity product = productRepository.findById(productIdPurchasedId)
                .orElseThrow(() -> CustomExceptionHandler.notFoundException("Product not found"));

        if (product.getQuantity() < quantityPurchased || product.getQuantity() == 0){
            throw CustomExceptionHandler.badRequestException("Product is stocked. Please select another product");
        }

        Optional<CartItemEntity> existingCartItemOpt = cartItemEntities.stream()
                .filter(cartItemEntity -> Objects.equals(cartItemEntity.getProduct().getId(), productIdPurchasedId))
                .findFirst();

        //check if product exists
        if (existingCartItemOpt.isPresent()){

            CartItemEntity existingCartItem = existingCartItemOpt.get();

            int previousQuantityPurchased = existingCartItem.getQuantity();
            int newQuantityPurchased = previousQuantityPurchased + quantityPurchased;

            existingCartItem.setQuantity(newQuantityPurchased);

            //convert quantity from int to BigDecimal

            existingCartItem.setPrice(multiplyQuantityPurchasedAndPrice(product.getPrice(), quantityPurchased));

            cartEntity.getCartItems().add(existingCartItem);

            int availableProductQuantity = product.getQuantity();
            int productQuantityUpdate = availableProductQuantity - quantityPurchased;

            product.setQuantity(productQuantityUpdate);
            product.setAvailable(productQuantityUpdate <= 0);

            cartItemRepository.save(existingCartItem);

        }
        //product doesn't exist
        else {

            CartItemEntity newCartItemEntity = new CartItemEntity();
            newCartItemEntity.setCart(cartEntity);
            newCartItemEntity.setProduct(product);
            newCartItemEntity.setQuantity(quantityPurchased);
            newCartItemEntity.setPrice(multiplyQuantityPurchasedAndPrice(product.getPrice(), quantityPurchased));
            cartItemEntities.add(newCartItemEntity);

            product.setQuantity(product.getQuantity() - quantityPurchased);
            product.setAvailable(product.getQuantity() > 0);

            cartEntity.getCartItems().add(newCartItemEntity);

            cartItemRepository.save(newCartItemEntity);

        }
        productRepository.save(product);
        cartRepository.save(cartEntity);

        CartResponse cartResponse = CartMapper.toCartResponse(cartEntity, page, size);
        cartEntity.setTotalQuantity(cartItemEntities.stream().mapToInt(CartItemEntity::getQuantity).sum());
        return cartResponse;
    }

    @Override
    public ApiResponse<CartResponse> updateCart(Integer itemId, CartItemUpdate request) {
        UserEntity userLoggedIn = iUserService.getUserLoggedIn();

        if (userLoggedIn == null){
            throw CustomExceptionHandler.unauthorizedException("User not logged in");
        }

        CartEntity cartEntity = userLoggedIn.getCart();

        List<CartItemEntity> cartItemEntities = cartEntity.getCartItems();

        if (!cartItemEntities.isEmpty()){

            CartItemEntity cartItemUpdate = cartItemRepository.findById(itemId)
                    .orElseThrow(() -> CustomExceptionHandler.notFoundException("No such item"));

        }


        return ApiResponse.<CartResponse>builder()

                .build();
    }

    @Override
    public ApiResponse<CartResponse> deleteCart(Integer itemId) {
        return null;
    }

    private BigDecimal multiplyQuantityPurchasedAndPrice(BigDecimal price, int quantityPurchased){
        return price.multiply(BigDecimal.valueOf(quantityPurchased));
    }

}
