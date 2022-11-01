import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import Address from "../value-object/address";
import CustomerChangedAddressEvent from "./customer-changed-address.event";
import EnviaConsoleLogHandler from "./handler/envia-console-log.handler";

describe("Customer changed address event tests", () => {
  it("should notify a event when customer changes the address", () => {
    const eventDispatcher = new EventDispatcher();
    const enviaConsoleLogHandler = new EnviaConsoleLogHandler();
    eventDispatcher.register(
      CustomerChangedAddressEvent.name,
      enviaConsoleLogHandler
    );

    const spyEnviaConsoleLogHandler = jest.spyOn(
      enviaConsoleLogHandler,
      "handle"
    );

    const customer = new Customer("1", "John");
    const address = new Address("rua test", 123, "321", "test");
    customer.changeAddress(address);
    const event = new CustomerChangedAddressEvent(customer);
    eventDispatcher.notify(event);

    expect(
      eventDispatcher.getEventHandlers[CustomerChangedAddressEvent.name]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers[CustomerChangedAddressEvent.name].length
    ).toBe(1);
    expect(spyEnviaConsoleLogHandler).toHaveBeenCalledTimes(1);
  });
});
