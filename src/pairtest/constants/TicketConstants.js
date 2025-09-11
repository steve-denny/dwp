const TICKET_TYPES = Object.freeze({
    ADULT: "ADULT",
    CHILD: "CHILD",
    INFANT: "INFANT",
});

const ERROR_MESSAGE_TYPE = Object.freeze({
    INVALID_ACCOUNT_ID: "INVALID_ACCOUNT_ID",   
    INVALID_TICKET_TYPE_REQUEST: "INVALID_TICKET_TYPE_REQUEST",
    MAX_TICKETS: "MAX_TICKETS",
    CHILD_INFANT_WITHOUT_ADULT: "CHILD_INFANT_WITHOUT_ADULT",
    INVALID_TICKET_TYPE: "INVALID_TICKET_TYPE",
    INVALID_TICKET_COUNT: "INVALID_TICKET_COUNT",
    INFANT_TICKET_LIMIT: "INFANT_TICKET_LIMIT",
});


const TICKET_PRICES = Object.freeze({
    [TICKET_TYPES.ADULT]: 25,
    [TICKET_TYPES.CHILD]: 15,
    [TICKET_TYPES.INFANT]: 0,
});

const ERROR_MESSAGES = Object.freeze({
    [ERROR_MESSAGE_TYPE.INVALID_ACCOUNT_ID]: "Account ID must be a positive integer greater than 0",
    [ERROR_MESSAGE_TYPE.INVALID_TICKET_TYPE_REQUEST]: "Invalid ticket type request",
    [ERROR_MESSAGE_TYPE.MAX_TICKETS]: (maxTickets) => `Maximum of ${maxTickets} tickets can be purchased`,
    [ERROR_MESSAGE_TYPE.CHILD_INFANT_WITHOUT_ADULT]: "Child and infant tickets must be purchased with an adult ticket",
    [ERROR_MESSAGE_TYPE.INVALID_TICKET_TYPE]: "Type must be ADULT, CHILD, or INFANT",
    [ERROR_MESSAGE_TYPE.INVALID_TICKET_COUNT]: "number of tickets must be a positive integer",
    [ERROR_MESSAGE_TYPE.INFANT_TICKET_LIMIT]: "Number of infant tickets must be less than or equal to the number of adult tickets",
});

const MAX_TICKET = 25;

export { TICKET_TYPES, TICKET_PRICES, ERROR_MESSAGE_TYPE, ERROR_MESSAGES, MAX_TICKET };