import React from 'react';
import { MdDelete, MdAddCircleOutline, MdRemoveCircleOutline } from 'react-icons/md';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';

// import { useCart } from '../../hooks/useCart';
// import { formatPrice } from '../../util/format';

import emptyCartImg from '../../assets/images/empty-cart.png';

import { Container, EmptyCart, ProductTable, Total } from './styles';
import { Link } from 'react-router-dom';

interface Product {
	id: number;
	title: string;
	price: number;
	image: string;
	amount: number;
}

const Cart = (): JSX.Element => {
	const { cart, addProduct, removeProduct, updateProductAmount } = useCart();

	const cartFormatted = cart.map((product) => {
		return { ...product, priceFormated: formatPrice(product.price) };
		// TODO
	});
	const total = formatPrice(
		cart.reduce((sumTotal, product) => {
			// TODO
			sumTotal += product.amount * product.price;
			return sumTotal;
		}, 0)
	);

	// should be able to increase a product amount
	function handleProductIncrement(product: Product) {
		// TODO
		addProduct(product.id);
	}

	// should be able to decrease a product amount
	function handleProductDecrement(product: Product) {
		// should not be able to decrease a product amount when value is 1
		// *** tested in useCart  ***

		updateProductAmount({ productId: product.id, amount: product.amount - 1 });
	}

	// shoud be able to remove a product
	function handleRemoveProduct(productId: number) {
		removeProduct(productId);
	}

	return (
		<Container>
			{cartFormatted.length > 0 ? (
				<>
					<ProductTable>
						<thead>
							<tr>
								<th aria-label="product image" />
								<th>PRODUTO</th>
								<th>QTD</th>
								<th>SUBTOTAL</th>
								<th aria-label="delete icon" />
							</tr>
						</thead>
						<tbody>
							{cartFormatted.map((product, idx) => (
								<tr key={product.id}>
									<td>
										<img src={product.image} alt={product.title} />
									</td>
									<td>
										<strong>{product.title}</strong>
										<span>{product.priceFormated}</span>
									</td>
									<td>
										<div>
											<button
												type="button"
												data-testid="decrement-product"
												disabled={product.amount <= 1}
												onClick={() => handleProductDecrement(product)}
											>
												<MdRemoveCircleOutline size={20} />
											</button>
											<input
												type="text"
												data-testid="product-amount"
												value={product.amount}
												readOnly
											/>
											<button
												type="button"
												data-testid="increment-product"
												onClick={() => handleProductIncrement(product)}
											>
												<MdAddCircleOutline size={20} />
											</button>
										</div>
									</td>
									<td>
										<strong>{formatPrice(product.price * product.amount)}</strong>
									</td>
									<td>
										<button
											type="button"
											data-testid="remove-product"
											onClick={() => handleRemoveProduct(product.id)}
										>
											<MdDelete size={20} />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</ProductTable>

					<footer>
						<button type="button">Finalizar pedido</button>

						<Total>
							<span>TOTAL</span>
							<strong>{total}</strong>
						</Total>
					</footer>
				</>
			) : (
				<EmptyCart>
					<Link to="/">
						<button type="button">Back to shopping</button>
					</Link>
					<img src={emptyCartImg} alt="empty cart" />
				</EmptyCart>
			)}
		</Container>
	);
};

export default Cart;
