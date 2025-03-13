package com.javaweb.service.impl;

import com.javaweb.constant.StatusConstant;
import com.javaweb.converter.CartConverter;
import com.javaweb.dto.request.cart.CartItemRequest;
import com.javaweb.dto.response.cart.CartItemResponse;
import com.javaweb.dto.response.cart.CartResponse;
import com.javaweb.entity.Cart;
import com.javaweb.entity.CartItem;
import com.javaweb.entity.Product;
import com.javaweb.exception.CustomException;
import com.javaweb.exception.ErrorCode;
import com.javaweb.repository.CartItemRepository;
import com.javaweb.repository.CartRepository;
import com.javaweb.repository.ProductRepository;
import com.javaweb.repository.UserRepository;
import com.javaweb.service.CartService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartServiceImpl implements CartService {
    CartRepository cartRepository;
    UserRepository userRepository;
    ProductRepository productRepository;
    CartItemRepository cartItemRepository;
    CartConverter cartConverter;

    @Override
    public int getTotalItems(String userId) {
        return cartRepository.findByUser_Id(userId)
                .map(cart -> cart.getItems().stream().mapToInt(CartItem::getQuantity).sum())
                .orElse(0);
    }

    @Override
    public CartResponse getCartByUser(String userId) {
        Cart cart = cartRepository.findByUser_Id(userId)
                .orElse(null);

        return cart != null ? cartConverter.toResponse(cart) : null;
    }

    @Override
    @Transactional
    public void clearCart(String userId) {
        cartRepository.findByUser_Id(userId).ifPresent(cartRepository::delete);
    }

    @Override
    @Transactional
    public CartResponse addCartItem(CartItemRequest request) {
        Cart cart = getCartOrCreateIfNotExisted(request.getUserId());

        CartItem existedItem = cartItemRepository.findByCart_IdAndProduct_Id(cart.getId(), request.getProductId())
                .orElse(null);

        if (existedItem != null) {
            updateQuantity(existedItem, request);
        } else {
            createNewCartItem(cart, request);
        }

        cartRepository.save(cart);

        return cartConverter.toResponse(cart);
    }

    @Override
    @Transactional
    public void removeItem(String userId, String productId) {
        Cart cart = cartRepository.findByUser_Id(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.CART_NOT_EXISTS));

        cartItemRepository.deleteByCart_IdAndProduct_Id(cart.getId(), productId);
    }

    private Cart getCartOrCreateIfNotExisted(String userId) {
        return cartRepository.findByUser_Id(userId)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder()
                            .user(userRepository.findByIdAndIsActive(userId, StatusConstant.ACTIVE)
                                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_EXISTS)))
                            .build();

                    return cartRepository.save(newCart);
                });
    }

    private void updateQuantity(CartItem existedItem, CartItemRequest request) {
        if (request.getUpdatedQuantity() == null) {
             existedItem.setQuantity(request.getQuantity());
        } else {
            existedItem.setQuantity(existedItem.getQuantity() + request.getUpdatedQuantity());
        }
    }

    private void createNewCartItem(Cart cart, CartItemRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_EXISTS));

        if (product.getInventoryQuantity() == 0)
            throw new CustomException(ErrorCode.INVENTORY_NOT_ENOUGH);

        CartItem newItem = CartItem.builder()
                .cart(cart)
                .product(product)
                .quantity(request.getQuantity())
                .build();

        cart.getItems().add(newItem);
    }
}
