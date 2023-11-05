beforeEach(() => {
  cy.clearLocalStorage();
  cy.intercept({
    method: "GET",
    url: "https://api.waqi.info/feed/here/?token=*",
  }).as("getHere");
  cy.visit(Cypress.config("baseUrl"));
  // force Cypress to wait until it sees a response for the request
  cy.wait("@getHere").then((interception) => {
    assert.isNotNull(
      interception.response.body,
      "Response from API call on page load has data"
    );
  });
});

describe("Initial page load", () => {
  it("display station timezone of user's location", () => {
    cy.get('[data-testid="results"]').should("contain", "GMT");
  });

  it("local storage should contain data for user's location", () => {
    expect(localStorage.getItem("here")).to.not.be.null;
  });

  it("local storage should NOT contain cached data for Shanghai, NYC, nor Bangkok", () => {
    expect(localStorage.getItem("shanghai")).to.be.null;
    expect(localStorage.getItem("new-york-city")).to.be.null;
    expect(localStorage.getItem("bangkok")).to.be.null;
  });
});

describe("When the My Location button is clicked after page load", () => {
  it("local storage should still contain data for user's location", () => {
    expect(localStorage.getItem("here")).to.not.be.null;
  });

  it("clicking My Location should not re-fetch data, but clicking Refresh button should re-fetch data", () => {
    cy.intercept(
      {
        method: "GET",
        url: "https://api.waqi.info/feed/here/?token=*",
      },
      cy.spy().as("getRefreshedHereData")
    );

    // Data has been cached, so clicking My Location button should not re-fetch data
    cy.get('[data-testid="here"]').click();
    cy.get("@getRefreshedHereData").should("not.have.been.called"); // not yet intercepted
    expect(localStorage.getItem("here")).to.not.be.null;

    // Refresh button should trigger an API call
    cy.get('[data-testid="refresh-button"]').click();
    cy.get("@getRefreshedHereData").should("have.been.calledOnce"); // now is intercepted
  });

  it("local storage should not contain data for Shanghai, Bangkok, or NYC", () => {
    expect(localStorage.getItem("shanghai")).to.be.null;
    expect(localStorage.getItem("bangkok")).to.be.null;
    expect(localStorage.getItem("new-york-city")).to.be.null;
  });
});

describe("When a city button is clicked", () => {
  beforeEach(() => {
    cy.intercept({
      method: "GET",
      url: "https://api.waqi.info/feed/shanghai/?token=*",
    }).as("getShanghai");

    cy.get('[data-testid="shanghai"]').click();
    cy.wait("@getShanghai").then((interception) => {
      assert.isNotNull(
        interception.response.body,
        "Response from API call has city data"
      );
    });
  });

  it("clicking the city button again should not re-fetch data, but clicking Refresh button should re-fetch data", () => {
    cy.intercept(
      {
        method: "GET",
        url: "https://api.waqi.info/feed/shanghai/?token=*",
      },
      cy.spy().as("getRefreshedShanghaiData")
    );

    // Data has been cached, so clicking Bangkok button should not re-fetch data
    cy.get('[data-testid="shanghai"]').click();
    cy.get("@getRefreshedShanghaiData").should("not.have.been.called"); // not yet intercepted

    // Refresh button should trigger an API call
    cy.get('[data-testid="refresh-button"]').click();
    cy.get("@getRefreshedShanghaiData").should("have.been.calledOnce"); // now is intercepted
  });

  it("local storage should not contain data for NYC or Bangkok", () => {
    expect(localStorage.getItem("here")).to.not.be.null;
    expect(localStorage.getItem("shanghai")).to.not.be.null;
    expect(localStorage.getItem("new-york-city")).to.be.null;
    expect(localStorage.getItem("bangkok")).to.be.null;
  });
});
