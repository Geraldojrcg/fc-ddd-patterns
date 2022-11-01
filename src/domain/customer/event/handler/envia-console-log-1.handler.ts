import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerRegisteredEvent from "../customer-registered.event";

export default class EnviaConsoleLog1Handler
  implements EventHandlerInterface<CustomerRegisteredEvent>
{
  handle(event: CustomerRegisteredEvent): void {
    console.log("Esse é o primeiro console.log do evento: CustomerCreated");
  }
}
