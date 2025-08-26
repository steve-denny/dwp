/**
 * Jesus    This class is the main spring boot application app.
 */
package uk.gov.dwp.uc.pairtest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
/**
 * Cinema Tickets Application entry point.
 *
 * @author haridath.bodapati
 * @version 1.0
 * @since 2025-08-21
 */
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import uk.gov.dwp.uc.pairtest.config.TicketProperties;


@SpringBootApplication
@EnableConfigurationProperties(TicketProperties.class)
public class CinemaTicketsApplication {

    public static void main(String[] args) {
        SpringApplication.run(CinemaTicketsApplication.class, args);
    }
}