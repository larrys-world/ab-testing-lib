# A/B Testing Library for Static Sites

A lightweight, zero-dependency A/B testing library designed for static websites hosted on GitHub Pages, Vercel, or any CDN. Perfect for optimizing ad placements, layouts, and user experience on revenue-generating tools.

## Features

- 🪶 **Lightweight**: ~4KB unminified, zero dependencies
- 🍪 **Cookie-based persistence**: Users see consistent variants
- 📊 **Google Analytics integration**: Automatic event tracking
- 🎯 **Weighted distribution**: Control traffic split between variants
- 🔧 **Easy integration**: Drop-in script for any static site
- 🐛 **Debug mode**: See which variants are active

## Quick Start

1. Include the script in your HTML:
```html
<script src="https://cdn.jsdelivr.net/gh/larrys-world/ab-testing-lib@main/ab-test.js"></script>
```

2. Initialize with your tests:
```javascript
const abTest = new ABTest({
  tests: {
    'ad_placement': {
      variants: [
        { name: 'control', weight: 50 },
        { name: 'above_fold', weight: 50 }
      ]
    }
  }
});
```

3. Apply variants:
```javascript
abTest.apply('ad_placement', {
  'control': () => {
    // Default behavior
  },
  'above_fold': () => {
    // Show ad above fold
    document.getElementById('top-ad').style.display = 'block';
  }
});
```

4. Track conversions:
```javascript
// Track any meaningful action
abTest.track('purchase_completed', {
  value: 29.99
});
```

## Common Use Cases

### 1. Ad Placement Optimization
Test different ad positions to maximize revenue without hurting user experience:

```javascript
const abTest = new ABTest({
  tests: {
    'ad_strategy': {
      variants: [
        { name: 'conservative', weight: 33 },  // 2 ads, below fold
        { name: 'balanced', weight: 33 },      // 3 ads, one above fold  
        { name: 'aggressive', weight: 34 }     // 4 ads, two above fold
      ]
    }
  }
});
```

### 2. Color Scheme Testing
Test which design converts better:

```javascript
abTest.apply('theme', {
  'light': () => document.body.className = 'theme-light',
  'dark': () => document.body.className = 'theme-dark',
  'high_contrast': () => document.body.className = 'theme-hc'
});
```

### 3. CTA Button Testing
Test different call-to-action texts:

```javascript
abTest.apply('cta_text', {
  'calculate': () => {
    document.querySelector('.cta-button').textContent = 'Calculate Now';
  },
  'get_results': () => {
    document.querySelector('.cta-button').textContent = 'Get Results';
  },
  'try_free': () => {
    document.querySelector('.cta-button').textContent = 'Try It Free';
  }
});
```

## API Reference

### Constructor Options

```javascript
new ABTest({
  tests: {},           // Test configurations
  cookieDuration: 30,  // Days to persist variant assignment
  analyticsCallback: null, // Custom analytics function
  debug: false         // Enable debug logging
});
```

### Methods

#### `getVariant(testName)`
Get the assigned variant for a test.

#### `apply(testName, handlers)`
Apply different code based on the variant.

#### `track(eventName, data)`
Track an event with variant data automatically included.

#### `forceVariant(testName, variant)`
Force a specific variant (useful for testing).

#### `clearTests()`
Clear all variant assignments.

#### `getTestSummary()`
Get current variant assignments for all tests.

## Integration with Our Tools

### 1. Add to any tool
```bash
# In your tool's repository
curl -O https://raw.githubusercontent.com/larrys-world/ab-testing-lib/main/ab-test.js
```

### 2. Standard implementation pattern
```javascript
// Initialize on page load
const abTest = new ABTest({
  tests: {
    'monetization': {
      variants: [
        { name: 'adsense_only', weight: 25 },
        { name: 'adsense_plus_affiliate', weight: 25 },
        { name: 'premium_upsell', weight: 25 },
        { name: 'email_capture', weight: 25 }
      ]
    }
  }
});

// Apply variant
abTest.apply('monetization', {
  'adsense_only': setupAdsOnly,
  'adsense_plus_affiliate': setupAdsAndAffiliate,
  'premium_upsell': setupPremiumUpsell,
  'email_capture': setupEmailCapture
});

// Track key metrics
document.getElementById('calculate').addEventListener('click', () => {
  abTest.track('tool_used');
});
```

### 3. View results in Google Analytics
- Events appear as `ab_test_assigned`, `tool_used`, etc.
- Each event includes variant data: `ab_monetization: "adsense_only"`
- Create segments in GA to compare performance

## Best Practices

1. **Run tests for 2+ weeks** to account for weekly patterns
2. **Test one major change at a time** for clear results  
3. **Define success metrics upfront** (revenue, time on site, conversions)
4. **Document winning variants** in your tool's README
5. **Don't test too many variants** - you need sufficient traffic per variant

## Statistical Significance

For a 95% confidence level, you need approximately:
- 400 conversions per variant for a 10% difference
- 1,600 conversions per variant for a 5% difference
- 6,400 conversions per variant for a 2.5% difference

## Example Results Dashboard

Track your A/B test results:

| Test | Variant | Sessions | Revenue | RPM | Winner |
|------|---------|----------|---------|-----|--------|
| ad_placement | control | 5,000 | $45.00 | $9.00 | |
| ad_placement | above_fold | 5,100 | $56.10 | $11.00 | ✓ |
| ad_count | three_ads | 4,900 | $44.10 | $9.00 | |
| ad_count | four_ads | 5,200 | $52.00 | $10.00 | ✓ |

## License

MIT License - Use freely in all Larry's World tools

## Support

For issues or questions, update the task in the kanban board.