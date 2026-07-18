# Backend Services for Limin Dashboard

## Purpose and current frontend scope

The current dashboard is a frontend-only implementation. It displays a kanban-style list of quotations waiting for approval, grouped by vessel or dry dock. The mock data and the `add` interaction are intentionally local; replacing them with API calls is the next integration step.

The backend should expose versioned JSON APIs, for example under `/api/v1`, and return stable IDs rather than using a vessel name or quote number as an identifier.

## Priority 1 — required for the dashboard

### 1. Authentication and authorization service

Responsibilities:

- Sign in, sign out, refresh session/token, and retrieve the current user.
- Enforce role and permission checks for every protected endpoint.
- Support at least `viewer`, `quote_reviewer`, `quote_approver`, `operations_admin`, and `system_admin` roles.
- Return the permissions the frontend needs to decide whether the add, edit, submit, approve, reject, or notification actions should be shown.

Suggested endpoints:

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

### 2. Quote approval dashboard service

This is the main read model for the dashboard. It should avoid forcing the frontend to fetch every vessel and quote separately.

Suggested endpoint:

```http
GET /dashboard/quote-approvals?search=&cursor=&limit=50
Accept-Language: id-ID
```

Suggested response shape:

```json
{
  "data": [
    {
      "dryDock": {
        "id": "dock_01",
        "name": "Ocean Star"
      },
      "quotes": [
        {
          "id": "quote_01",
          "code": "SEPT2020/DD1",
          "customerName": "Kempell",
          "title": "Labor quotation",
          "description": "Review labor estimate and supplier coverage before approval.",
          "status": "needs_review",
          "allowedActions": ["view", "edit", "submit", "approve"]
        }
      ]
    }
  ],
  "meta": {
    "nextCursor": null,
    "totalQuotes": 12
  }
}
```

The endpoint should support server-side search by quote code, customer name, vessel name, and quote title. The data needs to be sorted deterministically, for example by approval priority and then `updatedAt` descending.

### 3. Quote lifecycle service

Responsibilities:

- Create, retrieve, update, submit, approve, reject, and archive quotations.
- Validate legal state transitions; a draft must not be approved directly if it still needs review.
- Store pricing, currency, line items, validity dates, supporting notes, and the linked dry dock/work order.
- Return a conflict response when a record has changed since the user opened it.

Suggested endpoints:

- `POST /quotes`
- `GET /quotes/{quoteId}`
- `PATCH /quotes/{quoteId}`
- `POST /quotes/{quoteId}/submit`
- `POST /quotes/{quoteId}/approve`
- `POST /quotes/{quoteId}/reject`
- `GET /quotes/{quoteId}/history`

Recommended quote states:

`draft` → `needs_review` → `awaiting_finance` → `ready_to_approve` → `approved` or `rejected`.

`clarification_needed` should return the quote to the appropriate prior step while preserving its audit trail.

### 4. Dry dock and vessel master-data service

Responsibilities:

- Manage dry dock, vessel, customer, yard, and work-window data.
- Provide the grouping and display metadata used by the dashboard.
- Prevent a quote from being attached to an inactive or inaccessible dock.

Suggested endpoints:

- `GET /dry-docks`
- `GET /dry-docks/{dryDockId}`
- `GET /vessels`
- `GET /customers`

## Priority 2 — required by the rest of the reference navigation

### 5. Specification group service

Stores reusable groups of technical specifications and their version history.

- `GET /specification-groups`
- `POST /specification-groups`
- `GET /specification-groups/{groupId}`
- `PATCH /specification-groups/{groupId}`

### 6. Work order master service

Owns work-order templates, assigned vessel/dock information, scope items, dates, and work-order status.

- `GET /work-orders`
- `POST /work-orders`
- `GET /work-orders/{workOrderId}`
- `PATCH /work-orders/{workOrderId}`

### 7. Checklist service

Owns checklist templates and each work order's completion state.

- `GET /checklist-templates`
- `GET /work-orders/{workOrderId}/checklists`
- `PATCH /checklist-items/{checklistItemId}`

### 8. Attachment service

Quotes, work orders, and checklists will need invoices, drawings, photos, and technical documents.

- Generate pre-signed upload/download URLs or proxy the files through the API.
- Validate MIME type, file size, malware scanning result, and authorization before exposing a file.
- Store attachment metadata separately from object storage.

## Cross-cutting backend capabilities

### Notifications

Create in-app notifications when a quote is assigned, submitted, requires clarification, approved, or rejected. A first release can use polling via `GET /notifications`; a later release can add Server-Sent Events or WebSocket updates so board cards update without a manual refresh.

### Audit log

Every quote state transition, price change, role-sensitive action, and attachment change should create an immutable audit event containing actor, time, previous value, new value, and reason. Expose it through `GET /quotes/{quoteId}/history`.

### Localization

Read the request `Accept-Language` header for backend-provided labels, status names, validation messages, dates, and currency formatting where applicable. When the frontend language changes, it should refetch localized dashboard data.

### Error and concurrency contract

Use a consistent error envelope:

```json
{
  "error": {
    "code": "QUOTE_VERSION_CONFLICT",
    "message": "The quote has changed since it was opened.",
    "fieldErrors": {}
  }
}
```

Use `401` for unauthenticated requests, `403` for insufficient permissions, `404` for inaccessible records, `409` for version/state conflicts, and `422` for validation failures. Include a `version` or `updatedAt` field on mutable records so the API can reject lost updates.

## Recommended integration order

1. Authentication and `GET /dashboard/quote-approvals`.
2. Quote detail, create, edit, and submit flows.
3. Approval/rejection, audit log, and notifications.
4. Specification groups, work orders, checklists, and attachments.

When the API is introduced, keep the API call in a page-specific composable or service. The project convention requires Promise chains (`.then()`, `.catch()`, `.finally()`) for API calls, with `console.error` only inside the `catch` block.
