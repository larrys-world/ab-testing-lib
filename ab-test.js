/**
 * Lightweight A/B Testing Library for Static Sites
 * Designed to work with GitHub Pages and static hosting
 */

class ABTest {
  constructor(config = {}) {
    this.tests = config.tests || {};
    this.cookieDuration = config.cookieDuration || 30; // days
    this.analyticsCallback = config.analyticsCallback || null;
    this.debug = config.debug || false;
  }

  /**
   * Get or assign a variant for a test
   * @param {string} testName - Name of the test
   * @returns {string} - Variant name (e.g., 'control', 'variant1')
   */
  getVariant(testName) {
    const test = this.tests[testName];
    if (!test) {
      console.warn(`A/B test "${testName}" not found`);
      return 'control';
    }

    // Check if user already has a variant assigned
    const cookieName = `ab_${testName}`;
    let variant = this.getCookie(cookieName);

    if (!variant) {
      // Assign new variant based on weights
      variant = this.assignVariant(test.variants);
      this.setCookie(cookieName, variant, this.cookieDuration);
      
      // Track assignment
      this.track('ab_test_assigned', {
        test: testName,
        variant: variant
      });
    }

    if (this.debug) {
      console.log(`A/B Test: ${testName} = ${variant}`);
    }

    return variant;
  }

  /**
   * Assign a variant based on weights
   * @param {Array} variants - Array of {name, weight} objects
   * @returns {string} - Selected variant name
   */
  assignVariant(variants) {
    const totalWeight = variants.reduce((sum, v) => sum + (v.weight || 1), 0);
    let random = Math.random() * totalWeight;
    
    for (const variant of variants) {
      random -= (variant.weight || 1);
      if (random <= 0) {
        return variant.name;
      }
    }
    
    return variants[0].name; // Fallback
  }

  /**
   * Track an event (conversion, click, etc.)
   * @param {string} eventName - Name of the event
   * @param {Object} data - Additional event data
   */
  track(eventName, data = {}) {
    // Add current test variants to event data
    const enrichedData = { ...data };
    for (const testName in this.tests) {
      enrichedData[`ab_${testName}`] = this.getVariant(testName);
    }

    // Send to Google Analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, enrichedData);
    }

    // Custom analytics callback
    if (this.analyticsCallback) {
      this.analyticsCallback(eventName, enrichedData);
    }

    if (this.debug) {
      console.log('A/B Test Event:', eventName, enrichedData);
    }
  }

  /**
   * Apply a test variant to the page
   * @param {string} testName - Name of the test
   * @param {Object} handlers - Object with variant names as keys and functions as values
   */
  apply(testName, handlers) {
    const variant = this.getVariant(testName);
    const handler = handlers[variant];
    
    if (handler && typeof handler === 'function') {
      handler();
    } else if (handlers.default) {
      handlers.default();
    }
  }

  // Cookie utilities
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  }

  /**
   * Get test results summary (for debugging)
   * @returns {Object} - Current variant assignments
   */
  getTestSummary() {
    const summary = {};
    for (const testName in this.tests) {
      summary[testName] = this.getVariant(testName);
    }
    return summary;
  }

  /**
   * Force a specific variant (for testing)
   * @param {string} testName - Name of the test
   * @param {string} variant - Variant to force
   */
  forceVariant(testName, variant) {
    const cookieName = `ab_${testName}`;
    this.setCookie(cookieName, variant, this.cookieDuration);
  }

  /**
   * Clear all test assignments
   */
  clearTests() {
    for (const testName in this.tests) {
      const cookieName = `ab_${testName}`;
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    }
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ABTest;
}