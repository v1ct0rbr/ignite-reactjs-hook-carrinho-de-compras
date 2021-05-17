import React from 'react';
import { MdDelete, MdAddCircleOutline, MdRemoveCircleOutline } from 'react-icons/md';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';

// import { useCart } from '../../hooks/useCart';
// import { formatPrice } from '../../util/format';

import { Container, ProductTable, Total } from './styles';

interface Product {
	id: number;
	title: string;
	price: number;
	image: string;
	amount: number;
}

const Cart = (): JSX.Element => {
	const { cart, removeProduct, updateProductAmount } = useCart();

	const cartFormatted = cart.map((product) => {
		return {
			...product,
			priceFormated: formatPrice(product.price),
			subtotal: formatPrice(product.price * product.amount),
		};
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
		updateProductAmount({ productId: product.id, amount: product.amount + 1 });
		// addProduct(product.id);
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
			{/* {cartFormatted.length > 0 ? (*/}
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
							<tr key={product.id} data-testid="product">
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
									<strong>{product.subtotal}</strong>
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
					{/* 	<tr data-testid="product">
							<td>
								<img
									src="https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg"
									alt="Tênis de Caminhada Leve Confortável"
								/>
							</td>
							<td>
								<strong>Tênis de Caminhada Leve Confortável testes</strong>
								<span>R$ 179,90</span>
							</td>
							<td>
								<div>
									<button
										type="button"
										data-testid="decrement-product"
										// disabled={product.amount <= 1}
										// onClick={() => handleProductDecrement()}
									>
										<MdRemoveCircleOutline size={20} />
									</button>
									<input type="text" data-testid="product-amount" readOnly value={2} />
									<button
										type="button"
										data-testid="increment-product"
										onClick={() =>
											handleProductIncrement({
												id: 20,
												amount: 3,
												image: 'asfasdf',
												price: 123,
												title: 'tesets',
											})
										}
									>
										<MdAddCircleOutline size={20} />
									</button>
								</div>
							</td>
							<td>
								<strong>R$ 359,80</strong>
							</td>
							<td>
								<button
									type="button"
									data-testid="remove-product"
									onClick={() => handleRemoveProduct(20)}
								>
									<MdDelete size={20} />
								</button>
							</td>
						</tr> */}
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

			{/* ) : (
				<EmptyCart>
					<Link to="/">
						<button type="button">Back to shopping</button>
					</Link>
					<img src={emptyCartImg} alt="empty cart" />
				</EmptyCart>
			)} */}
		</Container>
	);
};

export default Cart;
