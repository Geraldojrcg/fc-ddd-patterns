import RepositoryInterface from "../../../../domain/@shared/repository/repository-interface";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements RepositoryInterface<Order> {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          order_id: entity.id,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }
  async update(entity: Order): Promise<void> {
    await OrderItemModel.destroy({
      where: { order_id: entity.id },
    });
    const newItems = entity.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      product_id: item.productId,
      quantity: item.quantity,
      order_id: entity.id,
    }));
    await OrderItemModel.bulkCreate(newItems);
    await OrderModel.update(
      {
        total: entity.total(),
      },
      {
        where: { id: entity.id },
      }
    );
  }
  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({
      where: { id },
      include: ["items"],
    });
    return this.transformOrder(orderModel);
  }
  async findAll(): Promise<Order[]> {
    const ordersModel = await OrderModel.findAll({ include: ["items"] });
    return ordersModel.map(this.transformOrder);
  }

  private transformOrder(orderModel: OrderModel): Order {
    const orderItems = orderModel.items.map(
      (item) =>
        new OrderItem(
          item.id,
          item.name,
          item.price / item.quantity,
          item.product_id,
          item.quantity
        )
    );
    return new Order(orderModel.id, orderModel.customer_id, orderItems);
  }
}
