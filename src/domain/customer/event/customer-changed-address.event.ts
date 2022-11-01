import EventInterface from "../../@shared/event/event.interface";
import Customer from "../entity/customer";

export default class CustomerChangedAddressEvent implements EventInterface {
  dataTimeOccurred: Date;
  eventData: Customer;

  constructor(eventData: Customer) {
    this.eventData = eventData;
    this.dataTimeOccurred = new Date();
  }
}
