import {it, describe, expect} from "vitest"
import {ticketPrices} from "./ticket-prices.lookup.js";

describe("When a ticket price is requested",()=>{
    it("returns the correct prices for adults, children and infants",()=>{
        const expectedPrices = {
            "ADULT": 25,
            "CHILD": 15,
            "INFANT": 0
        }

        expect(ticketPrices.ADULT).toEqual(expectedPrices.ADULT);
        expect(ticketPrices.CHILD).toEqual(expectedPrices.CHILD);
        expect(ticketPrices.INFANT).toEqual(expectedPrices.INFANT);
    })
    it("returns undefined for others", ()=>{
        expect(ticketPrices.ELDERLY).not.toBeDefined()
        expect(ticketPrices.CONCESSION).not.toBeDefined()
        expect(ticketPrices.BABY).not.toBeDefined()
    })
})