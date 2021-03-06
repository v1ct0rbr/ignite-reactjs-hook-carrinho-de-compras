import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
	id: number;
	title: string;
	price: number;
	image: string;
}

interface ProductFormatted extends Product {
	priceFormatted: string;
}

interface CartItemsAmount {
	[key: number]: number;
}

const Home = (): JSX.Element => {
	const [products, setProducts] = useState<ProductFormatted[]>([]);

	const { addProduct, cart } = useCart();

	// should be able to render each product quantity added to cart
	const cartItemsAmount = cart.reduce((sumAmount, product) => {
		sumAmount[product.id] = product.amount;
		return sumAmount;
	}, {} as CartItemsAmount);

	useEffect(() => {
		async function loadProducts() {
			await api.get(`/products`).then((response) => {
				if (response?.data) {
					const productsTemp = response.data.map((product: Product) => {
						return { ...product, priceFormatted: formatPrice(product.price) };
					});
					setProducts(productsTemp);
				}
			});
		}

		loadProducts();
	}, []);

	useEffect(() => {}, []);

	// should be able to add a product to cart
	function handleAddProduct(id: number) {
		addProduct(id);
	}

	return (
		<ProductList>
			{products.map((product, idx) => {
				return (
					<li key={product.id}>
						<img src={product.image} alt={product.title} />
						<strong>{product.title}</strong>

						<span>{product.priceFormatted}</span>
						<button
							type="button"
							data-testid="add-product-button"
							// should be able to add a product to cart
							onClick={() => handleAddProduct(product.id)}
						>
							<div data-testid="cart-product-quantity">
								<MdAddShoppingCart size={16} color="#FFF" />
								{cartItemsAmount[product.id] || 0}
							</div>

							<span>ADICIONAR AO CARRINHO</span>
						</button>
					</li>
				);
			})}
			{/* <li key={30}>
						<img src="https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis2.jpg" alt="teste" />
						<strong>teste</strong>

						<span>R$ 300</span>
						<button
							type="button"
							data-testid="add-product-button"
							// should be able to add a product to cart
							onClick={() => handleAddProduct(30)}
						>
							<div data-testid="cart-product-quantity">
								<MdAddShoppingCart size={16} color="#FFF" />
								{cartItemsAmount[30] || 0}
							</div>

							<span>ADICIONAR AO CARRINHO</span>
						</button>
					</li> */}
		</ProductList>
	);
};

export default Home;
