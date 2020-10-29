import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  /**
   * Funçao responsável por calcular o PREÇO TOTAL do carrinho
   */
  const cartTotal = useMemo(() => {
    const total = products.reduce((accumulator, product) => {
      const subtotalPrice = product.quantity * product.price;

      return accumulator + subtotalPrice;
    }, 0);

    return formatValue(total);
  }, [products]);

  /**
   * Funçao responsável por calcular a QUANTIDADE TOTAL de itens no carrinho
   */
  const totalItensInCart = useMemo(() => {
    const total = products.reduce((accumulator, product) => {
      const subtotalQuantity = product.quantity;

      return accumulator + subtotalQuantity;
    }, 0);

    return total;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
