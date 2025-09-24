package uk.gov.dwp.uc.pairtest.domain.validator;

import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest;
import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest.Type;
import uk.gov.dwp.uc.pairtest.domain.util.TicketUtils;
import uk.gov.dwp.uc.pairtest.exception.InvalidPurchaseException;
import uk.gov.dwp.uc.pairtest.provider.TicketRequestsValidator;

/**
 * An implementation of a validator for the incoming ticket requests
 */
public class TicketRequestsValidatorImpl implements TicketRequestsValidator {

  /*
   * Given "rules"
   * =============
   *
   * There are 3 types of tickets
   * IGNORE - not relevant to validity unless it's possible to request "outside" the enum
   *
   * The ticket prices are based on the type of ticket (see table below)
   * IGNORE - not relevant to validity as we're told payment always succeeds
   *
   * The ticket purchaser declares how many and what type of tickets they want to buy
   * IGNORE - not relevant to validity
   *
   * Multiple tickets can be purchased at any given time
   * IGNORE - not relevant to validity
   *
   * Only a maximum of 25 tickets that can be purchased at a time
   * CHECK - total number requested
   *
   * Infants do not pay for a ticket and are not allocated a seat. They will be sitting on an Adult's lap.
   * CHECK - the number of infants cannot be more than the number of adults
   *
   * Child and Infant tickets cannot be purchased without purchasing an Adult ticket
   * CHECK - there must be at least one adult ticket if we're ordering child or infants
   *
   * Other
   * =====
   * Assume the array of requests must not be empty
   * Assume each request must be for at least one ticket
   *
   * TODO: Should a request that contains (say) two separate requests for the same type be considered invalid?
   */

  /**
   * The maximum number of tickets that can be bought in a single request
   */
  private static final long MAX_TICKETS = 25;

  @Override
  public void validate(TicketTypeRequest... ticketTypeRequests) throws InvalidPurchaseException {
    // Check we have some requests
    if (ticketTypeRequests == null || ticketTypeRequests.length == 0) {
      throw new InvalidPurchaseException("No ticket requests");
    }

    // Check each request is for at least one ticket
    for (TicketTypeRequest ttr : ticketTypeRequests) {
      if (ttr.getNoOfTickets() < 1) {
        throw new InvalidPurchaseException("Ticket request was for zero tickets");
      }
    }

    // Get the counts of various tickets requested
    int adult = TicketUtils.count(Type.ADULT, ticketTypeRequests);
    int child = TicketUtils.count(Type.CHILD, ticketTypeRequests);
    int infant = TicketUtils.count(Type.INFANT, ticketTypeRequests);

    // Check the total count against the maximum allowed
    // (We've inferred the total is > 0 in the check that each request is for >0 tickets)
    if (adult + child + infant > MAX_TICKETS) {
      throw new InvalidPurchaseException("Tickets requested exceed maximum allowed (%d)", MAX_TICKETS);
    }

    // Check there are some adults if there are children
    if (adult == 0 && (child > 0 || infant > 0)) {
      throw new InvalidPurchaseException("At least one adult ticket must me ordered when ordering child or infant tickets");
    }

    // Check there are at least as many adults as infants
    if (infant > adult) {
      throw new InvalidPurchaseException("Infant tickets requested (%d) exceeds adults (%d)", infant, adult);
    }

    // Valid!
  }
}
