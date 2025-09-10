import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';

describe('TicketTypeRequest', () => {
    test.each(['INVALID', 'ADULT', 'CHILD', 'INFANT'])('should throw an error if the type is invalid', (type) => {
        expect(() => new TicketTypeRequest(type, 1)).toThrow('Invalid ticket type');
    });

    test.each([1.5, '1.5'])('should throw an error if the number of tickets is not an integer', (noOfTickets) => {
        expect(() => new TicketTypeRequest('ADULT', noOfTickets)).toThrow('Invalid number of tickets');
    });
    
    test('should not throw an error if the number of tickets is an integer', () => {
        expect(() => new TicketTypeRequest('ADULT', 1)).not.toThrow();
    });
    
});

