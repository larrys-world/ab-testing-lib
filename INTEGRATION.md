# A/B Testing Integration Guide

## Quick Integration Steps

### 1. Add the script to your tool

In your tool's HTML head:
```html
<script src="https://cdn.jsdelivr.net/gh/larrys-world/ab-testing-lib@main/ab-test.min.js"></script>
```

### 2. Initialize tests for your tool

```javascript
const abTest = new ABTest({
  tests: {
    'ad_density': {
      variants: [
        { name: 'standard', weight: 50 },  // 3 ads
        { name: 'increased', weight: 50 }  // 4-5 ads
      ]
    }
  }
});
```

### 3. Apply the variants

```javascript
// For ad density test
abTest.apply('ad_density', {
  'standard': () => {
    // Show 3 ads (current setup)
  },
  'increased': () => {
    // Show 4-5 ads
    document.querySelectorAll('.extra-ad').forEach(ad => {
      ad.style.display = 'block';
    });
  }
});
```

### 4. Track conversions

```javascript
// Track when users complete the main action
document.getElementById('calculate-btn').addEventListener('click', () => {
  abTest.track('calculation_completed');
});

// Track ad interactions
document.querySelectorAll('.ad-container').forEach(ad => {
  ad.addEventListener('click', () => {
    abTest.track('ad_clicked', {
      position: ad.dataset.position
    });
  });
});
```

## Recommended Tests by Tool Type

### Financial Calculators (Tax, Mortgage, Investment)
1. **Premium Upsell Position**
   - Above results
   - Below results
   - Sidebar

2. **Ad Density**
   - Conservative (2-3 ads)
   - Balanced (3-4 ads)
   - Aggressive (4-5 ads)

3. **CTA Text**
   - "Calculate"
   - "Get Results"
   - "Calculate Free"

### Generators (Password, Lorem Ipsum)
1. **Copy Button Style**
   - Text only
   - Icon only
   - Text + Icon

2. **Generation Triggers**
   - Manual button only
   - Auto-generate on load
   - Auto-generate on change

### Converters (Unit, Currency)
1. **Layout**
   - Side by side
   - Stacked
   - Tabbed

2. **History Feature**
   - Show recent conversions
   - Hide history
   - Expandable history

## Monitoring Results

After 2 weeks, check:
1. Revenue per thousand sessions (RPM)
2. Average session duration
3. Bounce rate
4. Ad click-through rate

## Implementation Checklist

- [ ] Add ab-test.min.js to your tool
- [ ] Define 1-2 initial tests
- [ ] Implement variant logic
- [ ] Add conversion tracking
- [ ] Deploy and monitor
- [ ] Document winning variants
- [ ] Roll out winners to 100%

## Example: Tax Calculator Integration

```javascript
// In tax-calculator/index.html
const abTest = new ABTest({
  tests: {
    'monetization_strategy': {
      variants: [
        { name: 'ads_only', weight: 25 },
        { name: 'ads_plus_premium', weight: 25 },
        { name: 'email_capture', weight: 25 },
        { name: 'affiliate_links', weight: 25 }
      ]
    }
  }
});

// Apply monetization variant
abTest.apply('monetization_strategy', {
  'ads_only': () => {
    // Current setup
  },
  'ads_plus_premium': () => {
    document.getElementById('premium-cta').style.display = 'block';
  },
  'email_capture': () => {
    document.getElementById('email-modal').style.display = 'block';
  },
  'affiliate_links': () => {
    document.getElementById('tax-software-recommendations').style.display = 'block';
  }
});
```

## Next Steps

1. Pick your highest-traffic tool
2. Implement one test
3. Let it run for 2 weeks
4. Apply learnings to all tools
5. Compound improvements = higher revenue