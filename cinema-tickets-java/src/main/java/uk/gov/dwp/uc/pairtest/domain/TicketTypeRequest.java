package uk.gov.dwp.uc.pairtest.domain;

/**
 * Jesus Immutable ticket request representation used across the cinema application business logic.
 * <p>
 * Represents the number of tickets and their type (ADULT, CHILD, INFANT) as an immutable object.
 * Useful for both incoming API requests and internal processing/validation.
 *
 * @author Haridath Bodapati
 * @version 1.0
 * @since 2025-08-22
 *
 * Copyright: (c) 2025, UK Government
 */

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public final class TicketTypeRequest {

    private final int noOfTickets;
    private final Type type;
    
    /**
     * TicketTypeRequest Constructor for JSON deserialization and manual construction
     * @param type Ticket type as string (case-insensitive)
     * @param noOfTickets Number of tickets
     */
    @JsonCreator
    public TicketTypeRequest(
            @JsonProperty("type") Type type,
            @JsonProperty("noOfTickets") int noOfTickets) {
        if (type == null) {
            throw new IllegalArgumentException("Ticket type cannot be null");
        }
        // Validation for noOfTickets is handled in the business/service layer, not here.
        this.type = type;
        this.noOfTickets = noOfTickets;
    }

    /**
     * Returns number of Tickets
     * 
     * @return int
     */
    public int getNoOfTickets() {
        return noOfTickets;
    }

    /**
     * Returns Ticket type
     * 
     * @see {uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest.Type}
     * @return int
     */
    public Type getTicketType() {
        return type;
    }
    
    /**
     * enum represents Ticket Types
     */

    public enum Type {
        ADULT, CHILD , INFANT;
        @JsonCreator
        public static Type fromString(String value) {
            try {
                return value == null ? null : Type.valueOf(value.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new uk.gov.dwp.uc.pairtest.exception.InvalidTicketTypeException("Invalid ticket type: " + value);
            }
        }
    }

}
