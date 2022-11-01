import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import CustomerRegisteredEvent from "./customer-registered.event";
import EnviaConsoleLog1Handler from "./handler/envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "./handler/envia-console-log-2.handler";

describe("Customer registered event tests", () => {
  it("should notify two time when a customer was registered", () => {
    const eventDispatcher = new EventDispatcher();
    const enviaConsoleLog1Handler = new EnviaConsoleLog1Handler();
    const enviaConsoleLog2Handler = new EnviaConsoleLog2Handler();
    eventDispatcher.register(
      CustomerRegisteredEvent.name,
      enviaConsoleLog1Handler
    );
    eventDispatcher.register(
      CustomerRegisteredEvent.name,
      enviaConsoleLog2Handler
    );

    const spyEnviaConsoleLog1Handler = jest.spyOn(
      enviaConsoleLog1Handler,
      "handle"
    );
    const spyEnviaConsoleLog2Handler = jest.spyOn(
      enviaConsoleLog2Handler,
      "handle"
    );

    const customer = new Customer("1", "John");
    const event = new CustomerRegisteredEvent(null);
    eventDispatcher.notify(event);

    expect(
      eventDispatcher.getEventHandlers[CustomerRegisteredEvent.name]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers[CustomerRegisteredEvent.name].length
    ).toBe(2);
    expect(spyEnviaConsoleLog1Handler).toHaveBeenCalledTimes(1);
    expect(spyEnviaConsoleLog2Handler).toHaveBeenCalledTimes(1);
  });
});
