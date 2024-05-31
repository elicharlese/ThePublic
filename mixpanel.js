import mixpanel from 'mixpanel-browser';

mixpanel.init('YOUR_PROJECT_TOKEN');

// Track an event
mixpanel.track('Page View', { page: window.location.pathname });

// Identify a user
mixpanel.identify('USER_ID');