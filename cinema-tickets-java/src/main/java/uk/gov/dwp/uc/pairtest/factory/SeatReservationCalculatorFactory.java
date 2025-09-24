package uk.gov.dwp.uc.pairtest.factory;

import uk.gov.dwp.uc.pairtest.domain.seat.SeatReservationCalculatorImpl;
import uk.gov.dwp.uc.pairtest.provider.SeatReservationCalculator;

/**
 * Seat reservation calculator factory
 */
public class SeatReservationCalculatorFactory {

  // Prevent instantiation
  private SeatReservationCalculatorFactory() {
  }

  /**
   * Factory
   *
   * @return a seat reservation calculator
   */
  public static SeatReservationCalculator getSeatReservationCalculator() {
    // TODO some logic to read configuration and choose the provider to use
    return new SeatReservationCalculatorImpl();
  }
}
