package uk.gov.dwp.uc.pairtest;

import thirdparty.paymentgateway.TicketPaymentService;
import thirdparty.seatbooking.SeatReservationService;
import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest;
import uk.gov.dwp.uc.pairtest.exception.InvalidPurchaseException;
import uk.gov.dwp.uc.pairtest.factory.AccountValidatorFactory;
import uk.gov.dwp.uc.pairtest.factory.SeatReservationCalculatorFactory;
import uk.gov.dwp.uc.pairtest.factory.TicketCostCalculatorFactory;
import uk.gov.dwp.uc.pairtest.factory.TicketRequestsValidatorFactory;
import uk.gov.dwp.uc.pairtest.provider.AccountValidator;
import uk.gov.dwp.uc.pairtest.provider.SeatReservationCalculator;
import uk.gov.dwp.uc.pairtest.provider.TicketCostCalculator;
import uk.gov.dwp.uc.pairtest.provider.TicketRequestsValidator;


/**
 * Implementation of the ticket service
 */
public class TicketServiceImpl implements TicketService {

  // The external service providers
  private final TicketPaymentService tps;
  private final SeatReservationService srs;

  // The "internal" implementations
  private final AccountValidator av = AccountValidatorFactory.getAccountValidator();
  private final TicketRequestsValidator trv = TicketRequestsValidatorFactory.getTicketRequestsValidator();
  private final SeatReservationCalculator src = SeatReservationCalculatorFactory.getSeatReservationCalculator();
  private final TicketCostCalculator tcc = TicketCostCalculatorFactory.getTicketCostProvider();

  /**
   * Constructor
   *
   * @param tps the payment service
   * @param srs the reservation service
   */
  public TicketServiceImpl(TicketPaymentService tps, SeatReservationService srs) {
    this.tps = tps;
    this.srs = srs;
  }

  /**
   * Should only have private methods other than the one below.
   */

  /**
   * Validates the requests.
   * Calculates the cost of the tickets and requests payment.
   * Calculates the number of seat required and reserves the seats
   *
   * @param accountId          the account id
   * @param ticketTypeRequests the ticket requests
   * @throws InvalidPurchaseException on errors
   */
  @Override
  public void purchaseTickets(Long accountId, TicketTypeRequest... ticketTypeRequests) throws InvalidPurchaseException {

    // Reject invalid accounts
    av.validate(accountId);

    // Check the requests against the business logic
    trv.validate(ticketTypeRequests);

    // Calculate the cost
    int toPay = tcc.calculateCost(ticketTypeRequests);

    // And call the payment system
    // TODO would expect a possible failure so should account for this in future
    tps.makePayment(accountId, toPay);

    // Calculate the seats required
    int seatsRequired = src.calculateSeats(ticketTypeRequests);

    // And call the reservation service
    // TODO would expect a possible failure so should account for this in future
    srs.reserveSeat(accountId, seatsRequired);
  }
}
