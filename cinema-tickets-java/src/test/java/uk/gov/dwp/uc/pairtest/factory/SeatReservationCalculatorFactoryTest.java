package uk.gov.dwp.uc.pairtest.factory;

import org.junit.jupiter.api.Test;
import uk.gov.dwp.uc.pairtest.domain.seat.SeatReservationCalculatorImpl;
import uk.gov.dwp.uc.pairtest.provider.SeatReservationCalculator;

import static org.junit.jupiter.api.Assertions.assertInstanceOf;

class SeatReservationCalculatorFactoryTest {

  /**
   * Check the correct implementation is returned
   */
  @Test
  void getSeatReservationCalculator_ReturnsSeatReservationCalculatorImpl() {
    SeatReservationCalculator calculator = SeatReservationCalculatorFactory.getSeatReservationCalculator();
    assertInstanceOf(SeatReservationCalculatorImpl.class, calculator);
  }
}
