import TicketTypeRequest from "./src/pairtest/lib/TicketTypeRequest.js";
import TicketService from "./src/pairtest/TicketService.js";

const TicketServiceInstance = new TicketService();

try{
   await TicketServiceInstance.purchaseTickets(112233,
        new TicketTypeRequest('ADULT',4),
        new TicketTypeRequest('CHILD', 1),
        new TicketTypeRequest('INFANT', 2)
    );
    console.log('Ticket purchase successful');
} catch(error) {
    console.error(`purchase failed: ${error.message}`);
}