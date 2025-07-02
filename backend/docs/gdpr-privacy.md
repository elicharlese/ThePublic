# GDPR & Privacy Compliance for ThePublic Backend

## Overview
ThePublic is committed to ensuring user data privacy and compliance with the General Data Protection Regulation (GDPR) and other relevant privacy laws. This document outlines the technical and organizational measures implemented to protect user data and ensure compliance.

---

## 1. Data Minimization
- Only collect data necessary for user authentication, node operation, and rewards.
- No unnecessary personal data is stored.

## 2. User Consent
- Explicit consent is required for account creation and data processing.
- Users can withdraw consent and request data deletion at any time.

## 3. Data Subject Rights
- **Access:** Users can request a copy of their data via the API or support.
- **Rectification:** Users can update their profile and node information.
- **Erasure:** Users can request account and data deletion (API endpoint provided).
- **Portability:** Users can export their data in a machine-readable format.

## 4. Data Security
- All data is encrypted in transit (TLS) and at rest (Supabase/Postgres encryption).
- Passwords are hashed using bcrypt; wallet secrets are never stored.
- Access to sensitive data is restricted by role-based access control (RBAC).

## 5. Data Retention & Deletion
- User data is retained only as long as necessary for service provision.
- Automated scripts and API endpoints support data deletion and anonymization.

## 6. Data Breach Notification
- Security incidents are logged and monitored.
- Users and authorities will be notified of breaches within 72 hours as required by GDPR.

## 7. Third-Party Processors
- Supabase and Vercel are used for hosting and storage; both are GDPR-compliant.
- Data processing agreements (DPAs) are in place with all vendors.

## 8. Privacy by Design
- Privacy is considered at every stage of development.
- Regular reviews and audits are conducted to ensure ongoing compliance.

## 9. Contact & Requests
- Users can contact support for privacy-related requests at privacy@thepublic.network.

---

_Last updated: July 2, 2025_
