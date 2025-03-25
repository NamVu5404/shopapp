package com.NamVu.service.impl;

import com.NamVu.constant.StatusConstant;
import com.NamVu.converter.CartConverter;
import com.NamVu.dto.request.cart.CartItemRequest;
import com.NamVu.dto.response.cart.CartResponse;
import com.NamVu.entity.Cart;
import com.NamVu.entity.CartItem;
import com.NamVu.entity.Product;
import com.NamVu.exception.AppException;
import com.NamVu.exception.ErrorCode;
import com.NamVu.repository.CartItemRepository;
import com.NamVu.repository.CartRepository;
import com.NamVu.repository.ProductRepository;
import com.NamVu.repository.UserRepository;
import com.NamVu.service.CartService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_EXISTED));

        cartItemRepository.deleteByCart_IdAndProduct_Id(cart.getId(), productId);
    }

    private Cart getCartOrCreateIfNotExisted(String userId) {
        return cartRepository.findByUser_Id(userId)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder()
                            .user(userRepository.findByIdAndIsActive(userId, StatusConstant.ACTIVE)
                                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)))
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
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));

        if (product.getInventoryQuantity() == 0)
            throw new AppException(ErrorCode.INVENTORY_NOT_ENOUGH);

        CartItem newItem = CartItem.builder()
                .cart(cart)
                .product(product)
                .quantity(request.getQuantity())
                .build();

        cart.getItems().add(newItem);
    }
}
