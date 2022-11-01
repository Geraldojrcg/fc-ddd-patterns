import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerRegisteredEvent from "../customer-registered.event";

export default class EnviaConsoleLog2Handler
  implements EventHandlerInterface<CustomerRegisteredEvent>
{
  handle(event: CustomerRegisteredEvent): void {
    console.log("Esse é o segundo console.log do evento: CustomerCreated");
  }
}
