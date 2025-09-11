import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';
import { TICKET_TYPES, ERROR_MESSAGES } from '../src/pairtest/constants/TicketConstants.js';

describe('TicketTypeRequest', () => {
    test('throws when type is invalid', () => {
        expect(() => new TicketTypeRequest('INVALID', 1)).toThrow(ERROR_MESSAGES.INVALID_TICKET_TYPE);
    });

    test.each([1.5, '1.5', NaN, Infinity, -1, 0])('throws when noOfTickets is invalid: %p', (noOfTickets) => {
        expect(() => new TicketTypeRequest(TICKET_TYPES.ADULT, noOfTickets)).toThrow(ERROR_MESSAGES.INVALID_TICKET_COUNT);
    });

    test('accepts valid type and positive integer count', () => {
        expect(() => new TicketTypeRequest(TICKET_TYPES.ADULT, 1)).not.toThrow();
    });

    test('is immutable: properties cannot be changed', () => {
        const req = new TicketTypeRequest(TICKET_TYPES.CHILD, 2);
        expect(req.getTicketType()).toBe(TICKET_TYPES.CHILD);
        expect(req.getNoOfTickets()).toBe(2);
        
        // Attempting to assign to private field should not affect the object
        // @ts-ignore - attempting mutation
        req.type = TICKET_TYPES.ADULT;
        // @ts-ignore - attempting mutation  
        req.noOfTickets = 5;
        
        // Values should remain unchanged
        expect(req.getTicketType()).toBe(TICKET_TYPES.CHILD);
        expect(req.getNoOfTickets()).toBe(2);
    });
});

