import { Fragment } from 'react'
import { useCart } from '../../hooks/useCart'
import { Trash } from '@phosphor-icons/react'
import { QuantityInput } from '../../components/Form/QuantityInput'
import { CartTotal, CartTotalInfo, CheckoutButton, Coffee, CoffeeInfo, Container, InfoContainer } from './styles'
import { Tags } from '../../components/CoffeeCard/styles'
import { useNavigate } from 'react-router-dom'

export interface OrderInfo {
  address: string
  city: string
  paymentMethod: 'credit' | 'debit' | 'money'
  items: {
    id: string
    quantity: number
  }[]
}


export function Cart() {
  const { cart, incrementItemQuantity, decrementItemQuantity, removeItem } = useCart()

  const navigate = useNavigate()
  const { checkout } = useCart()


  const amountTags: string[] = []

  cart.forEach((coffee) => {
    coffee.tags.forEach((tag) => {
      if (!amountTags.includes(tag)) {
        amountTags.push(tag)
      }
    })
  })

  const totalItemsPrice = cart.reduce((currencyValue, coffee) => currencyValue + coffee.price * coffee.quantity, 0)

  const DELIVERY_PRICE = 3.75 * amountTags.length

  function handleItemIncrement(itemId: string) {
    incrementItemQuantity(itemId)
  }

  function handleItemDecrement(itemId: string) {
    decrementItemQuantity(itemId)
  }

  function handleItemRemove(itemId: string) {
    removeItem(itemId)
  }

  function handleConfirmOrder() {
    const orderInfo: OrderInfo = {
      address: 'Rua Exemplo, 123',
      city: 'Cidade Exemplo',
      paymentMethod: 'credit',
      items: cart.map((item) => ({
        id: item.id,
        quantity: item.quantity
      }))
    }
  
    checkout(orderInfo, (path) => navigate(path))
  }

  return (
    <Container>
      <InfoContainer>
        <h2>Cafés selecionados</h2>
        <CartTotal>
          {cart.map((coffee) => (
            <Fragment key={coffee.id}>
              <Coffee>
                <div>
                  <img src={coffee.image} alt={coffee.title} />
                  <div>
                    <span>{coffee.title}</span>
                    <Tags>
                      {coffee.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </Tags>
                    <CoffeeInfo>
                      <QuantityInput
                        quantity={coffee.quantity}
                        incrementQuantity={() => handleItemIncrement(coffee.id)}
                        decrementQuantity={() => handleItemDecrement(coffee.id)}
                      />
                      <button onClick={() => handleItemRemove(coffee.id)}>
                        <Trash />
                        <span>Remover</span>
                      </button>
                    </CoffeeInfo>
                  </div>
                </div>
                <aside>R$ {(coffee.price * coffee.quantity).toFixed(2)}</aside>
              </Coffee>
            </Fragment>
          ))}
          <CartTotalInfo>
            <div>
              <span>Total de itens</span>
              <span>{new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(totalItemsPrice)}</span>
            </div>
            <div>
              <span>Entrega</span>
              <span>{new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(DELIVERY_PRICE)}</span>
            </div>
            <div>
              <span>Total</span>
              <span>{new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(totalItemsPrice + DELIVERY_PRICE)}</span>
            </div>
          </CartTotalInfo>
          <CheckoutButton type="button" onClick={handleConfirmOrder}>
            Confirmar pedido
          </CheckoutButton>
        </CartTotal>
      </InfoContainer>
    </Container>
  )
}
