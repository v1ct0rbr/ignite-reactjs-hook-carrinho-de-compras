import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';
import { messages } from '../lang/messages.pt-br';

interface CartProviderProps {
	children: ReactNode;
}

interface UpdateProductAmount {
	productId: number;
	amount: number;
}

interface CartContextData {
	cart: Product[];
	addProduct: (productId: number) => Promise<void>;
	removeProduct: (productId: number) => void;
	updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
	// should be able to initialize cart with localStorage value
	const [cart, setCart] = useState<Product[]>(() => {
		const storagedCart = localStorage.getItem('@RocketShoes:cart');
		if (storagedCart) {
			return JSON.parse(storagedCart);
		}
		return [];
	});
	const [stocks, setStocks] = useState<Stock[]>([]);

	useEffect(() => {
		api.get('/stock').then((response) => {
			const data = response.data;
			setStocks(data);
		});
	}, []);

	localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart));

	const addProduct = async (productId: number) => {
		try {
			const productIndex = cart.findIndex((prod) => prod.id === productId);

			if (productIndex < 0) {
				api.get(`/products/${productId}`).then((response) => {
					if (response?.data) {
						//should be able to add a new product
						if (isValidAmount(response.data.id, 1)) setCart([...cart, { ...response.data, amount: 1 }]);
						else {
							// should not be able to increase a product amount when running out of stock - parte1
							throw messages.errors.error_no_stock;
						}
					} else {
						//should not be able add a product that does not exist
						throw messages.errors.error_add_product;
					}
				});
			} else {
				let cartTemp = cart.map((product, idx) => {
					if (product.id === productId) {
						let newAmount = product.amount + 1;
						if (!isValidAmount(product.id, newAmount)) {
							// should not be able to increase a product amount when running out of stock - parte2
							throw messages.errors.error_no_stock;
						}
						//should be able to increase a product amount when adding a product that already exists on cart
						return { ...product, amount: newAmount };
					} else {
						return product;
					}
				});
				setCart(cartTemp);
			}
		} catch (e) {
			toast.error(e.toString());
		}
	};

	const removeProduct = (productId: number) => {
		try {
			//should not be able to remove a product that does not exist
			const prodIndex = cart.findIndex((prod) => prod.id === productId);
			if (prodIndex < 0) {
				throw messages.errors.error_remove_product;
			}

			// should be able to remove a product
			const cartTemp = cart.filter((prod) => prod.id !== productId);
			setCart(cartTemp);
		} catch (e) {
			// TODO
			toast.error(e);
		}
	};

	const updateProductAmount = async ({ productId, amount }: UpdateProductAmount) => {
		try {
      // should not be able to update a product that does not exist
			const prodIndex = cart.findIndex((prod) => prod.id === productId);
			if (prodIndex < 0) {
				throw messages.errors.error_update_product;
			}
      // should not be able to update a product amount to a value smaller than 1
			if (amount < 1) {
				throw messages.errors.error_amount_must_be_greater_than_1;
			}
			let cartTemp = cart.map((product, idx) => {
				if (product.id !== productId) {
					return { ...product };
				} else {
          // should not be able to update a product amount when running out of stock
					if (!isValidAmount(productId, amount)) throw messages.errors.error_no_stock;

					return { ...product, amount };
				}
			});
			setCart(cartTemp);
		} catch (e) {
			toast.error(e);
		}
	};

	function isValidAmount(productId: number, newAmount: number) {
		const stockProd = stocks.find((stk) => stk.id === productId);
		if (stockProd?.amount && newAmount > 0) {
			return newAmount <= stockProd.amount;
		}
		return false;
	}

	return (
		<CartContext.Provider value={{ cart, addProduct, removeProduct, updateProductAmount }}>
			{children}
		</CartContext.Provider>
	);
}

export function useCart(): CartContextData {
	const context = useContext(CartContext);

	return context;
}
