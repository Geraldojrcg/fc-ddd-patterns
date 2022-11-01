import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerRegisteredEvent from "../customer-registered.event";

export default class EnviaConsoleLogHandler
  implements EventHandlerInterface<CustomerRegisteredEvent>
{
  handle(event: CustomerRegisteredEvent): void {
    const { id, name, Address } = event.eventData;
    console.log(
      `Endereço do cliente: ${id}, ${name} alterado para: ${Address.toString()}`
    );
  }
}
