import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    /**
     * Carregar produtos armazenados no Async Storage
     */
    async function loadProducts(): Promise<void> {
      const productsInStorage = await AsyncStorage.getItem(
        'GoMarketplace:products',
      );

      if (productsInStorage) {
        setProducts([...JSON.parse(productsInStorage)]);
      }
    }

    loadProducts();
  }, []);

  /**
   * Funçao responsável por adicionar um produto no carrinho, verficando se ele já existe no carrinho ou nao
   */
  const addToCart = useCallback(
    async product => {
      const productExists = products.find(item => item.id === product.id);

      if (productExists) {
        setProducts(
          products.map(item =>
            item.id === product.id
              ? { ...product, quantity: item.quantity + 1 }
              : item,
          ),
        );
      } else {
        setProducts([...products, { ...product, quantity: 1 }]);
      }

      await AsyncStorage.setItem(
        'GoMarketplace:products',
        JSON.stringify(products),
      );
    },
    [products],
  );

  /**
   * Funçao responsável pelo AUMENTO da QUANTIDADE de um produto no carrinho
   */
  const increment = useCallback(
    async id => {
      const productIncremented = products.map(product =>
        product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product,
      );
      setProducts(productIncremented);

      await AsyncStorage.setItem(
        'GoMarketplace:products',
        JSON.stringify(productIncremented),
      );
    },
    [products],
  );

  /**
   * Funçao responsável pelo DECRÉSCIMO da QUANTIDADE de um produto no carrinho
   */
  const decrement = useCallback(
    async id => {
      const productDecremented = products.map(product =>
        product.id === id
          ? { ...product, quantity: product.quantity - 1 }
          : product,
      );
      setProducts(productDecremented);

      await AsyncStorage.setItem(
        'GoMarketplace:products',
        JSON.stringify(productDecremented),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
