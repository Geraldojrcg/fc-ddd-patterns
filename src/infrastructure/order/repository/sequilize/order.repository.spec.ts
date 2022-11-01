import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

async function makeSut() {
  const customerRepository = new CustomerRepository();
  const customer = new Customer("123", "Customer 1");
  const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
  customer.changeAddress(address);
  await customerRepository.create(customer);

  const productRepository = new ProductRepository();
  const product = new Product("123", "Product 1", 10);
  await productRepository.create(product);

  const ordemItem = new OrderItem(
    "1",
    product.name,
    product.price,
    product.id,
    2
  );

  const order = new Order("123", "123", [ordemItem]);

  const orderRepository = new OrderRepository();
  await orderRepository.create(order);

  return { order, ordemItem, customer };
}

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const { order, ordemItem } = await makeSut();

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: ordemItem.id,
          name: ordemItem.name,
          price: ordemItem.price,
          quantity: ordemItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update a order", async () => {
    const { order, ordemItem } = await makeSut();
    const productRepository = new ProductRepository();

    const product2 = new Product("456", "Product 2", 10);
    await productRepository.create(product2);

    const ordemItem2 = new OrderItem(
      "2",
      product2.name,
      product2.price,
      product2.id,
      1
    );

    order.addItem(ordemItem2);
    const orderRepository = new OrderRepository();
    await orderRepository.update(order);

    const orderModel = await OrderModel.findOne({
      where: { id: "123" },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: ordemItem.id,
          name: ordemItem.name,
          price: ordemItem.price,
          quantity: ordemItem.quantity,
          order_id: "123",
          product_id: "123",
        },
        {
          id: ordemItem2.id,
          name: ordemItem2.name,
          price: ordemItem2.price,
          quantity: ordemItem2.quantity,
          order_id: "123",
          product_id: "456",
        },
      ],
    });
  });

  it("should find a order", async () => {
    await makeSut();
    const orderRepository = new OrderRepository();
    const foundOrder = await orderRepository.find("123");
    const orderModel = await OrderModel.findOne({
      where: { id: "123" },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: foundOrder.id,
      customer_id: foundOrder.customerId,
      total: foundOrder.total(),
      items: [
        {
          id: foundOrder.items[0].id,
          name: foundOrder.items[0].name,
          price: foundOrder.items[0].price,
          quantity: foundOrder.items[0].quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should find all orders", async () => {
    const { order, customer, ordemItem } = await makeSut();

    const orderRepository = new OrderRepository();

    const orderItem2 = new OrderItem(
      "2313",
      ordemItem.name,
      ordemItem.price,
      ordemItem.productId,
      ordemItem.quantity
    );

    const order2 = new Order("323", customer.id, [orderItem2]);
    await orderRepository.create(order2);

    const orders = [order, order2];

    const foundOrders = await orderRepository.findAll();

    expect(orders).toEqual(foundOrders);
  });
});
