import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";

describe('TicketService', () => {
    const accountId = 123456;
    let service;

    beforeEach(() => {
        service = new TicketService();
    });

    test('valid ticket purchase', async () => {
        await expect(service.purchaseTickets(accountId,
            new TicketTypeRequest('ADULT', 2),
            new TicketTypeRequest('CHILD', 1),
            new TicketTypeRequest('INFANT', 1),
        )).resolves.not.toThrow();
    });

    test('invalid accountId', async () => {
        await expect(service.purchaseTickets('0', 
            new TicketTypeRequest('ADULT', 2),
            new TicketTypeRequest('CHILD', 1),
            new TicketTypeRequest('INFANT', 1),
        )).rejects.toThrow('Invalid account ID');
    });

    test('throws exception for 0 total tickets',  async () => {
        await expect(service.purchaseTickets(accountId,
            new TicketTypeRequest('ADULT', 0),
            new TicketTypeRequest('CHILD', 0),
            new TicketTypeRequest('INFANT', 0),
        )).rejects.toThrow('Atleast one ticket must be purchased');
    });

    test('throws exception if infants > adults', async () => {
        await expect(service.purchaseTickets(accountId,
            new TicketTypeRequest('ADULT', 1),
            new TicketTypeRequest('CHILD', 1),
            new TicketTypeRequest('INFANT', 2),
        )).rejects.toThrow('Every infant must be accompanied by atleast one adult');
    });

    test('throws exception for duplicate ticket types', async () => {
        await expect(service.purchaseTickets(accountId,
            new TicketTypeRequest('ADULT', 2),
            new TicketTypeRequest('ADULT', 1),
        )).rejects.toThrow('Duplicate ticket type: ADULT');
    });

    test('throws exception for more than 25 total tickets', async () => {
        await expect(service.purchaseTickets(accountId,
            new TicketTypeRequest('ADULT', 22),
            new TicketTypeRequest('CHILD', 6),
        )).rejects.toThrow('Cannot purchase more than 25 tickets');
    });

    test('throws exception for negative ticket count', async () => {
        await expect(service.purchaseTickets(accountId,
            new TicketTypeRequest('ADULT', -2),
            new TicketTypeRequest('CHILD', 1),
        )).rejects.toThrow('Invalid number of tickets for ADULT');
    });

    test('throws exception for child or infant without adult', async () => {
        await expect(service.purchaseTickets(accountId,
            new TicketTypeRequest('ADULT', 0),
            new TicketTypeRequest('CHILD', 1),
            new TicketTypeRequest('INFANT', 1),
        )).rejects.toThrow('Child or infant tickets require at least one adult ticket');
    });

    test('allows purchase of exactly 25 total valid tickets', async () => {
        await expect(service.purchaseTickets(accountId,
            new TicketTypeRequest('ADULT', 20),
            new TicketTypeRequest('CHILD', 5),
        )).resolves.not.toThrow();
    });

    test('allows purchase of only adult tickets', async () => {
        await expect(service.purchaseTickets(accountId,
            new TicketTypeRequest('ADULT', 3)
        )).resolves.not.toThrow();
    });  

    test('throws exception when no tickets requested', async () => {
        await expect(service.purchaseTickets(1542)).rejects.toThrow('No tickets requested');
        });
});
